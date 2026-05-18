// Support phone numbers - configurable
export const SUPPORT_PHONES = ["9004940265", "9373695607"];

// Event details - centralized for consistency
export const EVENT_DETAILS = {
  name: "The Notebook Concert",
  tagline: "7 Stages of Love",
  dates: "June 06, 2026",
  eventDateTimeStart: "2026-06-06T18:30:00",
  eventDateTimeEnd: "2026-06-06T22:00:00",
  time: "6:30 PM",
  venue: "Saffron Hotel",
  city: "Jalgaon",
  priceRegular: 700,
  pricing: {
    earlyBird: {
      enabled: true,

      validTill: "2026-05-24T23:59:59",

      price: 600,
    },

    regular: {
      singleTicketPrice: 700,

      bulkTicketPrice: 650,

      bulkMinTickets: 2,
    },
  },
};

// Social media links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/thenotebookconcert",
  twitter: "https://twitter.com/notebookconcert",
  youtube: "https://youtube.com/@thenotebookconcert",
};

export const CONCERT_THEME = {
  title: "7 STAGES",
  subtitle: "OF LOVE",
  description:
    "An immersive musical journey through attraction, obsession, heartbreak, devotion, and forever.",

  colors: {
    primary: "from-purple-600",
    secondary: "to-pink-600",
    glow: "rgba(168,85,247,0.35)",
  },
};

// ─── Event State ─────────────────────────────────────────────
// Flip these booleans to change what the site shows.
//
//  isLive=true,  isSoldOut=false, isEventEnded=false  → normal booking
//  isLive=false, isSoldOut=false, isEventEnded=false  → booking paused
//  isLive=true,  isSoldOut=true,  isEventEnded=false  → sold-out page
//  isLive=*,     isSoldOut=*,     isEventEnded=true   → post-event mode
//
export const EVENT_STATE = {
  isLive: true,
  isSoldOut: false,
  isEventEnded: new Date() > new Date(EVENT_DETAILS.eventDateTimeEnd),
};

// ─── Post-Event Overrides ─────────────────────────────────────
// When isEventEnded=true the homepage replaces dynamic CTAs with
// these static strings so you don't need to touch the component.
export const POST_EVENT = {
  ctaLabel: "Watch the Recap",
  ctaHref: SOCIAL_LINKS.instagram,
  badge: "Thank you for being part of the story",
};
