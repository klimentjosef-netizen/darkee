import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Showcase } from '@/components/landing/Showcase'
import { Stats } from '@/components/landing/Stats'
import { BlogPreview } from '@/components/landing/BlogPreview'
import { ForMerchants } from '@/components/landing/ForMerchants'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { Footer } from '@/components/landing/Footer'
import { ScrollProgress } from '@/components/landing/ScrollProgress'
import { BackToTop } from '@/components/landing/BackToTop'
import { GoldDivider } from '@/components/ui/GoldDivider'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <ScrollProgress />
      <BackToTop />

      {/* Top gold accent line */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-primary), transparent)' }} />

      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero */}
      <Hero />

      <GoldDivider />

      {/* 3. HowItWorks */}
      <div id="how">
        <HowItWorks />
      </div>

      <GoldDivider />

      {/* 4. ResultsShowcase */}
      <Showcase />

      {/* 5. GoldDivider s textem */}
      <GoldDivider text="Tisíce spokojených dárců" className="py-8" />

      {/* 6. Stats */}
      <Stats />

      <GoldDivider />

      {/* 7. BlogPreview */}
      <BlogPreview />

      {/* 8. MerchantTeaser */}
      <ForMerchants />

      {/* 9. FinalCTA */}
      <FinalCTA />

      {/* 10. Footer */}
      <Footer />
    </div>
  )
}
