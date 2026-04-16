import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaChartLine, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function Signup() {
  const [form, setForm] = useState({ user: '', pass: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const existing = localStorage.getItem('tradingUser')
    if (existing === form.user) {
      setError('Trader ID already exists. Please choose a different one.')
      return
    }
    if (form.pass !== form.confirm) {
      setError('PINs do not match. Please re-enter.')
      return
    }
    if (form.user.length < 6) {
      setError('Trader ID must be at least 6 characters.')
      return
    }
    if (form.pass.length < 8) {
      setError('PIN must be at least 8 characters.')
      return
    }
    localStorage.setItem('tradingUser', form.user)
    localStorage.setItem('tradingPass', form.pass)
    navigate('/login')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.72)), url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1950&q=80) center/cover no-repeat',
      }}
    >
      <div className="w-full max-w-md mx-4 bg-[rgba(18,23,34,0.92)] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-3">
            <FaChartLine className="text-primary text-2xl" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-widest uppercase">Trader Registration</h1>
          <p className="text-gray-400 text-sm mt-1">Create your trading account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Trader ID</label>
            <input
              type="text"
              name="user"
              value={form.user}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Create Trader ID (min 6 chars)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-green-400 focus:bg-green-400/5 transition"
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 mb-1">Secure PIN</label>
            <input
              type={showPass ? 'text' : 'password'}
              name="pass"
              value={form.pass}
              onChange={handleChange}
              required
              minLength={8}
              placeholder="Set PIN (min 8 chars)"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-12 text-white text-sm placeholder-white/40 focus:outline-none focus:border-green-400 focus:bg-green-400/5 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-8 text-gray-400 hover:text-white"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Confirm PIN</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              required
              placeholder="Re-enter your PIN"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-green-400 focus:bg-green-400/5 transition"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold uppercase tracking-wide hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/20 mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already a trader?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold">
            Login Here
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-xs">
            ← Back to FutureFlow
          </Link>
        </p>
      </div>
    </div>
  )
}
