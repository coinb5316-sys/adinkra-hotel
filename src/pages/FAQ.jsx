// src/pages/FAQ.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineArrowLongRight,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { faqs, hotelInfo } from '../data/hotelData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="pt-32 lg:pt-40 pb-14 lg:pb-20 bg-ink-900 text-cream-50">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Frequently Asked
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            Questions,
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              answered honestly.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            The things guests most often ask us, before they arrive. If you
            don't find what you're looking for here, our team is only a call
            away.
          </p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="py-16 lg:py-24">
        <div className="container-luxe max-w-3xl mx-auto">
          <div className="divide-y divide-ink-200 border-y border-ink-200">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                index={i}
              />
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-20 text-center">
            <p className="eyebrow mb-6">Still need help?</p>
            <h2 className="heading-display text-3xl md:text-4xl text-ink-900 max-w-xl mx-auto">
              Our team is here
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                around the clock.
              </em>
            </h2>
            <p className="mt-6 text-ink-600 leading-relaxed max-w-lg mx-auto">
              Call us any hour of the day, or send a message and we'll respond
              within a few hours.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`tel:${hotelInfo.phone}`} className="btn-primary">
                <HiOutlinePhone className="w-4 h-4" />
                {hotelInfo.phoneDisplay}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-700 link-underline py-4"
              >
                Send a message
                <HiOutlineArrowLongRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AccordionItem({ question, answer, open, onToggle, index }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-7 text-left group"
        aria-expanded={open}
      >
        <div className="flex items-start gap-5 flex-1">
          <span className="font-display text-2xl text-gold-500 leading-none mt-1 flex-shrink-0">
            0{index + 1}
          </span>
          <span className="font-display text-xl md:text-2xl text-ink-900 group-hover:text-gold-600 transition-colors leading-snug">
            {question}
          </span>
        </div>
        <span
          className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 mt-1 ${
            open
              ? 'bg-gold-500 border-gold-500 text-white'
              : 'border-ink-300 text-ink-500 group-hover:border-gold-500 group-hover:text-gold-500'
          }`}
        >
          {open ? (
            <HiOutlineMinus className="w-4 h-4" />
          ) : (
            <HiOutlinePlus className="w-4 h-4" />
          )}
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pl-14 pr-12 pb-8 text-sm md:text-base text-ink-600 leading-[1.75]">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}