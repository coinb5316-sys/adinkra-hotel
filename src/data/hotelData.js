// src/data/hotelData.js
export const hotelInfo = {
  name: 'The Adinkra',
  tagline: 'A Sanctuary of Refined Ghanaian Hospitality',
  shortDescription:
    'An intimate retreat where Akan craftsmanship meets contemporary comfort — nestled in the leafy calm of Airport Residential Area, minutes from Kotoka.',
  address: '7 Kofi Annan Avenue, Airport Residential Area, Accra, Ghana',
  phone: '+233 59 313 7757',
  phoneDisplay: '+233 59 313 7757',
  email: 'reservations@theadinkra.com',
  hours: {
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    reception: 'Open 24 hours',
  },
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
};

export const rooms = [
  {
    id: 'garden-suite',
    name: 'The Aburi Suite',
    category: 'Signature Suite',
    price: 4850, // GHS per night
    size: 68,
    guests: 2,
    beds: '1 King',
    view: 'Private Garden',
    image:
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'Overlooking our walled botanical garden — palms, frangipani, and a small pond — this ground-floor suite is the quietest room in the house. French doors open onto a private terrace; the bath is cut from Italian marble.',
    shortDescription:
      'A ground-floor sanctuary with private terrace and garden access.',
    amenities: [
      'Private terrace',
      'Marble bath',
      'Nespresso machine',
      'Egyptian cotton linens',
      'Rain shower',
      'Complimentary minibar',
    ],
    featured: true,
  },
  {
    id: 'atlantic-suite',
    name: 'The Atlantic Suite',
    category: 'Deluxe Suite',
    price: 7200,
    size: 92,
    guests: 3,
    beds: '1 King + Daybed',
    view: 'Gulf of Guinea',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'The Gulf of Guinea unfolds before you through floor-to-ceiling glass. A corner suite with wraparound views across the Accra skyline, a separate sitting room, and a bath designed for lingering.',
    shortDescription:
      'A corner suite with sweeping Gulf views and separate living space.',
    amenities: [
      'Ocean view',
      'Separate lounge',
      'Soaking tub',
      'Butler service',
      'Bose sound system',
      'Evening turndown',
    ],
    featured: true,
  },
  {
    id: 'penthouse',
    name: 'The Osu Penthouse',
    category: 'Penthouse',
    price: 18500,
    size: 210,
    guests: 4,
    beds: '2 Kings',
    view: 'Panoramic Accra',
    image:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1600&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'The top floor, entirely yours. Two bedrooms, a private chef kitchen, an outdoor plunge pool, and a study lined in odum wood. Reserved for those who require the extraordinary.',
    shortDescription:
      'The entire top floor — private pool, chef kitchen, and panoramic views.',
    amenities: [
      'Private plunge pool',
      'Chef kitchen',
      'Personal butler',
      'Airport transfer',
      'Chauffeur service',
      'Dining for eight',
    ],
    featured: true,
  },
  {
    id: 'classic-king',
    name: 'Classic King',
    category: 'Room',
    price: 2800,
    size: 42,
    guests: 2,
    beds: '1 King',
    view: 'City Courtyard',
    image:
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'An elegant introduction to The Adinkra. Quiet, considered, and beautifully appointed with the same attention to detail as our suites.',
    shortDescription: 'Refined comfort with our signature bedding and amenities.',
    amenities: ['King bed', 'Rain shower', 'Smart TV', 'Work desk', 'In-room safe'],
    featured: false,
  },
  {
    id: 'twin-room',
    name: 'The Twin',
    category: 'Room',
    price: 2950,
    size: 45,
    guests: 2,
    beds: '2 Doubles',
    view: 'City View',
    image:
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'Designed for companions travelling together — two plush double beds, generous storage, and a window seat overlooking the avenue.',
    shortDescription: 'Two doubles, ideal for friends or family travelling together.',
    amenities: ['Two double beds', 'Window seat', 'Rain shower', 'Smart TV', 'Minibar'],
    featured: false,
  },
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    category: 'Suite',
    price: 6400,
    size: 78,
    guests: 2,
    beds: '1 King',
    view: 'Accra Skyline',
    image:
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=80&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1600&q=80&auto=format&fit=crop',
    ],
    description:
      'A suite for those who work beautifully. Separate lounge, executive desk, and access to our private Business Lounge on the 14th floor.',
    shortDescription: 'Suite living with Business Lounge access and skyline views.',
    amenities: [
      'Business Lounge access',
      'Executive desk',
      'Separate lounge',
      'Nespresso machine',
      'Turndown service',
    ],
    featured: false,
  },
];

export const amenities = [
  {
    id: 'spa',
    title: 'The Spa at Adinkra',
    description:
      'Six treatment rooms, a hammam, and a heated vitality pool. Our therapists trained in Marrakech and Chiang Mai — with shea and cocoa butter sourced from the north of Ghana.',
  },
  {
    id: 'dining',
    title: 'Two Restaurants',
    description:
      'Akwaaba — our Ghanaian kitchen, seasonal and refined. And Soleil — a Mediterranean grill on the terrace. Led by Chef Kwame Mensah.',
  },
  {
    id: 'pool',
    title: 'Rooftop Pool',
    description:
      'A 25-metre infinity pool on the sixteenth floor, open from dawn until midnight. Cabanas available.',
  },
  {
    id: 'gym',
    title: 'Fitness Studio',
    description:
      'Technogym equipment, personal trainers on request, and daily sunrise yoga on the terrace.',
  },
  {
    id: 'business',
    title: 'Business Lounge',
    description:
      'Private meeting rooms, secretarial services, and a quiet library. Available to suite guests.',
  },
  {
    id: 'concierge',
    title: '24-Hour Concierge',
    description:
      'Theatre tickets, private tours of Jamestown, restaurant reservations — nothing is too much to ask.',
  },
];

