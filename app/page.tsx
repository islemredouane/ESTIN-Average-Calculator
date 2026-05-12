import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/hero/HeroSection'
import CalculatorSection from '@/components/calculator/CalculatorSection'
import ResultsSection from '@/components/results/ResultsSection'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CalculatorSection />
        <ResultsSection />
      </main>
      <Footer />
    </>
  )
}
