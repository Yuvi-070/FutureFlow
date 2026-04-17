import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { useScrollReveal } from '../components/ui/hooks'
import { FaChartLine, FaSignal, FaLightbulb, FaGlobe, FaArrowRight, FaChevronDown, FaChevronUp, FaRocket } from 'react-icons/fa'

const projects = [
  {
    image: '/img/projects-1.jpg',
    icon: <FaChartLine className="text-primary text-4xl" />,
    category: 'Market Intelligence',
    title: 'APEX Real-Time Market Dashboard',
    description:
      'A live market intelligence dashboard tracking 6 major indices — Nifty 50, Sensex, S&P 500, Dow Jones, NASDAQ, and Bitcoin — with today\'s top gainers and losers.',
    detail: (
      <>
        <p className="mb-3">
          The APEX Dashboard is the first screen you see after logging in to the FutureFlow terminal.
          It provides an instant pulse of the market across Indian and global indices, refreshed
          every session with Yahoo Finance data.
        </p>
        <h4 className="font-semibold text-brand-dark mb-2">Key Features</h4>
        <ul className="space-y-2 mb-3">
          {[
            'Live metric cards for Nifty 50, BSE Sensex, S&P 500, Dow Jones, NASDAQ, and Bitcoin/USD',
            'Color-coded delta — green for positive, red for negative session change',
            'Top 5 Gainers and Top 5 Losers tables with background-gradient heat mapping',
            'Tracks RELIANCE.NS, TCS.NS, INFY.NS, HDFCBANK.NS, WIPRO.NS, AAPL, MSFT, TSLA, NVDA, AMZN',
            'Fully cached (5-minute TTL) to minimise API calls while keeping data fresh',
            'Live-fetch status dot — green indicates data was fetched successfully; shows last-updated timestamp',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          <strong>Tech:</strong> Streamlit, yfinance, pandas, Plotly · Hosted on Hugging Face Spaces
        </p>
      </>
    ),
  },
  {
    image: '/img/projects-2.jpg',
    icon: <FaSignal className="text-primary text-4xl" />,
    category: 'AI Signal Engine',
    title: 'Multi-Indicator Confluence Scoring',
    description:
      'An AI signal engine that synthesises RSI, SMA crossovers, MACD, and trend momentum into a single confidence-rated BUY/SELL/HOLD signal with plain-English reasoning.',
    detail: (
      <>
        <p className="mb-3">
          Instead of relying on any single indicator, the Confluence Engine scores 5 independent
          technical factors and weights them into a composite signal. Every signal comes with a
          confidence percentage and a brief explanation — no black-box guessing.
        </p>
        <h4 className="font-semibold text-brand-dark mb-2">Signal Factors</h4>
        <ul className="space-y-2 mb-3">
          {[
            'RSI Momentum: RSI < 35 → bullish (+2), RSI > 65 → bearish (+2)',
            'Price vs SMA-20: price above the 20-day moving average → bullish (+1)',
            'Trend (SMA20 vs SMA50): golden cross → bullish (+1), death cross → bearish (+1)',
            'MACD Crossover: MACD line above signal line → bullish (+1)',
            'Composite: BUY if bullish > bearish with confidence = bullish/(bullish+bearish)',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <h4 className="font-semibold text-brand-dark mb-2">Confluence Dashboard</h4>
        <p className="text-sm text-gray-600 mb-2">
          A separate 4-bar confluence panel shows RSI score, Trend score, MACD score,
          and Momentum score as colour-coded progress bars (green ≥ 60, amber 40–59, red &lt; 40).
        </p>
        <p className="text-sm text-gray-500">
          <strong>Coverage:</strong> All 150+ instruments supported in Technical Analysis
        </p>
      </>
    ),
  },
  {
    image: '/img/project-3.jpg',
    icon: <FaLightbulb className="text-primary text-4xl" />,
    category: 'Paper Trading',
    title: 'Risk-Free Virtual Trading Simulator',
    description:
      'Simulate realistic trades across equities, F&O, and crypto with virtual ₹1,00,000. Full portfolio tracking, trade journal, and configurable risk controls — all with real prices.',
    detail: (
      <>
        <p className="mb-3">
          The Paper Trading Simulator is designed to replicate the full brokerage experience without
          any real money on the line. Use it to validate strategies, build trading habits, and
          stress-test risk setups before going live.
        </p>
        <h4 className="font-semibold text-brand-dark mb-2">What's Included</h4>
        <ul className="space-y-2 mb-3">
          {[
            'Starting virtual capital: ₹1,00,000 — reset anytime',
            'Market-order execution at Yahoo Finance last-close price for any supported symbol',
            'Positions tab: current holdings with avg price, CMP, unrealised P&L ₹ and %',
            'Orders tab: full order book with timestamp, symbol, qty, fill price, total, and status',
            'Trade Journal: completed trades with realised P&L per trade and cumulative total',
            'Risk Controls: max risk per trade (%), max open positions, max daily loss (%) — all configurable',
            'Risk Dashboard: live positions-used count, daily P&L %, and daily loss limit indicator',
            'AI Signal preview for every order: see BUY/SELL/HOLD before you submit',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          <strong>Coming soon:</strong> Live broker integration (DhanHQ) for real order execution
          using the same interface.
        </p>
      </>
    ),
  },
  {
    image: '/img/projects-1.jpg',
    icon: <FaGlobe className="text-primary text-4xl" />,
    category: 'Stock Screener',
    title: 'Intelligent Multi-Market Stock Screener',
    description:
      'Screen 150+ stocks across NSE, BSE, US equities, and crypto simultaneously — filter by RSI, price change, trend, and AI signal. Results in seconds, not hours.',
    detail: (
      <>
        <p className="mb-3">
          The Stock Screener automates the most time-consuming part of trading research: scanning
          through hundreds of tickers to find the handful that fit your criteria right now.
        </p>
        <h4 className="font-semibold text-brand-dark mb-2">Filter Options</h4>
        <ul className="space-y-2 mb-3">
          {[
            'RSI range filter: find oversold (e.g. 20–40) or overbought (e.g. 60–80) stocks',
            'Price change % filter: e.g. only stocks up 1–5% today',
            'Trend filter: Bullish (SMA20 > SMA50) or Bearish momentum',
            'AI Signal filter: screen exclusively for BUY, SELL, or HOLD signals',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <h4 className="font-semibold text-brand-dark mb-2">Ticker Selection UX</h4>
        <ul className="space-y-2 mb-3">
          {[
            'Multi-select dropdown with search — find any of 150+ symbols by typing part of the name',
            'Exchange presets: Top NSE 30, Top BSE 20, US Large-Cap 30, Crypto 10 — load any universe in one click',
            'Results table with signal badges (colour-coded), confidence %, SMA20 status, trend direction',
            'Sortable columns and progress indicator during batch scan',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <FaArrowRight className="text-primary mt-0.5 shrink-0 text-xs" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">
          <strong>Data source:</strong> Yahoo Finance · scan of 30 tickers typically completes in under 20 seconds
        </p>
      </>
    ),
  },
]

function ProjectCard({ image, icon, category, title, description, detail, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  const [expanded, setExpanded] = useState(false)

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
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-3">{icon}</div>
        <span className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          {category}
        </span>
        <h3 className="font-bold text-brand-dark text-base mb-3 leading-snug">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:border-primary/50 hover:text-primary text-sm font-semibold text-gray-700 transition-all"
        >
          {expanded ? 'Show Less' : 'Read More'}
          {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {detail}
          </div>
        )}
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
              Every Feature is a Finished Project
            </h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              Click "Read More" on any project card to explore the full specification, feature list,
              and technical details behind each module.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} {...p} delay={i * 100} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-brand-navy to-brand-dark p-10 text-center text-white">
            <h3 className="text-3xl font-bold mb-3">Try Every Project — Live</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              All four projects run together inside the FutureFlow APEX Terminal on Hugging Face.
              No install, no subscription — just open and trade.
            </p>
            <a
              href="https://huggingface.co/spaces/yuvraj0705/Future_Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
            >
              <FaRocket /> Open APEX Terminal
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
