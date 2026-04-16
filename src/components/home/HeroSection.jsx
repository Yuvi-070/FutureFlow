import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/img/carousel-1.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Animated geometric accents */}
      <div
        className="absolute top-0 left-0 w-64 h-full opacity-70"
        style={{
          background: '#1e293b',
          transform: 'skewX(-8deg)',
          transformOrigin: 'top left',
        }}
      />
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full border-[80px] border-cyan-400/20 -translate-y-1/3 translate-x-1/3"
        style={{ animation: 'pulse 6s ease-in-out infinite' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wide">
            AI-Powered Trading Platform
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Smarter Predictions,{' '}
            <span className="text-primary">Better Profits</span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl mb-8 leading-relaxed">
            Harness AI-powered insights for smarter trading decisions. Stay ahead of the
            market with real-time predictions and analytics built for modern investors.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-base hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              Get Started Free <FaArrowRight />
            </Link>
            <Link
              to="/tradeview"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/60 text-white font-bold text-base hover:bg-white hover:text-brand-dark transition-all"
            >
              View Live Chart
            </Link>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { value: '900+', label: 'Active Investors' },
              { value: '7+', label: 'Years Experience' },
              { value: '98%', label: 'Accuracy Rate' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-white">{value}</p>
                <p className="text-sm text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-0.5 h-10 bg-white/30 rounded animate-bounce" />
      </div>
    </section>
  )
}
