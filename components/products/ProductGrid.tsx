import { ScoredProduct } from '@/types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: ScoredProduct[]
  quizResultId?: string
}

export function ProductGrid({ products, quizResultId }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          quizResultId={quizResultId}
          rank={i}
        />
      ))}
    </div>
  )
}
