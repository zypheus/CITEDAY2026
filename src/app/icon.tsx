import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#070B14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #E5B338',
          borderRadius: 6,
          boxShadow: '0 0 8px rgba(229, 179, 56, 0.4)',
        }}
      >
        <div
          style={{
            color: '#E5B338',
            fontSize: 18,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            fontStyle: 'italic',
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size }
  )
}
