import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export default function TradeView() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up any previous widget
    containerRef.current.innerHTML = ''

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container'
    widgetContainer.style.width = '100%'
    widgetContainer.style.height = '100%'

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.style.width = '100%'
    widgetDiv.style.height = '100%'
    widgetContainer.appendChild(widgetDiv)

    containerRef.current.appendChild(widgetContainer)

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'BINANCE:BTCUSDT',
          interval: '60',
          timezone: 'Asia/Kolkata',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1e293b',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tv_chart_main',
          studies: ['Volume@tv-basicstudies', 'MACD@tv-basicstudies'],
        })
      }
    }
    widgetContainer.appendChild(script)

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#131722] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1e29] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white text-xl font-bold">BTC/USD Live Chart</h1>
          <p className="text-gray-400 text-xs">Powered by TradingView · Binance data</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            <FaArrowLeft /> Dashboard
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Chart */}
      <div
        id="tv_chart_main"
        ref={containerRef}
        className="flex-1"
        style={{ minHeight: 'calc(100vh - 65px)' }}
      />
    </div>
  )
}
