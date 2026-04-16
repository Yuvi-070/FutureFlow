import { Link } from 'react-router-dom'
import {
  FaChartLine, FaChartBar, FaArrowUp, FaArrowDown, FaSignOutAlt,
  FaDonate, FaWallet, FaHistory,
} from 'react-icons/fa'

const stats = [
  { label: 'Portfolio Value', value: '₹4,82,340', change: '+3.2%', up: true, icon: <FaWallet /> },
  { label: 'Today\'s Gain', value: '₹15,420', change: '+0.8%', up: true, icon: <FaArrowUp /> },
  { label: 'Total Trades', value: '247', change: 'This Month', up: null, icon: <FaHistory /> },
  { label: 'Win Rate', value: '73%', change: 'Last 30 days', up: true, icon: <FaChartLine /> },
]

const recentTrades = [
  { symbol: 'BTCUSDT', type: 'BUY', quantity: '0.025', price: '₹26,48,000', pnl: '+₹4,200', up: true },
  { symbol: 'NIFTY50', type: 'SELL', quantity: '50 lots', price: '₹22,150', pnl: '+₹8,750', up: true },
  { symbol: 'RELIANCE', type: 'BUY', quantity: '100', price: '₹2,840', pnl: '-₹1,200', up: false },
  { symbol: 'ETHUSDT', type: 'SELL', quantity: '1.5', price: '₹2,02,400', pnl: '+₹6,300', up: true },
]

export default function Dashboard() {
  function handleLogout() {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Top bar */}
      <header className="bg-[#1e293b] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaDonate className="text-primary text-2xl" />
          <span className="text-xl font-bold">FutureFlow</span>
          <span className="ml-3 text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-semibold">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/tradeview"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <FaChartLine /> Live Chart
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Welcome back, Trader 👋</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, change, up, icon }) => (
            <div key={label} className="bg-[#1e293b] rounded-2xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-primary">{icon}</span>
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className={`text-xs mt-1 font-semibold ${up === true ? 'text-green-400' : up === false ? 'text-red-400' : 'text-gray-400'}`}>
                {up === true ? '▲' : up === false ? '▼' : ''} {change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Trades */}
          <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl p-6 border border-white/5">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <FaHistory className="text-primary" /> Recent Trades
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="pb-3 text-left font-medium">Symbol</th>
                    <th className="pb-3 text-left font-medium">Type</th>
                    <th className="pb-3 text-left font-medium">Qty</th>
                    <th className="pb-3 text-left font-medium">Price</th>
                    <th className="pb-3 text-right font-medium">P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((t, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 font-semibold">{t.symbol}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300">{t.quantity}</td>
                      <td className="py-3 text-gray-300">{t.price}</td>
                      <td className={`py-3 text-right font-semibold ${t.up ? 'text-green-400' : 'text-red-400'}`}>
                        {t.pnl}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <FaChartBar className="text-primary" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/tradeview"
                className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors group"
              >
                <FaChartLine className="text-primary" />
                <div>
                  <p className="text-sm font-semibold">Live BTC/USD Chart</p>
                  <p className="text-xs text-gray-400">TradingView widget</p>
                </div>
              </Link>
              <Link
                to="/strategies"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <FaChartBar className="text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold">Trading Strategies</p>
                  <p className="text-xs text-gray-400">Bullish, bearish, mean-rev</p>
                </div>
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <FaDonate className="text-yellow-400" />
                <div>
                  <p className="text-sm font-semibold">Contact an Advisor</p>
                  <p className="text-xs text-gray-400">Get expert guidance</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
