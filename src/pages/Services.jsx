import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { useScrollReveal } from '../components/ui/hooks'
import { FaChartBar, FaArrowRight, FaRobot, FaShieldAlt, FaSearch, FaChevronDown, FaChevronUp, FaRocket } from 'react-icons/fa'

const services = [
  {
    image: '/img/service-1.jpg',
    icon: <FaChartBar className="text-primary text-2xl" />,
    title: 'Technical Analysis Terminal',
    description:
      'Professional candlestick charts with multi-indicator overlays. Analyse 150+ instruments across NSE, BSE, US, and crypto markets with a single click.',
    detail: (
      <>
        <p className="mb-3">
          The FutureFlow Technical Analysis Terminal is a comprehensive charting environment that gives you
          the same tools used by professional traders — without the institutional subscription cost.
        </p>
        <ul className="space-y-2 mb-3">
          {[
            'Candlestick OHLCV charts with adjustable periods (1M, 3M, 6M, 1Y, 2Y, 5Y) and intervals (daily, weekly, monthly, hourly)',
            'Simple Moving Average (SMA) — customisable windows: 5, 10, 20, 50, 100, 200',
            'Exponential Moving Average (EMA) — windows: 9, 21, 50, 200',
            'Bollinger Bands (20-period, ±2 SD) with band-fill shading',
            'Relative Strength Index (RSI-14) with overbought/oversold reference lines',
            'MACD (12/26/9) with histogram and signal crossover visualisation',
            'Average True Range (ATR-14) for volatility-based stop loss sizing',
            '52-week high/low range and average volume in the quick-metrics bar',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Supports <strong>NSE equities</strong> (RELIANCE.NS, TCS.NS, etc.), <strong>BSE equities</strong>,{' '}
          <strong>US stocks</strong> (AAPL, MSFT, TSLA, NVDA, etc.), and <strong>crypto pairs</strong> (BTC-USD, ETH-USD, and more).
        </p>
      </>
    ),
  },
  {
    image: '/img/service-4.jpg',
    icon: <FaRobot className="text-primary text-2xl" />,
    title: 'AI Signal Engine & Confluence Scoring',
    description:
      'Rule-based AI signals (BUY / SELL / HOLD) with multi-factor confluence scoring. Understand the "why" behind every signal with transparent indicator breakdown.',
    detail: (
      <>
        <p className="mb-3">
          FutureFlow's AI Signal Engine synthesises multiple technical indicators into a single, actionable
          trade recommendation — with a confidence percentage and a human-readable explanation for every signal.
        </p>
        <ul className="space-y-2 mb-3">
          {[
            'Combines RSI momentum, SMA 20/50 trend direction, and MACD crossover into a weighted bullish/bearish score',
            'BUY signal when ≥3 of 5 factors are bullish; SELL when ≥3 are bearish; otherwise HOLD',
            'Confluence dashboard shows individual indicator scores (0–100) as coloured progress bars',
            'RSI score, Trend score (price vs SMA-50), MACD momentum score, and Volume momentum tracked in real-time',
            'Confidence percentage (e.g. 72%) gives you a quantitative handle on signal strength',
            'Plain-English reason text (e.g. "RSI oversold · Price > SMA20 · MACD bullish crossover")',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Signals are <strong>fully transparent and rule-based</strong> — no black-box machine learning.
          You can audit every factor in the confluence panel alongside the chart.
        </p>
      </>
    ),
  },
  {
    image: '/img/service-3.jpg',
    icon: <FaShieldAlt className="text-primary text-2xl" />,
    title: 'Paper Trading & Risk Management',
    description:
      'Practice with virtual ₹1,00,000 in paper trading mode with real market prices. Graduate to live execution when ready — full F&O and equity support included.',
    detail: (
      <>
        <p className="mb-3">
          The Paper Trading Simulator lets you trade with real market prices and zero financial risk.
          Every feature mirrors a real brokerage — from order execution to portfolio P&amp;L tracking —
          so your skills transfer seamlessly when you go live.
        </p>
        <ul className="space-y-2 mb-3">
          {[
            'Virtual ₹1,00,000 starting capital — reset anytime',
            'BUY and SELL orders executed at live Yahoo Finance last-close prices',
            'Portfolio dashboard: cash balance, invested value, total P&L %, and open positions count',
            'Full trade history and realised P&L journal (filterable by symbol and date)',
            'Built-in risk controls: configurable max risk per trade (%), max open positions, and daily loss limit (%)',
            'Risk dashboard shows positions-used bar and daily P&L vs daily loss limit in real-time',
            'AI signal preview for every symbol before you submit an order',
            'Support for equity delivery, intraday, and F&O lot-style trades',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          Paper trading is gated behind a <strong>secure login</strong> so your virtual portfolio
          persists across sessions on the Hugging Face terminal.
        </p>
      </>
    ),
  },
  {
    image: '/img/service-2.jpg',
    icon: <FaSearch className="text-primary text-2xl" />,
    title: 'Smart Stock Screener',
    description:
      'Screen 150+ stocks simultaneously by RSI range, price change %, trend direction, and AI signal. Find your next trade opportunity in seconds — not hours.',
    detail: (
      <>
        <p className="mb-3">
          The Smart Stock Screener runs a full technical scan across your chosen universe in seconds,
          surfacing only the stocks that match your precise criteria — so you spend time trading,
          not hunting.
        </p>
        <ul className="space-y-2 mb-3">
          {[
            'Multi-select ticker picker with search — choose from 150+ NSE, BSE, US, and crypto symbols',
            'Exchange presets: Top NSE, Top BSE, US Large-Cap, Crypto Majors — one click to load a universe',
            'RSI range filter (e.g. RSI 30–50 for oversold recoveries)',
            'Price change % filter (e.g. only stocks up 0–3% today)',
            'Trend direction filter: Bullish (SMA20 > SMA50) or Bearish',
            'AI Signal filter: screen for only BUY, SELL, or HOLD signals',
            'Results table with colour-coded signal badges, confidence %, and sortable columns',
            'Progress bar during scan so you know exactly how far along the batch is',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">
          All screening data is fetched <strong>live from Yahoo Finance</strong> — prices and indicators
          are computed fresh every time you run a scan.
        </p>
      </>
    ),
  },
]

function ServiceCard({ image, icon, title, description, detail, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  const [expanded, setExpanded] = useState(false)

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
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="font-bold text-brand-dark text-base">{title}</h3>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Read More Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-200 hover:border-primary/50 hover:text-primary text-sm font-semibold text-gray-700 transition-all"
        >
          {expanded ? 'Show Less' : 'Read More'}
          {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            {detail}
          </div>
        )}
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
              Professional Trading Tools, Free &amp; Open to All
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Every service inside FutureFlow is built to bridge the gap between retail and
              institutional trading. Click "Read More" on any card to explore the full feature set.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 100} />
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-brand-navy to-brand-dark p-10 text-center text-white">
            <h3 className="text-3xl font-bold mb-3">Ready to Start Trading Smarter?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              All features are available free on the FutureFlow APEX Terminal hosted on Hugging Face.
              No account needed on the website — just click and trade.
            </p>
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              <FaRocket /> Launch Terminal
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
