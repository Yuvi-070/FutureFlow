import { FaArrowRight, FaChartLine, FaRocket, FaFlask } from 'react-icons/fa'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/img/carousel-1.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

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
            AI-Powered Market Intelligence Terminal
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Trade Smarter,{' '}
            <span className="text-primary">Profit Consistently</span>
          </h1>
          <p className="text-gray-200 text-lg sm:text-xl mb-8 leading-relaxed">
            FutureFlow is a professional-grade market intelligence terminal — combining real-time
            technical analysis, AI-driven signals, confluence scoring, and paper/live trading in
            one unified platform. Built for serious traders across NSE, BSE, US equities, F&amp;O,
            and crypto markets.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-base hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              <FaRocket /> Launch Trading Terminal
            </a>
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow?page=paper"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/60 text-white font-bold text-base hover:bg-white hover:text-brand-dark transition-all"
            >
              <FaFlask /> Try Paper Trading
            </a>
          </div>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 mt-5">
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow?page=analysis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
            >
              <FaChartLine className="text-primary" /> Technical Analysis
            </a>
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow?page=screener"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all"
            >
              <FaArrowRight className="text-primary" /> Stock Screener
            </a>
          </div>

          {/* Quick stats row */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { value: '150+', label: 'Tradable Instruments' },
              { value: '6', label: 'Market Indices Live' },
              { value: '100%', label: 'Free & Open Source' },
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
