import Link from 'next/link'

const userLinks = [
  { label: 'Jak to funguje', href: '/#how' },
  { label: 'Kvíz', href: '/pruvodce' },
  { label: 'Blog', href: '/blog' },
]

const merchantLinks = [
  { label: 'Registrace e-shopu', href: '/merchant/register' },
  { label: 'Pro e-shopy', href: '/pro-eshopy' },
  { label: 'Kontakt', href: 'mailto:info@darkee.cz' },
]

const legalLinks = [
  { label: 'Ochrana osobních údajů', href: '/gdpr' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
]

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)] font-[family-name:var(--font-body)] mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--text-primary)] transition-colors duration-200 no-underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="no-underline">
              <span className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-primary)] tracking-wide">
                Dárkee
              </span>
            </Link>
            <p className="font-[family-name:var(--font-display)] text-sm italic text-[var(--text-muted)] mt-3">
              Nevíte co darovat? My ano.
            </p>
          </div>

          <FooterColumn title="Pro uživatele" links={userLinks} />
          <FooterColumn title="Pro e-shopy" links={merchantLinks} />
          <FooterColumn title="Právní" links={legalLinks} />
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
            © 2026 Dárkee.cz
          </span>
          <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
            info@darkee.cz
          </span>
        </div>
      </div>
    </footer>
  )
}
