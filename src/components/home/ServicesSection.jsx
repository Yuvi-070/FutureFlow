import { Link } from 'react-router-dom'
import { useScrollReveal } from '../ui/hooks'
import { FaChartBar, FaArrowRight, FaRobot, FaShieldAlt, FaSearch } from 'react-icons/fa'

const services = [
  {
    image: '/img/service-1.jpg',
    icon: <FaChartBar className="text-primary text-2xl" />,
    title: 'Technical Analysis Terminal',
    description:
      'Professional candlestick charts with SMA, EMA, Bollinger Bands, RSI, and MACD. Analyse 150+ instruments across NSE, BSE, US, and crypto markets with a single click.',
  },
  {
    image: '/img/service-4.jpg',
    icon: <FaRobot className="text-primary text-2xl" />,
    title: 'AI Signal Engine',
    description:
      'Rule-based AI signals (BUY / SELL / HOLD) with multi-factor confluence scoring. Understand the "why" behind every signal with transparent indicator breakdown.',
  },
  {
    image: '/img/service-3.jpg',
    icon: <FaShieldAlt className="text-primary text-2xl" />,
    title: 'Paper & Live Trading',
    description:
      'Practice with virtual ₹1,00,000 in paper trading mode with real market prices. Graduate to live execution when ready — full F&O and equity support included.',
  },
  {
    image: '/img/service-2.jpg',
    icon: <FaSearch className="text-primary text-2xl" />,
    title: 'Smart Stock Screener',
    description:
      'Screen 150+ stocks simultaneously by RSI range, price change %, trend direction, and AI signal. Find your next trade opportunity in seconds — not hours.',
  },
]

function ServiceCard({ image, icon, title, description, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="overflow-hidden h-48 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/30 transition-colors duration-500" />
      </div>
      <div className="p-6 group-hover:bg-brand-dark transition-colors duration-500">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="font-bold text-brand-dark group-hover:text-white transition-colors text-base">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors">
          {description}
        </p>
        <Link
          to="/services"
          className="mt-4 inline-flex items-center gap-1 text-primary group-hover:text-white text-sm font-semibold transition-colors"
        >
          Read More <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">
            Everything You Need to Trade with Confidence
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            FutureFlow bundles professional-grade analysis, AI signals, paper trading, and screening
            into one powerful terminal — accessible from anywhere, no installation required.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
