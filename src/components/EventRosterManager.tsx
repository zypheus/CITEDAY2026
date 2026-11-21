'use client'

import { useState, useTransition, useRef } from 'react'
import Papa from 'papaparse'
import type { EventWithParticipants } from '@/lib/events'
import { CATEGORY_LABELS } from '@/lib/constants'
import {
  addSingleParticipantAction,
  deleteParticipantAction,
  updateEventRosterAction,
} from '@/app/admin/actions'

interface EventRosterManagerProps {
  events: EventWithParticipants[]
}

type InputSubTab = 'single' | 'bulk' | 'csv'
type ImportMode = 'append' | 'replace'

export function EventRosterManager({ events }: EventRosterManagerProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id ?? ''
  )
  const [subTab, setSubTab] = useState<InputSubTab>('single')
  const [singleName, setSingleName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [bulkMode, setBulkMode] = useState<ImportMode>('append')
  const [csvMode, setCsvMode] = useState<ImportMode>('append')
  const [csvParsedNames, setCsvParsedNames] = useState<string[]>([])
  const [csvFileName, setCsvFileName] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const csvInputRef = useRef<HTMLInputElement>(null)

  const currentEvent = events.find((e) => e.id === selectedEventId) ?? events[0]

  function clearNotifications() {
    setMessage(null)
  }

  function handleSelectEvent(id: string) {
    setSelectedEventId(id)
    clearNotifications()
    setSingleName('')
    setBulkText('')
    setCsvParsedNames([])
    setCsvFileName('')
    if (csvInputRef.current) csvInputRef.current.value = ''
  }

  // Action 1: Add Single Participant
  function handleAddSingle(e: React.FormEvent) {
    e.preventDefault()
    if (!singleName.trim() || !currentEvent) return

    clearNotifications()
    startTransition(async () => {
      const res = await addSingleParticipantAction(currentEvent.id, singleName)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({
          type: 'success',
          text: `Added "${singleName.trim()}" to ${currentEvent.name}.`,
        })
        setSingleName('')
      }
    })
  }

  // Action 2: Delete Participant
  function handleDelete(participantId: string, name: string) {
    if (!confirm(`Are you sure you want to remove "${name}" from ${currentEvent.name}?`)) {
      return
    }

    clearNotifications()
    startTransition(async () => {
      const res = await deleteParticipantAction(participantId)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({
          type: 'success',
          text: `Removed "${name}" from ${currentEvent.name}.`,
        })
      }
    })
  }

  // Action 3: Bulk Paste Submit
  function handleBulkSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bulkText.trim() || !currentEvent) return

    // Split by newlines or commas
    const lines = bulkText
      .split(/[\r\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)

    if (lines.length === 0) {
      setMessage({ type: 'error', text: 'No names found in the pasted text.' })
      return
    }

    clearNotifications()
    startTransition(async () => {
      const res = await updateEventRosterAction(currentEvent.id, lines, bulkMode)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({
          type: 'success',
          text: `Successfully ${bulkMode === 'replace' ? 'replaced with' : 'added'} ${res.count} participant(s) for ${currentEvent.name}.`,
        })
        setBulkText('')
      }
    })
  }

  // Action 4: Parse Per-Event CSV
  function handleCsvFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFileName(file.name)
    clearNotifications()

    const reader = new FileReader()
    reader.onload = (event) => {
      const rawText = String(event.target?.result ?? '').replace(/^\uFEFF/, '')
      const parsed = Papa.parse<Record<string, string> | string[]>(rawText, {
        header: false,
        skipEmptyLines: true,
      })

      const extractedNames: string[] = []
      parsed.data.forEach((row, idx) => {
        if (Array.isArray(row)) {
          // Check if first row is header
          const firstCell = String(row[0] ?? '').trim()
          if (idx === 0 && (firstCell.toLowerCase() === 'name' || firstCell.toLowerCase() === 'full_name' || firstCell.toLowerCase() === 'participant')) {
            return
          }
          if (firstCell) extractedNames.push(firstCell)
        } else if (typeof row === 'object' && row !== null) {
          const val = row['name'] ?? row['full_name'] ?? Object.values(row)[0]
          if (val && String(val).trim()) extractedNames.push(String(val).trim())
        }
      })

      setCsvParsedNames(Array.from(new Set(extractedNames)))
    }
    reader.readAsText(file)
  }

  function handleCsvSubmit() {
    if (csvParsedNames.length === 0 || !currentEvent) return

    clearNotifications()
    startTransition(async () => {
      const res = await updateEventRosterAction(currentEvent.id, csvParsedNames, csvMode)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({
          type: 'success',
          text: `Successfully deployed ${res.count} participant(s) from CSV to ${currentEvent.name}.`,
        })
        setCsvParsedNames([])
        setCsvFileName('')
        if (csvInputRef.current) csvInputRef.current.value = ''
      }
    })
  }

  if (!currentEvent) {
    return <div className="no-events-state">No events available in database.</div>
  }

  const categoryLabel = CATEGORY_LABELS[currentEvent.category] ?? currentEvent.category

  return (
    <div className="event-manager-card">
      <div className="event-manager-header">
        <div>
          <span className="badge category-badge">{categoryLabel}</span>
          <h2 className="event-manager-title">EVENT ROSTER MANAGER</h2>
          <p className="event-manager-subtitle">
            Manage participants for each competition individually
          </p>
        </div>

        {/* Event Select Dropdown */}
        <div className="event-select-box">
          <label htmlFor="event-selector" className="field-label">
            Select Operation ({events.length} Events):
          </label>
          <select
            id="event-selector"
            value={currentEvent.id}
            onChange={(e) => handleSelectEvent(e.target.value)}
            className="event-select-dropdown"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {String(ev.sort_order).padStart(2, '0')}. {ev.name} ({ev.participants.length} enlisted)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notification Banner */}
      {message && (
        <div className={`status-banner status-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Main Grid: Left = Input Methods, Right = Live Participant Roster */}
      <div className="event-manager-grid">
        {/* Left Column: Input Panel */}
        <div className="input-panel">
          <div className="input-tabs-bar">
            <button
              type="button"
              onClick={() => { setSubTab('single'); clearNotifications(); }}
              className={`input-tab-btn ${subTab === 'single' ? 'input-tab-active' : ''}`}
            >
              1. Single Add
            </button>
            <button
              type="button"
              onClick={() => { setSubTab('bulk'); clearNotifications(); }}
              className={`input-tab-btn ${subTab === 'bulk' ? 'input-tab-active' : ''}`}
            >
              2. Bulk Paste
            </button>
            <button
              type="button"
              onClick={() => { setSubTab('csv'); clearNotifications(); }}
              className={`input-tab-btn ${subTab === 'csv' ? 'input-tab-active' : ''}`}
            >
              3. Event CSV
            </button>
          </div>

          {/* SubTab 1: Single Add */}
          {subTab === 'single' && (
            <form onSubmit={handleAddSingle} className="subtab-form">
              <label htmlFor="single-name-input" className="field-label">
                Add Marine to {currentEvent.name}:
              </label>
              <div className="input-with-button">
                <input
                  id="single-name-input"
                  type="text"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="text-input"
                  disabled={isPending}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!singleName.trim() || isPending}
                  className="btn-primary"
                >
                  {isPending ? 'Adding...' : 'Add Marine'}
                </button>
              </div>
              <p className="input-hint">
                Adds a single participant to this event without affecting other names.
              </p>
            </form>
          )}

          {/* SubTab 2: Bulk Paste */}
          {subTab === 'bulk' && (
            <form onSubmit={handleBulkSubmit} className="subtab-form">
              <label htmlFor="bulk-textarea" className="field-label">
                Paste Multiple Names for {currentEvent.name}:
              </label>
              <textarea
                id="bulk-textarea"
                rows={6}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Juan Dela Cruz&#10;Maria Santos&#10;Pedro Reyes"
                className="text-area-input"
                disabled={isPending}
              />

              <div className="mode-toggle-group">
                <span className="mode-label">Mode:</span>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="bulkMode"
                    value="append"
                    checked={bulkMode === 'append'}
                    onChange={() => setBulkMode('append')}
                  />
                  <span>Append to existing</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="bulkMode"
                    value="replace"
                    checked={bulkMode === 'replace'}
                    onChange={() => setBulkMode('replace')}
                  />
                  <span className="text-warning">Replace event roster</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!bulkText.trim() || isPending}
                className="btn-primary"
              >
                {isPending ? 'Deploying...' : `Deploy Names to ${currentEvent.name}`}
              </button>
              <p className="input-hint">
                Names separated by newlines or commas are normalized and deduplicated.
              </p>
            </form>
          )}

          {/* SubTab 3: Per-Event CSV */}
          {subTab === 'csv' && (
            <div className="subtab-form">
              <label htmlFor="event-csv-file" className="field-label">
                Upload CSV just for {currentEvent.name}:
              </label>

              <div className="csv-drop-well">
                <input
                  id="event-csv-file"
                  ref={csvInputRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleCsvFileSelect}
                  className="file-input"
                  disabled={isPending}
                />
                <span className="file-desc">
                  {csvFileName ? `Loaded: ${csvFileName}` : 'Select CSV or TXT with names'}
                </span>
              </div>

              {csvParsedNames.length > 0 && (
                <div className="csv-preview-box">
                  <p className="preview-meta">
                    Detected <strong>{csvParsedNames.length}</strong> unique name(s):
                  </p>
                  <ul className="preview-mini-list">
                    {csvParsedNames.slice(0, 5).map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                    {csvParsedNames.length > 5 && (
                      <li className="text-muted">...and {csvParsedNames.length - 5} more</li>
                    )}
                  </ul>

                  <div className="mode-toggle-group">
                    <span className="mode-label">Mode:</span>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="csvMode"
                        value="append"
                        checked={csvMode === 'append'}
                        onChange={() => setCsvMode('append')}
                      />
                      <span>Append to existing</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="csvMode"
                        value="replace"
                        checked={csvMode === 'replace'}
                        onChange={() => setCsvMode('replace')}
                      />
                      <span className="text-warning">Replace event roster</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleCsvSubmit}
                    disabled={isPending}
                    className="btn-primary"
                  >
                    {isPending ? 'Deploying...' : `Deploy ${csvParsedNames.length} Names`}
                  </button>
                </div>
              )}

              <p className="input-hint">
                The CSV only needs a list of names. No event column required.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Live Roster for Selected Event */}
        <div className="live-roster-panel">
          <div className="roster-panel-header">
            <h3 className="roster-panel-title">
              CURRENT ROSTER ({currentEvent.participants.length})
            </h3>
            <span className="event-pill">{currentEvent.name}</span>
          </div>

          {currentEvent.participants.length === 0 ? (
            <div className="empty-roster-box">
              <p>No participants enrolled in {currentEvent.name} yet.</p>
              <p className="empty-roster-hint">
                Use the inputs on the left to add your first Marines.
              </p>
            </div>
          ) : (
            <ul className="manage-names-list">
              {currentEvent.participants.map((p, idx) => (
                <li key={p.id} className="manage-name-item">
                  <div className="manage-name-info">
                    <span className="manage-name-index">{String(idx + 1).padStart(2, '0')}.</span>
                    <span className="manage-name-text">{p.full_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.full_name)}
                    disabled={isPending}
                    className="btn-delete"
                    title={`Remove ${p.full_name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
