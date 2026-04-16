import PageHeader from '../components/layout/PageHeader'
import { useCountUp, useScrollReveal } from '../components/ui/hooks'
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
  'Strategy & Consulting',
  'Business Process',
  'Marketing Rules',
  'Partnerships',
  'Risk Management',
  'Wealth Planning',
]

const values = [
  {
    title: 'Our Mission',
    text: 'To empower every investor — from beginner to professional — with AI-driven insights and transparent financial guidance that leads to real, measurable results.',
  },
  {
    title: 'Our Vision',
    text: 'To become the world\'s most trusted AI-powered investment platform, transforming how individuals interact with financial markets.',
  },
  {
    title: 'Our Values',
    text: 'Integrity, innovation, and client-first thinking drive every decision we make. We believe in data over gut-feeling, and strategy over speculation.',
  },
]

export default function About() {
  const [ref, visible] = useScrollReveal()

  return (
    <>
      <PageHeader title="About Us" crumbs={['Home', 'Pages', 'About']} />

      {/* Main About */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
              <img
                src="/img/about-3.png"
                alt="Trading dashboard"
                className="w-full rounded-t-2xl bg-white object-contain"
                style={{ maxHeight: '280px' }}
              />
              <img
                src="/img/about-2.jpg"
                alt="Investment growth"
                className="w-full rounded-b-2xl object-cover"
                style={{ maxHeight: '240px' }}
              />
            </div>
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Who We Are</span>
              <h2 className="mt-2 text-4xl font-extrabold text-brand-dark leading-tight mb-4">
                The Most Profitable Investment Company Worldwide
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed border-l-4 border-primary pl-4">
                Harness AI-powered insights for smarter trading decisions. Stay ahead of the
                market with real-time predictions and analytics — trusted by hundreds of
                investors across the globe for over 7 years.
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
                <Stat value={900} label="Investors" />
                <Stat value={7} label="Years Experience" dark />
                <Stat value={10} label="Team Members" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">Mission, Vision & Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ title, text }, i) => (
              <div
                key={title}
                className="p-8 rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
