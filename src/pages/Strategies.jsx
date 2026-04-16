import { Link } from 'react-router-dom'
import { FaArrowLeft, FaArrowUp, FaArrowDown, FaExchangeAlt } from 'react-icons/fa'
import PageHeader from '../components/layout/PageHeader'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'

/* ─── Chart Data ──────────────────────────────────────────── */
function genData(base, volatility, trend, n = 12) {
  let v = base
  return Array.from({ length: n }, (_, i) => {
    v = v + trend + (Math.random() - 0.5) * volatility
    return { month: `M${i + 1}`, value: Math.round(v * 10) / 10 }
  })
}
const bullishData = genData(100, 8, 4)
const bearishData = genData(200, 6, -3)
const meanRevData = (() => {
  let v = 100
  return Array.from({ length: 12 }, (_, i) => {
    v = 100 + Math.sin(i) * 20 + (Math.random() - 0.5) * 5
    return { month: `M${i + 1}`, value: Math.round(v * 10) / 10 }
  })
})()

/* ─── Strategy data ───────────────────────────────────────── */
const strategies = [
  {
    id: 'bullish',
    color: '#00e676',
    icon: <FaArrowUp className="text-green-400 text-xl" />,
    title: 'Bullish Strategies',
    data: bullishData,
    items: [
      { name: 'Bull Call Spread', desc: 'Profit from moderate upward price movement' },
      { name: 'Covered Call', desc: 'Generate income while holding long positions' },
      { name: 'Bull Put Spread', desc: 'Capitalise on upward momentum with defined risk' },
      { name: 'Long Call Option', desc: 'Leverage bullish price breakouts' },
    ],
  },
  {
    id: 'bearish',
    color: '#ff5252',
    icon: <FaArrowDown className="text-red-400 text-xl" />,
    title: 'Bearish Strategies',
    data: bearishData,
    items: [
      { name: 'Bear Put Spread', desc: 'Benefit from downward price movement' },
      { name: 'Short Selling', desc: 'Profit directly from falling asset prices' },
      { name: 'Protective Put', desc: 'Hedge existing long positions during downturns' },
      { name: 'Bear Call Spread', desc: 'Income generation in falling markets' },
    ],
  },
  {
    id: 'mean',
    color: '#536dfe',
    icon: <FaExchangeAlt className="text-indigo-400 text-xl" />,
    title: 'Mean Reversion',
    data: meanRevData,
    items: [
      { name: 'RSI Overbought/Oversold', desc: 'Trade reversals using momentum indicators' },
      { name: 'Bollinger Band Squeeze', desc: 'Enter positions on band breakouts' },
      { name: 'VWAP Reversion', desc: 'Trade back toward volume-weighted average price' },
      { name: 'Statistical Arbitrage', desc: 'Exploit price differentials between correlated pairs' },
    ],
  },
]

function StrategyCard({ color, icon, title, data, items }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      {/* Glow border animation */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `0 0 30px ${color}30, inset 0 0 30px ${color}10` }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>

        {/* Mini chart */}
        <div className="h-36 mb-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Strategy list */}
        <ul className="space-y-2">
          {items.map(({ name, desc }) => (
            <li
              key={name}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/8 transition-colors cursor-pointer group/item"
            >
              <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <div>
                <p className="text-white text-sm font-semibold">{name}</p>
                <p className="text-gray-400 text-xs">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/tradeview"
          className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: `${color}20`, color }}
        >
          View Live Chart →
        </Link>
      </div>
    </div>
  )
}

export default function Strategies() {
  return (
    <>
      <PageHeader title="Trading Strategies" crumbs={['Home', 'Pages', 'Strategies']} />

      <section className="py-20 bg-[#0a0f24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl sm:text-5xl font-extrabold mb-3"
              style={{
                background: 'linear-gradient(45deg, #00e676, #536dfe, #ff5252)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Trading Strategies Matrix
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Choose your market stance and execute with precision. Each strategy is
              backed by data, risk management, and real-world testing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {strategies.map((s) => (
              <StrategyCard key={s.id} {...s} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
