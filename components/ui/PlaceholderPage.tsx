import Link from 'next/link'

interface Props {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '64px 48px',
          border: '1px solid rgba(0,0,0,0.06)',
          maxWidth: 480,
          width: '100%',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 24 }}>🚧</div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36,
            fontWeight: 400,
            color: '#1A1714',
            marginBottom: 12,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: '#6B6358',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {description || 'Tato stránka se připravuje.'}
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: '#C9A84C',
            color: '#FFFFFF',
            fontSize: 14,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            borderRadius: 100,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          Zpět na úvodní stránku
        </Link>
      </div>
    </div>
  )
}
