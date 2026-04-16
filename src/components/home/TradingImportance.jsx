import { Link } from 'react-router-dom'
import { FaChartBar } from 'react-icons/fa'

export default function TradingImportance() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-navy to-brand-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <FaChartBar className="text-primary text-3xl" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Master the Importance of Trading
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Understanding markets, timing your entries, and managing risk are the cornerstones of
          consistent profitability. Start learning the strategies that separate amateur traders
          from professionals.
        </p>
        <Link
          to="/strategies"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
        >
          Discover Trading Strategies
        </Link>
      </div>
    </section>
  )
}
