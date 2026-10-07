// src/pages/Dining.jsx
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineClock,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { PiForkKnifeBold } from 'react-icons/pi';
import { dining, hotelInfo } from '../data/hotelData';

const menus = {
  akwaaba: {
    intro:
      'A tasting menu that traces the flavours of the Volta, the Sahel, and the coast. Changed monthly.',
    courses: [
      {
        name: 'Kelewele & roasted plantain',
        description:
          'Ripe plantain tossed in ginger, chilli, and clove. Served with a tamarind yoghurt.',
      },
      {
        name: 'Grilled tilapia with shito',
        description:
          'Whole tilapia from the Volta estuary, grilled over charcoal. Black-pepper shito, lime, and pickled onion.',
      },
      {
        name: 'Waakye risotto',
        description:
          'Our own reimagining — sorghum and rice cooked slowly with wele, finished with a smoked-bone broth.',
      },
      {
        name: 'Jollof cooked over firewood',
        description:
          'The signature. Long-grain rice cooked in an earthen pot over open fire. Served with braised goat or grilled chicken.',
      },
      {
        name: 'Togolese chocolate tart',
        description:
          'Single-origin cocoa from the Volta region, dark and bitter, with a burnt-honey ice cream.',
      },
    ],
  },
  soleil: {
    intro:
      'A terrace of olive trees and small fires. Lunch and dinner served from noon until late.',
    courses: [
      {
        name: 'Charcoal-grilled octopus',
        description:
          'Slow-braised then finished over fire. With a smoked paprika aioli and lemon oil.',
      },
      {
        name: 'Hand-rolled tagliatelle',
        description:
          'Semolina pasta, slow-cooked ragù of local beef, and a fistful of aged pecorino.',
      },
      {
        name: 'Whole branzino baked in salt',
        description:
          'For two. Cracked tableside, served with a lemon-and-herb oil and grilled chicory.',
      },
      {
        name: 'Saffron risotto with prawns',
        description:
          'Carnaroli rice, prawns from the Volta, and a saffron broth.',
      },
    ],
  },
  'the-library': {
    intro:
      'Low light, deep chairs, and a whisky list that runs to sixty bottles. Live highlife on Fridays.',
    courses: [
      {
        name: 'The Adinkra Sour',
        description:
          'Akpeteshie, hibiscus syrup, lime, and a whisper of toasted nutmeg.',
      },
      {
        name: 'Cocoa Old Fashioned',
        description:
          'Bourbon, Togolese cocoa, palm sugar, and burnt orange.',
      },
      {
        name: 'Small plates',
        description:
          'Charcuterie from the Volta, aged cheeses, spiced nuts, and pickles made in our kitchen.',
      },
      {
        name: 'Late-night bites',
        description:
          'Suya skewers, plantain chips, and grilled oysters until one in the morning.',
      },
    ],
  },
};

export default function Dining() {
  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-ink-900 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2400&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/95 via-ink-900/85 to-ink-900" />
        </div>

        <div className="relative container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Dining
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-3xl animate-fade-up">
            Three rooms.
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              One obsession.
            </em>
          </h1>
          <p
            className="mt-8 max-w-xl text-cream-200/80 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Our kitchens are the soul of the house. From firewood jollof to a
            charcoal grill on the terrace — every plate tells a story we are
            proud to serve.
          </p>
        </div>
      </section>

      {/* RESTAURANT SECTIONS — alternating layout */}
      {dining.map((place, i) => (
        <RestaurantSection
          key={place.id}
          place={place}
          menu={menus[place.id]}
          reversed={i % 2 === 1}
          index={i}
        />
      ))}

      {/* RESERVATION CTA */}
      <section className="border-t border-ink-200 py-20 lg:py-28 bg-cream-200">
        <div className="container-luxe text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-6">Reserve a Table</p>
          <h2 className="heading-display text-4xl md:text-5xl text-ink-900">
            Let us set
            <br />
            <em className="font-serif italic font-normal text-gold-600">
              a table for you.
            </em>
          </h2>
          <p className="mt-8 text-ink-600 leading-relaxed">
            Reservations are recommended for dinner and essential on weekends.
            For parties of eight or more, or for private dining, please call us
            directly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${hotelInfo.phone}`} className="btn-primary">
              <HiOutlinePhone className="w-4 h-4" />
              Call {hotelInfo.phoneDisplay}
            </a>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-ultra-wide text-ink-700 link-underline py-4"
            >
              Send a request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function RestaurantSection({ place, menu, reversed, index }) {
  return (
    <section
      className={`py-20 lg:py-32 ${index > 0 ? 'border-t border-ink-200' : ''}`}
    >
      <div className="container-luxe">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Image */}
          <div className={`lg:col-span-6 ${reversed ? 'lg:order-2' : ''}`}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`lg:col-span-6 ${reversed ? 'lg:order-1' : ''}`}>
            <p className="eyebrow mb-4">{place.cuisine}</p>
            <h2 className="heading-display text-4xl md:text-5xl text-ink-900">
              {place.name}
            </h2>

            <p className="mt-6 text-ink-700 leading-[1.75]">
              {place.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-widest text-ink-500">
              <span className="flex items-center gap-2">
                <HiOutlineClock className="w-4 h-4 text-gold-500" />
                {place.hours}
              </span>
            </div>

            {/* Menu */}
            {menu && (
              <div className="mt-10 border-t border-ink-200 pt-10">
                <p className="text-[10px] uppercase tracking-ultra-wide text-gold-600 mb-3">
                  From the menu
                </p>
                <p className="text-sm text-ink-600 italic mb-6">
                  {menu.intro}
                </p>

                <ul className="space-y-6">
                  {menu.courses.map((course, i) => (
                    <li
                      key={i}
                      className="pb-6 border-b border-ink-200/60 last:border-0 last:pb-0"
                    >
                      <h4 className="font-display text-xl text-ink-900">
                        {course.name}
                      </h4>
                      <p className="mt-2 text-sm text-ink-600 leading-relaxed">
                        {course.description}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <a
                    href={`tel:${hotelInfo.phone}`}
                    className="inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-900 link-underline"
                  >
                    <HiOutlinePhone className="w-4 h-4" />
                    Reserve by phone
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-ink-500 hover:text-gold-600 transition-colors"
                  >
                    <PiForkKnifeBold className="w-4 h-4" />
                    Request online
                    <HiOutlineArrowLongRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}