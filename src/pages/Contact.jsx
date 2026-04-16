import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa'

const contactInfo = [
  {
    icon: <FaMapMarkerAlt className="text-white text-xl" />,
    label: 'Address',
    value: '123 Wagholi Pune, Maharashtra, India',
  },
  {
    icon: <FaPhone className="text-white text-xl" />,
    label: 'Phone',
    value: '+91 9168505043',
    href: 'tel:+919168505043',
  },
  {
    icon: <FaEnvelope className="text-white text-xl" />,
    label: 'Email',
    value: 'info@futureflow.com',
    href: 'mailto:info@futureflow.com',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', project: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', phone: '', project: '', subject: '', message: '' })
  }

  return (
    <>
      <PageHeader title="Contact Us" crumbs={['Home', 'Pages', 'Contact']} />

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact Info Panel */}
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
              <h2 className="mt-2 text-4xl font-extrabold text-brand-dark mb-8">
                We'd Love to Hear From You
              </h2>
              <div className="space-y-6">
                {contactInfo.map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-dark">{label}</p>
                      {href ? (
                        <a href={href} className="text-gray-600 hover:text-primary transition-colors text-sm">
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-600 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-10 rounded-2xl overflow-hidden h-52 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400 text-sm">Map coming soon</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <FaPaperPlane className="text-green-500 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-brand-dark mb-6">Send a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name', label: 'Your Name', type: 'text' },
                      { name: 'email', label: 'Your Email', type: 'email' },
                      { name: 'phone', label: 'Your Phone', type: 'tel' },
                      { name: 'project', label: 'Your Project', type: 'text' },
                    ].map(({ name, label, type }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          required={name === 'name' || name === 'email'}
                          placeholder={label}
                          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your project or question..."
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <FaPaperPlane /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
