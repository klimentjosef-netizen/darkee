import Link from 'next/link'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 21c1.5-3 2-5.5 2.5-8 .5-2.5 1-3.5 2-4.5s2.5-1.5 3.5-1c1 .5 1.5 2 1 4s-2 5-4 7" />
    </svg>
  )
}

const userLinks = [
  { label: 'Jak to funguje', href: '/#how' },
  { label: 'Kvíz', href: '/pruvodce' },
  { label: 'Blog', href: '/blog' },
  { label: 'Věrnostní program', href: '/vernostni-program' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'Přihlásit se', href: '/login' },
]

const merchantLinks = [
  { label: 'Registrace e-shopu', href: '/merchant/register' },
  { label: 'Jak funguje affiliate', href: '/merchant/affiliate' },
  { label: 'Ceník', href: '/merchant/cenik' },
  { label: 'B2B Widget', href: '/merchant/widget' },
  { label: 'Dokumentace API', href: '/merchant/api' },
  { label: 'Kontakt', href: '/kontakt' },
]

const legalLinks = [
  { label: 'Ochrana osobních údajů', href: '/gdpr' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Obchodní podmínky', href: '/obchodni-podminky' },
]

function FooterLinkColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="font-[family-name:var(--font-body)] text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors duration-200 no-underline"
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
    <footer className="bg-[var(--bg-primary)]">
      {/* Top gold line */}
      <div className="h-px bg-[var(--border-strong)]" />

      <div className="px-6 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Main grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            {/* Brand column */}
            <div>
              <Link href="/" className="no-underline">
                <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-primary)] tracking-wide">
                  Dárkee
                </span>
              </Link>
              <p className="font-[family-name:var(--font-display)] text-sm italic text-[var(--text-secondary)] mt-2 mb-3">
                Daruj s jistotou.
              </p>
              <p className="text-[13px] text-[var(--text-muted)] font-[family-name:var(--font-body)] leading-relaxed mb-6">
                Dárkový asistent pro každou příležitost. Rychle, přesně, s jistotou.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-4">
                {[
                  { Icon: InstagramIcon, href: 'https://instagram.com/darkee.cz', label: 'Instagram' },
                  { Icon: FacebookIcon, href: 'https://facebook.com/darkee.cz', label: 'Facebook' },
                  { Icon: PinterestIcon, href: 'https://pinterest.com/darkee', label: 'Pinterest' },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <FooterLinkColumn title="Pro uživatele" links={userLinks} />
            <FooterLinkColumn title="Pro e-shopy" links={merchantLinks} />

            {/* Contact & Info */}
            <div>
              <h4 className="font-[family-name:var(--font-body)] text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] mb-5">
                Dárkee.cz
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:info@darkee.cz"
                    className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors duration-200 no-underline"
                  >
                    info@darkee.cz
                  </a>
                </li>
                <li className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-body)]">
                  Provozuje: Dárkee s.r.o.
                </li>
              </ul>
              <div className="h-px bg-[var(--border-subtle)] my-5" />
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] font-[family-name:var(--font-body)] hover:text-[var(--gold-primary)] transition-colors duration-200 no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
              © 2025 Dárkee.cz — Všechna práva vyhrazena
            </span>
            <span className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
              Partneři:{' '}
              <span className="text-[var(--text-secondary)]">eHub</span>
              {' | '}
              <span className="text-[var(--text-secondary)]">Afilka.cz</span>
              {' | '}
              <span className="text-[var(--text-secondary)]">Dognet</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
