'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { parseCSV, type ParseResult } from '@/lib/csv'
import { uploadRosterAction } from '@/app/admin/actions'

export function CsvUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setStatusMessage(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = String(e.target?.result ?? '')
      const result = parseCSV(text)
      setParseResult(result)
    }
    reader.readAsText(file)
  }

  function handleReset() {
    setParseResult(null)
    setFileName('')
    setStatusMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleConfirmUpload() {
    if (!parseResult || parseResult.validRows.length === 0) return

    setStatusMessage(null)
    startTransition(async () => {
      const payload = JSON.stringify(parseResult.validRows)
      const res = await uploadRosterAction(payload)

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Success: Successfully deployed ${res.count} Marine participants to the roster.`,
        })
        setParseResult(null)
        setFileName('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error ?? 'Upload failed: Database error occurred.',
        })
      }
    })
  }

  return (
    <section className="uploader-section" aria-labelledby="uploader-title">
      <div className="uploader-header">
        <h2 id="uploader-title" className="uploader-title">ROSTER MANIFEST UPLOADER</h2>
        <a href="/sample.csv" download className="btn-secondary sample-link">
          Download sample.csv
        </a>
      </div>

      <div className="file-dropzone">
        <label htmlFor="csv-file-input" className="file-label">
          {fileName ? `Selected File: ${fileName}` : 'Choose CSV Manifest to Upload'}
        </label>
        <input
          id="csv-file-input"
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      {statusMessage && (
        <div className={`status-banner status-${statusMessage.type}`} role="alert">
          <p>{statusMessage.text}</p>
          {statusMessage.type === 'success' && (
            <Link href="/" target="_blank" rel="noopener noreferrer" className="btn-primary view-link">
              View Public Roster
            </Link>
          )}
        </div>
      )}

      {parseResult && (
        <div className="preview-container">
          <div className="preview-header">
            <h3 className="preview-heading">MANIFEST PREVIEW</h3>
            <span className="valid-count-pill">
              Valid Entries: {parseResult.validRows.length}
            </span>
          </div>

          {/* Counts by event */}
          {Object.keys(parseResult.countsByEvent).length > 0 && (
            <div className="preview-table-wrap">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Event Operation</th>
                    <th className="text-right">Marines Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(parseResult.countsByEvent).map(([eventName, count]) => (
                    <tr key={eventName}>
                      <td>{eventName}</td>
                      <td className="text-right">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Error rows warning */}
          {parseResult.errorRows.length > 0 && (
            <div className="errors-box">
              <h4 className="errors-heading">
                Warning: {parseResult.errorRows.length} invalid row
                {parseResult.errorRows.length > 1 ? 's' : ''} will be ignored:
              </h4>
              <ul className="errors-list">
                {parseResult.errorRows.map((err, i) => (
                  <li key={i}>
                    Line {err.line}: {err.reason} {err.name ? `(Name: "${err.name}")` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="preview-actions">
            <button
              type="button"
              onClick={handleConfirmUpload}
              disabled={parseResult.validRows.length === 0 || isPending}
              className="btn-primary upload-btn"
            >
              {isPending ? 'DEPLOYING TO DATABASE...' : 'CONFIRM AND REPLACE ROSTER'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
