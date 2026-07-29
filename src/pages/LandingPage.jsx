import Header from '../components/landing/Header'
import Hero from '../components/landing/Hero'
import Ticker from '../components/landing/Ticker'
import Sides from '../components/landing/Sides'
import Pillars from '../components/landing/Pillars'
import Founding from '../components/landing/Founding'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden bg-ambient">
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Sides />
        <Pillars />
        <Founding />
      </main>
      <Footer />
    </div>
  )
}