import { getArticleBySlug } from '@/lib/blog-data'
import BlogArticleClient from './BlogArticleClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: 'Článek nenalezen' }
  return {
    title: article.title,
    description: article.perex,
    openGraph: {
      title: article.title,
      description: article.perex,
      url: `https://www.darkee.cz/blog/${article.slug}`,
    },
  }
}

export default function BlogArticlePage() {
  return <BlogArticleClient />
}
