import PageHeader from '../components/layout/PageHeader'
import { useScrollReveal } from '../components/ui/hooks'
import { FaDonate, FaArrowRight, FaChartPie, FaRobot, FaShieldAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const services = [
  {
    image: '/img/service-1.jpg',
    icon: <FaDonate className="text-primary text-2xl" />,
    title: 'Trading Strategy Investment',
    description:
      'Precision-driven trading strategies for consistent and profitable investments. Our experts combine technical analysis, fundamentals, and AI signals to craft winning strategies.',
  },
  {
    image: '/img/service-4.jpg',
    icon: <FaChartPie className="text-primary text-2xl" />,
    title: 'Stock Investment Planning',
    description:
      'Plan today, prosper tomorrow. Smart, personalised investment strategies for a secure financial future — from blue-chip equities to high-growth opportunities.',
  },
  {
    image: '/img/service-3.jpg',
    icon: <FaShieldAlt className="text-primary text-2xl" />,
    title: 'Private Client Investment',
    description:
      'Exclusive, bespoke investment solutions tailored for high-net-worth individuals seeking personalised wealth management and portfolio optimisation.',
  },
  {
    image: '/img/service-2.jpg',
    icon: <FaRobot className="text-primary text-2xl" />,
    title: 'AI Market Analytics',
    description:
      'Real-time AI-powered market insights, sentiment analysis, and predictive analytics to help you stay one step ahead of the market at all times.',
  },
]

function ServiceCard({ image, icon, title, description, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transition-all duration-300`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="overflow-hidden h-52 relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/25 transition-colors duration-500" />
      </div>
      <div className="p-6 group-hover:bg-brand-dark transition-colors duration-500">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="font-bold text-brand-dark group-hover:text-white transition-colors">{title}</h3>
        </div>
        <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors mb-4">
          {description}
        </p>
        <button className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 group-hover:border-white/30 text-sm font-semibold text-gray-700 group-hover:text-white transition-all">
          Learn More <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <>
      <PageHeader title="Our Services" crumbs={['Home', 'Pages', 'Services']} />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">
              Offering the Best Consulting &amp; Investment Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 100} />
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-brand-navy to-brand-dark p-10 text-center text-white">
            <h3 className="text-3xl font-bold mb-3">Ready to Start Investing Smarter?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join 900+ investors already using FutureFlow to make data-driven decisions.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              Get Started Free <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
