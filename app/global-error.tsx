'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="cs">
      <body
        style={{
          margin: 0,
          background: '#0A0A0B',
          color: '#F2EDE4',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚠️</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '28px',
              fontWeight: 400,
              marginBottom: '12px',
              letterSpacing: '0.02em',
            }}
          >
            Kritická chyba
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#9A9080',
              marginBottom: '32px',
              maxWidth: '400px',
            }}
          >
            Aplikace narazila na neočekávaný problém. Zkuste obnovit stránku.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '14px 32px',
              background: '#C9A84C',
              color: '#0A0A0B',
              border: 'none',
              borderRadius: '2px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}
          >
            Zkusit znovu
          </button>
        </div>
      </body>
    </html>
  )
}
