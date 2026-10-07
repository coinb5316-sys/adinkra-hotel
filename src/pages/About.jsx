// src/pages/About.jsx
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowLongRight,
  HiOutlineSparkles,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiOutlineSun,
} from 'react-icons/hi2';
import { IoWaterOutline } from 'react-icons/io5';
import { hotelInfo } from '../data/hotelData';

const values = [
  {
    id: 'care',
    icon: <HiOutlineHeart className="w-6 h-6" />,
    title: 'Care first',
    body: 'Every decision — from the linen to the light — is made with one question in mind: will this make the guest feel looked after?',
  },
  {
    id: 'place',
    icon: <HiOutlineGlobeAlt className="w-6 h-6" />,
    title: 'Rooted in Ghana',
    body: 'We source from the markets at Makola and the farms at Aburi. Our craftsmen are from Nima and Teshie. This is an Accra hotel, not a hotel that happens to be in Accra.',
  },
  {
    id: 'quiet',
    icon: <HiOutlineSun className="w-6 h-6" />,
    title: 'Quiet luxury',
    body: 'No gold leaf. No marble lobbies the size of football pitches. Luxury, for us, is a room that breathes and a team that anticipates.',
  },
  {
    id: 'craft',
    icon: <HiOutlineSparkles className="w-6 h-6" />,
    title: 'Craft in the details',
    body: 'Hand-turned wooden door handles from Kumasi. Kente woven by a single weaver in Bonwire. Nothing here is off-the-shelf.',
  },
];

const team = [
  {
    name: 'Nana Adjei',
    role: 'Founder & Managing Director',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=85&auto=format&fit=crop',
    bio: 'Third-generation hotelier. Opened The Adinkra in 1994 after twenty years managing properties across West Africa.',
  },
  {
    name: 'Ama Owusu',
    role: 'General Manager',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85&auto=format&fit=crop',
    bio: 'Trained at École Hôtelière de Lausanne. Returned to Accra in 2018 to lead the house.',
  },
  {
    name: 'Kwame Mensah',
    role: 'Executive Chef',
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85&auto=format&fit=crop',
    bio: 'Formerly of Selassie Atadika\'s Midunu. His tasting menu at Akwaaba has been called "the best meal in West Africa" by Condé Nast.',
  },
];

