import { FaChartBar, FaRocket } from 'react-icons/fa'

export default function TradingImportance() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-navy to-brand-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <FaChartBar className="text-primary text-3xl" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Analysis. Signals. Paper Trading. All in One Place.
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          The FutureFlow APEX Terminal puts professional-grade technical analysis, AI confluence
          signals, and a full paper trading simulator at your fingertips — free, hosted on
          Hugging Face, no install required.
        </p>
        <a
          href="https://huggingface.co/spaces/yuvraj0705/Future_Flow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
        >
          <FaRocket /> Open Terminal Now
        </a>
      </div>
    </section>
  )
}
