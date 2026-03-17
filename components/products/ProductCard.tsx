import MatchScore from './MatchScore'

type Props = {
  product: {
    id: string
    name: string
    price: number
    sourceShop: string
    interestTags: string[]
    rating: number
    score: number
    reasons: string[]
  }
  rank: number
}

const INTEREST_ICONS: Record<string, string> = {
  food: '🍷',
  fashion: '💎',
  wellness: '🧘',
  home: '🏡',
  tech: '📱',
  games: '🎲',
  sport: '⚽',
  books: '📚',
  crafts: '🎨',
  pets: '🐾',
  experiences: '✈️',
}

export default function ProductCard({ product, rank }: Props) {
  const icon =
    product.interestTags
      .map((t) => INTEREST_ICONS[t])
      .find(Boolean) || '🎁'

  return (
    <div
      className={`bg-[rgba(255,255,255,0.04)] rounded-[18px] overflow-hidden ${
        rank === 0
          ? 'border-[1.5px] border-[rgba(78,205,196,0.40)]'
          : 'border border-[rgba(255,245,238,0.08)]'
      }`}
      style={{ animation: `fadeUp 0.5s ease ${rank * 0.1}s both` }}
    >
      {/* Best match banner */}
      {rank === 0 && (
        <div className="bg-gradient-to-r from-teal to-teal-light px-4 py-1.5 text-[11px] font-bold text-bg-deep uppercase tracking-wider text-center">
          ✦ Nejlepší shoda
        </div>
      )}

      <div className="flex gap-3.5 p-3.5">
        {/* Icon placeholder */}
        <div className="w-24 h-24 rounded-xl flex-shrink-0 bg-gradient-to-br from-[rgba(224,122,95,0.08)] to-[rgba(78,205,196,0.10)] flex items-center justify-center text-4xl">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Score + shop */}
          <div className="flex items-center gap-2 mb-1.5">
            <MatchScore score={product.score} />
            <span className="text-[11px] text-text-muted">
              {product.sourceShop}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Reasons */}
          <p className="text-xs text-text-muted leading-relaxed mb-2.5 line-clamp-2">
            {product.reasons.join(' · ') || 'Univerzální dárek s dobrým hodnocením'}
          </p>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <span className="font-heading text-xl font-bold text-rose-gold-light">
              {product.price.toLocaleString('cs-CZ')} Kč
            </span>
            <a
              href={`/go/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-[18px] py-2 bg-gradient-to-br from-coral to-coral-light text-text-on-coral rounded-full text-xs font-bold no-underline hover:shadow-[0_0_25px_rgba(224,122,95,0.25)] transition-shadow"
            >
              Koupit →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
