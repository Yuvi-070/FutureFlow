import PageHeader from '../components/layout/PageHeader'
import { useScrollReveal } from '../components/ui/hooks'
import { FaChartLine, FaSignal, FaLightbulb, FaGlobe, FaArrowRight } from 'react-icons/fa'

const projects = [
  {
    image: '/img/projects-1.jpg',
    icon: <FaChartLine className="text-primary text-4xl" />,
    category: 'Growth Consulting',
    title: 'Business Strategy And Investment Planning Growth Consulting',
    description: 'A comprehensive growth strategy initiative that combined market analysis, competitive benchmarking, and tailored investment roadmaps for sustainable returns.',
  },
  {
    image: '/img/projects-2.jpg',
    icon: <FaSignal className="text-primary text-4xl" />,
    category: 'Market Strategy',
    title: 'Marketing Strategy For Improved Profits',
    description: 'Data-driven marketing and brand strategy aligned with investment objectives, delivering measurable profit improvements across targeted segments.',
  },
  {
    image: '/img/project-3.jpg',
    icon: <FaLightbulb className="text-primary text-4xl" />,
    category: 'Planning Strategy',
    title: 'Long-Term Investment Planning & Wealth Building',
    description: 'A structured, goal-based investment planning project that helped clients systematically build long-term wealth through diversified portfolios.',
  },
  {
    image: '/img/projects-1.jpg',
    icon: <FaGlobe className="text-primary text-4xl" />,
    category: 'Global Markets',
    title: 'International Portfolio Diversification Strategy',
    description: 'Expanded client portfolios into international markets with tailored risk management and currency hedging strategies for stable global returns.',
  },
]

function ProjectCard({ image, icon, category, title, description, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group flex flex-col bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-300 overflow-hidden`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/img/projects-1.jpg' }}
        />
        <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/25 transition-colors duration-500" />
      </div>
      <div className="p-6 flex flex-col flex-1 group-hover:bg-brand-dark transition-colors duration-500">
        <div className="mb-3">{icon}</div>
        <span className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          {category}
        </span>
        <h3 className="font-bold text-brand-dark group-hover:text-white text-base mb-3 flex-1 leading-snug transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed mb-4 transition-colors">
          {description}
        </p>
        <button className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 group-hover:border-white/30 text-sm font-semibold text-gray-700 group-hover:text-white transition-all">
          Read More <FaArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <>
      <PageHeader title="Our Projects" crumbs={['Home', 'Pages', 'Projects']} />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Portfolio</span>
            <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">
              Explore Our Latest Ideas &amp; Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} {...p} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
