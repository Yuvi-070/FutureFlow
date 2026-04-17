import { Link } from 'react-router-dom'
import { useScrollReveal } from '../ui/hooks'
import { FaChartLine, FaSignal, FaLightbulb, FaArrowRight } from 'react-icons/fa'

const projects = [
  {
    image: '/img/projects-1.jpg',
    icon: <FaChartLine className="text-primary text-4xl" />,
    category: 'APEX Trading Terminal',
    title: 'Real-Time Market Intelligence Dashboard',
    description:
      'A live dashboard tracking Nifty 50, Sensex, S&P 500, Dow Jones, NASDAQ, and Bitcoin — with top gainers/losers updated every session.',
  },
  {
    image: '/img/projects-2.jpg',
    icon: <FaSignal className="text-primary text-4xl" />,
    category: 'AI Signal Engine',
    title: 'Multi-Indicator Confluence Scoring System',
    description:
      'An AI signal engine combining RSI, MACD, SMA crossovers, and trend analysis into a single confidence-rated BUY/SELL/HOLD recommendation.',
  },
  {
    image: '/img/project-3.jpg',
    icon: <FaLightbulb className="text-primary text-4xl" />,
    category: 'Paper Trading Simulator',
    title: 'Risk-Free Virtual Trading with Real Market Data',
    description:
      'Simulate trades across equities, F&O, and crypto with virtual ₹1,00,000. Track P&L, manage positions, and stress-test strategies with zero financial risk.',
  },
]

function ProjectCard({ image, icon, category, title, description, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group flex flex-col`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl h-52">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/img/projects-1.jpg' }}
        />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/30 transition-colors duration-500 rounded-2xl" />
      </div>
      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg p-6 mx-4 -mt-10 group-hover:bg-brand-dark transition-colors duration-500 flex-1 flex flex-col">
        <div className="mb-3">{icon}</div>
        <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-2">
          {category}
        </p>
        <h3 className="font-bold text-brand-dark group-hover:text-white transition-colors leading-snug flex-1">
          {title}
        </h3>
        <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed mt-2 transition-colors">
          {description}
        </p>
        <Link
          to="/projects"
          className="mt-4 inline-flex items-center gap-1 px-5 py-2 rounded-full border border-gray-200 group-hover:border-primary/50 text-sm font-semibold text-gray-700 group-hover:text-white transition-all self-start"
        >
          Read More <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Projects</span>
          <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">
            Built for Traders. Powered by Data.
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Every module in FutureFlow is a battle-tested project built to solve real trading challenges.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} {...p} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
