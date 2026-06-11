// Support phone numbers - configurable
export const SUPPORT_PHONES = ["9004940265", "9373695607"];

export const BOOKING_CONFIG = {
  enabled: false, // ← flip to false for info-only / free / non-ticketed shows
};

// Event details - centralized for consistency
export const EVENT_DETAILS = {
  name: "The Notebook Concert",
  tagline: "Yaaron Ki Mehfil",
  exploreSubtitle: "The Journey", // small text above heading
  exploreHeading: "Chapters Of Friendship", // main heading
  dates: "August 02, 2026",
  eventDateTimeStart: "2026-08-02T18:30:00",
  eventDateTimeEnd: "2026-08-02T22:00:00",
  time: "6:30 PM",
  venue: "TBD",
  venueMapLink: "",
  city: "Jalgaon",
  priceRegular: 700,
  pricing: {
    earlyBird: {
      enabled: true,

      validTill: "2026-08-02T23:59:59",

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
  title: "YAARON",
  subtitle: "KI MEHFIL",
  description:
    "An immersive musical journey through friendship, laughter, memories, challenges, reunions, and forever bonds.",

  colors: {
    primary: "from-purple-600",
    secondary: "to-pink-600",
    glow: "rgba(168,85,247,0.35)",
  },
};

// ── Pass Collection Desks ──────────────────────────────────────
// Update these with your actual desk locations
export const COLLECTION_DESKS = [
  {
    id: 1,
    name: "Saffron Fine Dine",
    location: "Lane 5, Mehrun Lake, Jayant Paradise, Shirsoli Rd",
    timing: "1:00 PM – 10:00 PM",
    note: "Primary collection point",
  },
  {
    id: 2,
    name: "Mehfil Cafe",
    location: "MJ college road, below Golds Gym",
    timing: "2:00 PM – 9:30 PM",
    note: "Alternate collection point",
  },
];

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

const STAGES_OF_LOVE = [
  {
    title: "Attraction",
    desc: "Where every glance feels electric.",
    image: "/stages/attraction.jpg",
  },
  {
    title: "Attachment",
    desc: "When absence starts to hurt.",
    image: "/stages/attachment.jpg",
  },
  {
    title: "Love",
    desc: "The warmth of being truly seen.",
    image: "/stages/love.jpg",
  },
  {
    title: "Trust",
    desc: "Finding peace in another soul.",
    image: "/stages/trust.jpg",
  },
  {
    title: "Worship",
    desc: "When love becomes devotion.",
    image: "/stages/worship.jpg",
  },
  {
    title: "Madness",
    desc: "Where emotions consume reason.",
    image: "/stages/madness_1.jpg",
  },
  {
    title: "Death",
    desc: "Some love stories never really end.",
    image: "/stages/death_2.jpg",
  },
];


const CHAPTER_OF_FRIENDSHIP = [
  {
    title: "Meeting",
    desc: "Where it all began.",
    image: "/friendship/meeting.jpg",
  },
  {
    title: "Bond",
    desc: "Strangers become family.",
    image: "/friendship/bond.jpg",
  },
  {
    title: "Gang",
    desc: "Together, always unstoppable.",
    image: "/friendship/gang.jpg",
  },
  {
    title: "Memories",
    desc: "Moments we'll never forget.",
    image: "/friendship/memories.jpg",
  },
  {
    title: "Challenges",
    desc: "Standing strong together.",
    image: "/friendship/challenges_1.webp",
  },
  {
    title: "Reunion",
    desc: "Back where we belong.",
    image: "/friendship/reunion.webp",
  },
  {
    title: "Forever",
    desc: "Some friendships never fade.",
    image: "/friendship/forever.jpg",
  },
];

export const EXPLORE_ITEMS = CHAPTER_OF_FRIENDSHIP;