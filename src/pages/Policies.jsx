// src/pages/Policies.jsx
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineLockClosed,
} from 'react-icons/hi2';
import { policies, hotelInfo } from '../data/hotelData';

const sections = [
  { id: 'cancellation', title: 'Cancellation', icon: <HiOutlineClock className="w-5 h-5" />, body: policies.cancellation },
  { id: 'checkIn', title: 'Check-in', icon: <HiOutlineClock className="w-5 h-5" />, body: policies.checkIn },
  { id: 'checkOut', title: 'Check-out', icon: <HiOutlineClock className="w-5 h-5" />, body: policies.checkOut },
  { id: 'payment', title: 'Payment', icon: <HiOutlineCreditCard className="w-5 h-5" />, body: policies.payment },
  { id: 'privacy', title: 'Privacy', icon: <HiOutlineShieldCheck className="w-5 h-5" />, body: policies.privacy },
  { id: 'conduct', title: 'Guest Conduct', icon: <HiOutlineUserGroup className="w-5 h-5" />, body: policies.conduct },
];

export default function Policies() {
  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-20 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Policies
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            The fine print,
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              kept simple.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Everything you need to know before, during, and after your stay.
            If anything is unclear, our team is happy to help.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-6">
                <HiOutlineDocumentText className="w-5 h-5 text-gold-500" />
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500">
                  On this page
                </p>
              </div>
              <nav>
                <ul className="space-y-1 border-l border-ink-200">
                  {sections.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="group flex items-center gap-3 pl-5 py-2.5 text-sm text-ink-600 hover:text-gold-600 transition-colors border-l-2 border-transparent hover:border-gold-500 -ml-px"
                      >
                        <span className="text-gold-500 opacity-60 group-hover:opacity-100 transition-opacity">
                          {s.icon}
                        </span>
                        <span className="font-display text-base">
                          {String(i + 1).padStart(2, '0')}. {s.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-10 p-6 bg-cream-50 border border-ink-200/60">
                <HiOutlineLockClosed className="w-5 h-5 text-gold-500 mb-3" />
                <p className="text-[10px] uppercase tracking-ultra-wide text-ink-500 mb-3">
                  Data & privacy
                </p>
                <p className="text-xs text-ink-600 leading-relaxed">
                  Payment processing is handled by Paystack, a PCI-DSS Level 1
                  certified provider. We never see or store your card details.
                </p>
              </div>
            </div>
          </aside>

          {/* Policy sections */}
          <div className="lg:col-span-8 space-y-16">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gold-500">{s.icon}</span>
                  <span className="h-px flex-1 bg-ink-200" />
                  <span className="font-display text-2xl text-ink-400/70">
                    0{i + 1}
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl text-ink-900 mb-6">
                  {s.title}
                </h2>

                <p className="text-ink-700 leading-[1.85] text-[15px]">
                  {s.body}
                </p>

                {i < sections.length - 1 && (
                  <div className="mt-16 border-t border-ink-200/60" />
                )}
              </section>
            ))}

            {/* Contact box */}
            <div className="p-8 lg:p-10 bg-ink-900 text-cream-100 mt-20">
              <p className="eyebrow text-gold-400 mb-4">Need clarification?</p>
              <h3 className="font-display text-2xl md:text-3xl text-cream-50">
                Our reservations team
                <br />
                <em className="font-serif italic font-normal text-gold-300">
                  is here to help.
                </em>
              </h3>
              <p className="mt-6 text-sm text-cream-200/80 leading-relaxed max-w-lg">
                If you have a question about any of our policies — before or
                after making a booking — please don't hesitate to reach out.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href={`tel:${hotelInfo.phone}`}
                  className="text-sm text-gold-300 link-underline"
                >
                  {hotelInfo.phoneDisplay}
                </a>
                <span className="hidden sm:block text-cream-400/40">·</span>
                <a
                  href={`mailto:${hotelInfo.email}`}
                  className="text-sm text-gold-300 link-underline"
                >
                  {hotelInfo.email}
                </a>
              </div>

              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-cream-100 link-underline"
              >
                Or send us a message
                <HiOutlineArrowLongRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}