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
          background: '#0B1F3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #E0B040',
          color: '#E0B040',
          fontSize: 18,
          fontWeight: 900,
        }}
      >
        M
      </div>
    ),
    { ...size }
  )
}