export default function About() {
  return (
    <div className="bg-cream-100">
      {/* HERO */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-ink-900 text-cream-50 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=2400&q=85&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/95 via-ink-900/85 to-ink-900" />
        </div>

        <div className="relative container-luxe">
          <p className="eyebrow text-gold-400 mb-6 animate-fade-in">
            Our Story
          </p>
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl max-w-4xl animate-fade-up">
            A house built on
            <br />
            <em className="font-serif italic font-normal text-gold-200">
              thirty years of listening.
            </em>
          </h1>
          <p
            className="mt-10 max-w-2xl text-cream-200/85 leading-relaxed text-lg animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            The Adinkra began with a simple belief: that a great hotel should
            feel less like a hotel and more like the home of a generous
            friend. That belief has not changed.
          </p>
        </div>
      </section>

      {/* FOUNDING STORY */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6">Est. 1994</p>
            <h2 className="heading-display text-4xl md:text-5xl text-ink-900">
              Forty-two rooms.
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                One idea.
              </em>
            </h2>

            <div className="mt-10 space-y-5 text-ink-700 leading-[1.75]">
              <p>
                In 1994, Nana Adjei returned to Accra after two decades of
                managing hotels across West Africa. He had one ambition: to
                build a property that felt like a home — not a machine for
                processing guests.
              </p>
              <p>
                He found a plot in Airport Residential Area, on a quiet avenue
                lined with frangipani. He commissioned a young Ghanaian
                architect, and together they designed a building that would
                sit low against the skyline — four storeys, a walled garden,
                and windows positioned to catch the harmattan breeze.
              </p>
              <p>
                The first guests arrived in November of that year. Thirty years
                later, some of them still come back. The garden has grown
                taller than the building. The frangipani are still there.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-200 pt-8">
              <Stat number="1994" label="Year opened" />
              <Stat number="42" label="Rooms & Suites" />
              <Stat number="5" label="Acres of Garden" />
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85&auto=format&fit=crop"
                alt="The Adinkra façade"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-56 aspect-square overflow-hidden border-8 border-cream-100">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=85&auto=format&fit=crop"
                alt="Interior detail"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24 lg:py-32 bg-cream-200">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="eyebrow mb-6">What we believe</p>
            <h2 className="heading-display text-4xl md:text-5xl text-ink-900">
              Four principles.
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                Nothing we compromise on.
              </em>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-14">
            {values.map((v, i) => (
              <div key={v.id} className="group">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-gold-500 transition-transform duration-500 group-hover:scale-110">
                    {v.icon}
                  </span>
                  <span className="h-px flex-1 bg-ink-300/60" />
                  <span className="font-display text-2xl text-ink-400/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-ink-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-ink-600 leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WELLNESS SECTION — the navbar links here */}
      <section id="wellness" className="py-24 lg:py-32 bg-ink-900 text-cream-100">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85&auto=format&fit=crop"
                alt="The Spa at Adinkra"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <p className="eyebrow text-gold-400 mb-6">Wellness</p>
            <h2 className="heading-display text-4xl md:text-5xl lg:text-6xl text-cream-50">
              The Spa at
              <br />
              <em className="font-serif italic font-normal text-gold-300">
                Adinkra.
              </em>
            </h2>

            <div className="mt-8 space-y-5 text-cream-200/85 leading-[1.75]">
              <p>
                Six treatment rooms, a hammam, and a heated vitality pool open
                from six in the morning until ten at night. Our therapists
                trained in Marrakech and Chiang Mai, and they work exclusively
                with shea and cocoa butter sourced from women-led cooperatives
                in northern Ghana.
              </p>
              <p>
                Signature treatments include the{' '}
                <em className="text-gold-300">Volta Salt Ritual</em> — a
                ninety-minute body treatment using salt harvested from the Ada
                estuary — and the{' '}
                <em className="text-gold-300">Harmattan Renewal</em>, a deep
                hydration treatment designed for the dry-season months.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <Feature icon={<IoWaterOutline className="w-5 h-5" />} label="Hammam & vitality pool" />
              <Feature icon={<IoWaterOutline className="w-5 h-5" />} label="Six treatment rooms" />
              <Feature icon={<IoWaterOutline className="w-5 h-5" />} label="Couples suite" />
              <Feature icon={<IoWaterOutline className="w-5 h-5" />} label="Open 6 AM – 10 PM" />
            </div>

            <Link
              to="/contact"
              className="mt-12 inline-flex items-center gap-3 text-xs uppercase tracking-ultra-wide text-cream-100 link-underline"
            >
              Book a treatment
              <HiOutlineArrowLongRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <div className="max-w-2xl mb-16">
            <p className="eyebrow mb-6">The People</p>
            <h2 className="heading-display text-4xl md:text-5xl text-ink-900">
              Some of the
              <br />
              <em className="font-serif italic font-normal text-gold-600">
                faces you'll meet.
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {team.map((member) => (
              <article key={member.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>
                <h3 className="font-display text-2xl text-ink-900">
                  {member.name}
                </h3>
                <p className="mt-2 text-[11px] uppercase tracking-ultra-wide text-gold-600">
                  {member.role}
                </p>
                <p className="mt-4 text-sm text-ink-600 leading-relaxed">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-200">
        <div className="container-luxe py-20 lg:py-28 text-center">
          <p className="eyebrow mb-6">Visit us</p>
          <h2 className="heading-display text-4xl md:text-5xl text-ink-900 max-w-2xl mx-auto">
            Come and see
            <br />
            <em className="font-serif italic font-normal text-gold-600">
              for yourself.
            </em>
          </h2>
          <p className="mt-8 max-w-lg mx-auto text-ink-600 leading-relaxed">
            Reserve a room, book a table at Akwaaba, or simply stop by for a
            drink at The Library Bar. We would be glad to meet you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-primary">
              Reserve a Stay
              <HiOutlineArrowLongRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="text-xs uppercase tracking-ultra-wide text-ink-700 link-underline py-4"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="font-display text-4xl lg:text-5xl text-gold-600 leading-none">
        {number}
      </p>
      <p className="text-[10px] uppercase tracking-ultra-wide text-ink-400 mt-2">
        {label}
      </p>
    </div>
  );
}

function Feature({ icon, label }) {
  return (
    <div className="flex items-center gap-3 text-sm text-cream-200/80">
      <span className="text-gold-400">{icon}</span>
      {label}
    </div>
  );
}