import { useScrollReveal } from '../ui/hooks'
import {
  FaFacebookF, FaTwitter, FaInstagram, FaShareAlt,
} from 'react-icons/fa'

const team = [
  {
    name: 'Omkar D Mede',
    role: 'CEO & Founder',
    initials: 'OM',
    color: 'from-red-500 to-rose-700',
    social: { fb: '#', tw: '#', ig: '#' },
  },
  {
    name: 'Yash Pimparkar',
    role: 'Co-Founder & COO',
    initials: 'YP',
    color: 'from-blue-500 to-indigo-700',
    social: { fb: '#', tw: '#', ig: '#' },
  },
  {
    name: 'Yuvraj Tale',
    role: 'CTO & Lead Engineer',
    initials: 'YT',
    color: 'from-emerald-500 to-teal-700',
    social: { fb: '#', tw: '#', ig: '#' },
  },
  {
    name: 'S.S. Patil',
    role: 'Lead Market Analyst',
    initials: 'SP',
    color: 'from-purple-500 to-violet-700',
    social: { fb: '#', tw: '#', ig: '#' },
  },
]

function TeamCard({ name, role, initials, color, social, delay = 0 }) {
  const [ref, visible] = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} group border border-gray-200 rounded-2xl overflow-hidden hover:border-transparent hover:shadow-xl transition-all duration-300`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Avatar area */}
      <div className={`relative bg-gradient-to-br ${color} h-48 flex items-center justify-center`}>
        <span className="text-5xl font-extrabold text-white/90">{initials}</span>
        {/* Social icons overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
          <a href={social.fb} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform">
            <FaFacebookF size={13} />
          </a>
          <a href={social.tw} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform">
            <FaTwitter size={13} />
          </a>
          <a href={social.ig} className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:scale-110 transition-transform">
            <FaInstagram size={13} />
          </a>
        </div>
      </div>
      {/* Info */}
      <div className="bg-brand-dark p-5 text-center">
        <h4 className="text-white font-bold text-base">{name}</h4>
        <p className="text-gray-400 text-sm mt-1">{role}</p>
      </div>
    </div>
  )
}

export default function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
          <h2 className="mt-2 text-4xl font-extrabold text-brand-dark">Meet the Team</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <TeamCard key={member.name} {...member} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
