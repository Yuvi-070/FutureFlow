import { useCountUp, useScrollReveal } from '../ui/hooks'
import { FaCheckCircle } from 'react-icons/fa'

function Stat({ value, label, dark = false }) {
  const [count, ref] = useCountUp(value)
  return (
    <div
      ref={ref}
      className={`rounded-xl p-6 text-center ${dark ? 'bg-brand-dark text-white' : 'bg-primary text-white'}`}
    >
      <p className="text-4xl font-extrabold">
        {count}<span className="text-2xl font-bold">+</span>
      </p>
      <p className={`text-sm mt-1 ${dark ? 'text-gray-300' : 'text-white/80'}`}>{label}</p>
    </div>
  )
}

const features = [
  'Real-Time Technical Analysis',
  'AI Confluence Scoring',
  'Paper & Live Trading',
  'Risk Management Controls',
  'NSE, BSE, US & Crypto',
  'F&O Strategy Support',
]

export default function AboutSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Images */}
          <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
            <div className="grid grid-rows-2 gap-3">
              <img
                src="/img/about-3.png"
                alt="FutureFlow trading terminal dashboard"
                className="w-full rounded-t-2xl bg-white object-contain"
                style={{ maxHeight: '260px' }}
              />
              <img
                src="/img/about-2.jpg"
                alt="Market analysis and investment growth"
                className="w-full rounded-b-2xl object-cover"
                style={{ maxHeight: '220px' }}
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About FutureFlow</span>
            <h2 className="mt-2 text-4xl font-extrabold text-brand-dark leading-tight mb-4">
              Professional-Grade Market Intelligence for Every Trader
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed border-l-4 border-primary pl-4">
              FutureFlow is an AI-powered trading terminal designed to give retail traders
              institutional-grade market intelligence. From candlestick analysis with multi-indicator
              confluence to real-time AI signals and paper trading — everything you need to trade
              with confidence is in one place.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Built for Indian and global markets, FutureFlow covers NSE &amp; BSE equities, US
              stocks, F&amp;O instruments, and major crypto pairs — giving you a unified view of
              150+ tradable instruments with actionable insights at a glance.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                  <FaCheckCircle className="text-primary shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Stat value={150} label="Instruments" />
              <Stat value={6} label="Live Indices" dark />
              <Stat value={10} label="Indicators" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
