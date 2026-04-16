import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaDonate, FaMapMarkerAlt, FaEnvelope, FaPhone,
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaAngleRight, FaArrowRight,
} from 'react-icons/fa'

const exploreLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/projects', label: 'Our Projects' },
]

const popularPosts = [
  { category: 'Investment', title: 'Revisiting Your Investment & Distribution Goals' },
  { category: 'Business', title: 'Dimensional Fund Advisors Interview with Director' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-brand-dark text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Newsletter */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <FaDonate className="text-primary text-2xl" />
              <span className="text-white text-xl font-bold">FutureFlow</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Stay informed with the latest financial strategies and AI-powered investment insights.
              Your future starts today.
            </p>
            {subscribed ? (
              <p className="text-primary font-semibold text-sm">✓ Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 rounded-lg px-3 py-2 text-sm bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Explore</h4>
            <ul className="space-y-2">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <FaAngleRight className="text-primary text-xs" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                <span>123 Wagholi Pune, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary shrink-0" />
                <a href="tel:+919168505043" className="hover:text-primary transition-colors">
                  +91 9168505043
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary shrink-0" />
                <a href="mailto:info@futureflow.com" className="hover:text-primary transition-colors">
                  info@futureflow.com
                </a>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex gap-2 mt-5">
              {[
                { icon: <FaFacebookF />, href: 'https://facebook.com' },
                { icon: <FaTwitter />, href: 'https://twitter.com' },
                { icon: <FaInstagram />, href: 'https://instagram.com' },
                { icon: <FaLinkedinIn />, href: 'https://linkedin.com' },
              ].map(({ icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Popular Posts */}
          <div>
            <h4 className="text-white font-bold text-base mb-5">Popular Posts</h4>
            <div className="space-y-4">
              {popularPosts.map((post, i) => (
                <div key={i}>
                  <p className="text-primary text-xs font-semibold uppercase mb-1">
                    {post.category}
                  </p>
                  <a href="#" className="text-sm hover:text-white transition-colors leading-snug block">
                    {post.title}
                  </a>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-primary hover:text-white transition-colors"
            >
              View All Posts <FaArrowRight className="text-xs" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{' '}
          <a href="/" className="text-primary hover:underline">futureflow.com</a>
          {' '}— All rights reserved.
        </div>
      </div>
    </footer>
  )
}
