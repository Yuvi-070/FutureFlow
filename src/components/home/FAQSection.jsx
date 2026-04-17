import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useScrollReveal } from '../ui/hooks'

const faqs = [
  {
    q: 'What is FutureFlow?',
    a: 'FutureFlow is an AI-powered market intelligence terminal hosted on Hugging Face. It combines real-time technical analysis, AI confluence signals, a paper trading simulator, and a multi-market stock screener — all in a single browser-based app. No installation or account on this website is required; just click "Launch Terminal".',
  },
  {
    q: 'Which markets does FutureFlow support?',
    a: 'FutureFlow supports NSE equities (RELIANCE.NS, TCS.NS, etc.), BSE equities, US large-cap stocks (AAPL, MSFT, TSLA, NVDA, AMZN, etc.), F&O instruments, and major cryptocurrency pairs (BTC-USD, ETH-USD, and more). In total, 150+ tradable instruments are available across all modules.',
  },
  {
    q: 'Is paper trading safe and free?',
    a: 'Completely. Paper trading uses virtual ₹1,00,000 and real market prices from Yahoo Finance — no real money is ever involved. You can buy, sell, track your portfolio P&L, and test strategies with zero financial risk. The simulator is entirely free to use on the Hugging Face terminal.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'The marketing website (this site) has no login. To use the trading terminal on Hugging Face, you register with an email and password directly inside the app. Your account and virtual portfolio are stored securely in the terminal — separate from this website.',
  },
  {
    q: 'How accurate are the AI signals?',
    a: 'The signals are rule-based (not a black box) and combine RSI momentum, SMA-20/50 trend, and MACD crossover into a weighted score. A confidence percentage (e.g. 72%) gives you a quantitative measure of signal strength. They are best used as a starting point for your own analysis, not as a guarantee of profit.',
  },
  {
    q: 'When will live trading be available?',
    a: 'Live trading via DhanHQ (Indian broker) is on the roadmap. Paper trading is fully functional now, and the architecture is designed so the same interface can switch to live execution once broker integration is complete. Watch the GitHub repo for updates.',
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
              Common Questions About FutureFlow
            </h2>
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/img/faq-img.jpg"
              alt="FutureFlow trading terminal"
              className="rounded-2xl w-full object-cover shadow-lg"
            />
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 px-6 py-3 rounded-full bg-primary text-white font-semibold text-sm shadow-lg hover:bg-primary-dark transition-colors"
            >
              Launch Terminal →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
