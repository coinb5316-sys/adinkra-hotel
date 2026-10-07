// src/pages/Contact.jsx
import { useState } from 'react';
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineArrowLongRight,
} from 'react-icons/hi2';
import { hotelInfo } from '../data/hotelData';

const SUBJECTS = [
  'Room reservation',
  'Restaurant booking',
  'Spa appointment',
  'Private event or wedding',
  'Press or media enquiry',
  'Careers',
  'Something else',
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please write a short message (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    // In production: POST to your backend / email service
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject(SUBJECTS[0]);
    setMessage('');
  };

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-0.19%2C5.59%2C-0.17%2C5.61&layer=mapnik&marker=5.6000%2C-0.1800`;

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-20 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Contact
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            We're here,
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              whenever you need us.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Whether you're planning a stay, booking a table, or simply curious
            about the house — write to us and we'll respond within the day.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* FORM */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl text-ink-900 mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-ink-500 mb-10">
              Required fields are marked with an asterisk.
            </p>

            {sent ? (
              <div className="p-8 border border-gold-400/60 bg-gold-50">
                <div className="flex items-start gap-4">
                  <HiOutlineCheckCircle className="w-8 h-8 text-gold-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-2xl text-ink-900">
                      Thank you — your message is on its way.
                    </h3>
                    <p className="mt-3 text-ink-700 leading-relaxed">
                      A member of our team will reply to you within a few
                      hours. If your matter is urgent, please call us at{' '}
                      <a
                        href={`tel:${hotelInfo.phone}`}
                        className="link-underline text-ink-900"
                      >
                        {hotelInfo.phoneDisplay}
                      </a>
                      .
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-900 link-underline"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Your name *">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Akosua Boateng"
                      className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                      required
                    />
                  </Field>

                  <Field label="Email *">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                      required
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Phone">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 ..."
                      className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
                    />
                  </Field>

                  <Field label="Subject">
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-transparent text-sm text-ink-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
                    Your message *
                  </span>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us a little about what you have in mind…"
                    className="mt-2 w-full bg-transparent border-b border-ink-300 focus:border-gold-500 py-3 text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none resize-none transition-colors"
                    required
                  />
                </label>

                {error && (
                  <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 text-red-800 text-xs leading-relaxed">
                    <HiOutlineExclamationTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex items-center gap-3 bg-ink-900 text-cream-100 hover:bg-gold-500 hover:text-white px-10 py-5 text-[11px] uppercase tracking-ultra-wide font-medium transition-colors duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                  {!submitting && (
                    <HiOutlineArrowLongRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* INFO + MAP */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-cream-50 border border-ink-200/60 p-8">
              <p className="eyebrow mb-6">Reach us directly</p>

              <ul className="space-y-6">
                <ContactItem
                  icon={<HiOutlineMapPin className="w-5 h-5" />}
                  label="Address"
                >
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      hotelInfo.address,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-600 transition-colors"
                  >
                    {hotelInfo.address}
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<HiOutlinePhone className="w-5 h-5" />}
                  label="Telephone"
                >
                  <a
                    href={`tel:${hotelInfo.phone}`}
                    className="hover:text-gold-600 transition-colors"
                  >
                    {hotelInfo.phoneDisplay}
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<HiOutlineEnvelope className="w-5 h-5" />}
                  label="Email"
                >
                  <a
                    href={`mailto:${hotelInfo.email}`}
                    className="hover:text-gold-600 transition-colors"
                  >
                    {hotelInfo.email}
                  </a>
                </ContactItem>

                <ContactItem
                  icon={<HiOutlineClock className="w-5 h-5" />}
                  label="Reception"
                >
                  {hotelInfo.hours.reception}
                </ContactItem>
              </ul>
            </div>

            {/* Map */}
            <div className="border border-ink-200/60 overflow-hidden">
              <iframe
                title="The Adinkra location"
                src={mapSrc}
                className="w-full h-80 grayscale-[30%]"
                loading="lazy"
              />
            </div>

            <p className="text-xs text-ink-500 leading-relaxed">
              Twelve minutes by car from Kotoka International Airport. Private
              transfers can be arranged at the time of booking.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-ultra-wide text-ink-400">
        {label}
      </span>
      <span className="mt-2 flex items-center gap-3 border-b border-ink-300 focus-within:border-gold-500 py-3 transition-colors">
        {children}
      </span>
    </label>
  );
}

function ContactItem({ icon, label, children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="text-gold-500 mt-1 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mb-1">
          {label}
        </p>
        <p className="text-sm text-ink-800 leading-relaxed">{children}</p>
      </div>
    </li>
  );
}