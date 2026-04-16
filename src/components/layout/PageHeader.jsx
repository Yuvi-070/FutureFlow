import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'

/**
 * Hero banner used on inner pages (About, Services, Projects, Contact, Strategies).
 * @param {string} title       - Page title displayed in large white text
 * @param {string[]} crumbs    - Breadcrumb labels (last one is active)
 */
export default function PageHeader({ title, crumbs = [] }) {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{
        background:
          'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/img/carousel-1.jpg) center/cover no-repeat',
      }}
    >
      {/* Animated accent bar */}
      <div
        className="absolute inset-y-0 left-0 w-32 opacity-70"
        style={{
          background: '#1e293b',
          transform: 'skewX(-10deg)',
          transformOrigin: 'top',
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm text-white/80">
              {crumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <FaChevronRight className="text-white/50 text-xs" />}
                  {i === crumbs.length - 1 ? (
                    <span className="text-primary font-semibold">{crumb}</span>
                  ) : (
                    <span className="hover:text-white">{crumb}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  )
}
