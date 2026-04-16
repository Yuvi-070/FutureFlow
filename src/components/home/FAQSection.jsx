import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useScrollReveal } from '../ui/hooks'

const faqs = [
  {
    q: 'What Does a Financial Advisor Do?',
    a: 'A financial advisor helps individuals and businesses manage their wealth by providing expert guidance on investments, retirement planning, and tax strategies. They create personalised financial plans to maximise growth, minimise risks, and ensure long-term financial security through wealth management, estate planning, and risk assessment.',
  },
  {
    q: 'What industries do you specialise in?',
    a: 'We specialise in wealth management, stock market trading, real estate, and technology investments. Our advisors also focus on healthcare, energy, cryptocurrency, and insurance sectors to provide tailored financial strategies for every client.',
  },
  {
    q: 'Can you guarantee growth?',
    a: 'No investment can be 100% guaranteed. However, our experts use data-driven strategies, comprehensive market analysis, and rigorous risk management to maximise potential returns and help clients achieve their financial goals consistently.',
  },
  {
    q: 'What makes your investment plans so special?',
    a: 'Our plans are tailored, data-driven, and risk-optimised to maximise returns while minimising exposure. Powered by AI-based market analysis and expert guidance, we ensure smart, diversified, and tax-efficient wealth growth for every investor.',
  },
]

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-white text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? (
          <FaChevronUp className="text-primary shrink-0 ml-3" />
        ) : (
          <FaChevronDown className="text-gray-400 shrink-0 ml-3" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white text-gray-600 text-sm leading-relaxed">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQSection() {
  const [ref, visible] = useScrollReveal()
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'url(/img/bg.png)', backgroundSize: 'cover' }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* FAQ list */}
          <div ref={ref} className={`reveal ${visible ? 'visible' : ''}`}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQs</span>
            <h2 className="mt-2 text-4xl font-extrabold text-brand-dark mb-8">
              Get Answers to Common Questions
            </h2>
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/img/faq-img.jpg"
              alt="FAQ illustration"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
            <a
              href="/contact"
              className="absolute bottom-6 right-6 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg hover:bg-primary-dark transition-colors"
            >
              Read More Q&amp;A →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
