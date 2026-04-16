import { Link } from 'react-router-dom'
import { useScrollReveal } from '../ui/hooks'
import { FaDonate, FaArrowRight } from 'react-icons/fa'

const services = [
  {
    image: '/img/service-1.jpg',
    title: 'Trading Strategy Investment',
    description:
      'Precision-driven trading strategies for consistent and profitable investments powered by advanced market analysis.',
  },
  {
    image: '/img/service-4.jpg',
    title: 'Stock Investment Planning',
    description:
      'Plan today, prosper tomorrow – smart investment strategies for a secure financial future tailored to your goals.',
  },
  {
    image: '/img/service-3.jpg',
    title: 'Private Client Investment',
    description:
      'Exclusive investment solutions tailored for elite investors seeking personalised wealth management.',
  },
  {
    image: '/img/service-2.jpg',
    title: 'AI Market Analytics',
    description:
      'Real-time AI-powered market insights and predictive analytics to help you stay one step ahead of the market.',
  },
]

function ServiceCard({ image, title, description, delay = 0 }) {
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
          <FaDonate className="text-primary text-2xl" />
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
            Offering the Best Consulting &amp; Investment Services
          </h2>
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