export const testimonials = [
  {
    id: 1,
    quote:
      'I have stayed in hotels on five continents. The Adinkra is the only one I dream about between visits. The staff remember your name. The light in the suites is extraordinary.',
    name: 'Akosua Boateng',
    title: 'Creative Director, Accra',
    location: 'Stayed in The Atlantic Suite',
  },
  {
    id: 2,
    quote:
      'Understated in the best possible way. Nothing shouts. Everything whispers. This is what luxury should be.',
    name: 'James Whitfield',
    title: 'Architect, London',
    location: 'Stayed in The Osu Penthouse',
  },
  {
    id: 3,
    quote:
      'The Aburi Suite was the most peaceful two nights I have had in years. I did not want to leave, and I have already booked to return.',
    name: 'Fatima Al-Rashid',
    title: 'Physician, Dubai',
    location: 'Stayed in The Aburi Suite',
  },
];

export const dining = [
  {
    id: 'akwaaba',
    name: 'Akwaaba',
    cuisine: 'Contemporary Ghanaian',
    hours: 'Dinner, Tuesday to Sunday — 6:30 PM to 11:00 PM',
    description:
      'Jollof cooked over firewood, grilled tilapia with shito, and a tasting menu that traces the flavours of the Volta. Our head chef trained under Selassie Atadika.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80&auto=format&fit=crop',
  },
  {
    id: 'soleil',
    name: 'Soleil',
    cuisine: 'Mediterranean Grill',
    hours: 'Lunch & Dinner, Daily — 12:00 PM to 10:30 PM',
    description:
      'A terrace of olive trees and small fires. Charcoal-grilled fish, hand-rolled pasta, and a wine list that runs from Santorini to Stellenbosch.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80&auto=format&fit=crop',
  },
  {
    id: 'the-library',
    name: 'The Library Bar',
    cuisine: 'Cocktails & Small Plates',
    hours: 'Daily — 4:00 PM to 1:00 AM',
    description:
      'Low light, deep chairs, and a whisky list that runs to sixty bottles. Live highlife on Fridays.',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&q=80&auto=format&fit=crop',
  },
];

export const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80&auto=format&fit=crop',
    alt: 'The Aburi Suite',
    category: 'Rooms',
  },
  {
    src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80&auto=format&fit=crop',
    alt: 'The lobby at dusk',
    category: 'Spaces',
  },
  {
    src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80&auto=format&fit=crop',
    alt: 'The Spa at Adinkra',
    category: 'Wellness',
  },
  {
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80&auto=format&fit=crop',
    alt: 'Rooftop pool',
    category: 'Spaces',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop',
    alt: 'Soleil terrace',
    category: 'Dining',
  },
  {
    src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80&auto=format&fit=crop',
    alt: 'The Library Bar',
    category: 'Dining',
  },
];

export const faqs = [
  {
    question: 'What time is check-in and check-out?',
    answer:
      'Check-in begins at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be arranged in advance, subject to availability. Suite and Penthouse guests enjoy complimentary flexible timings.',
  },
  {
    question: 'Do you offer airport transfers?',
    answer:
      'Yes. We are twelve minutes from Kotoka International Airport. We provide complimentary transfers for Penthouse guests and can arrange private car service for all other reservations. Please provide your flight details at least 24 hours before arrival.',
  },
  {
    question: 'Is parking available?',
    answer:
      'We offer complimentary valet parking for all guests, with secure underground parking for up to 80 vehicles. Electric vehicle charging is available on request.',
  },
  {
    question: 'Are pets welcome?',
    answer:
      'Small pets under 10kg are welcome in our Aburi Suite and select rooms for a fee of GHS 400 per stay. Please notify us when booking so we can prepare appropriately.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Reservations cancelled more than 48 hours before check-in receive a full refund. Cancellations within 48 hours are charged the first night. Non-refundable rates are clearly marked at the time of booking.',
  },
  {
    question: 'Do you have accessible rooms?',
    answer:
      'Yes. Two of our Classic King rooms are fully accessible, with roll-in showers, lowered fixtures, and widened doorways. Please mention accessibility needs when booking.',
  },
];

export const policies = {
  cancellation: `Reservations may be cancelled without charge up to 48 hours prior to the scheduled check-in date. Cancellations made within 48 hours of arrival will be charged one night's room rate plus applicable taxes. No-shows are charged the full stay. Non-refundable and prepaid rates are identified at the time of booking and cannot be cancelled or modified.`,
  checkIn: `Check-in begins at 3:00 PM. Guests under 18 must be accompanied by an adult. A valid government-issued photo ID and the credit card used for booking are required at check-in. Early check-in is subject to availability and may incur a fee.`,
  checkOut: `Check-out is at 11:00 AM. Late check-out until 2:00 PM may be arranged for 50% of the nightly rate, subject to availability. Beyond 2:00 PM, a full night's rate applies.`,
  payment: `We accept all major credit cards, debit cards, bank transfers, and mobile money via Paystack. A pre-authorization equal to one night's stay is taken at check-in. The balance is settled at check-out.`,
  privacy: `We collect only the information necessary to fulfil your reservation and to comply with legal obligations. Your data is never sold. Payment information is processed by Paystack and is not stored on our servers. You may request a copy or deletion of your data at any time by writing to privacy@theadinkra.com.`,
  conduct: `The Adinkra is a place of quiet. We ask that guests keep noise to a minimum in corridors and public areas after 10:00 PM. Smoking is permitted only on private terraces and designated outdoor areas. Failure to observe these guidelines may result in a request to leave without refund.`,
};