// ─────────────────────────────────────────────────────────────────
// PAST EVENTS — single source of truth for the "Past Events" page
// and its detail pages.
//
// To add a new past event: copy the object below, give it a unique
// `slug` (used in the URL as /past-events/<slug>), and fill in the
// fields. No changes to PastEvents.jsx or PastEventDetail.jsx are
// needed — both render entirely from this array.
//
// Field notes:
// - slug: lowercase, hyphenated, unique, never reused (it's the
//   permanent URL — changing it later breaks any links/SEO already
//   built up for that page).
// - date: ISO format (YYYY-MM-DD), used for sorting and for the
//   structured data Google reads — keep it accurate even though
//   `displayDate` is what's actually shown on the page.
// - coverImage / gallery: paths are relative to /public, e.g. an
//   image at public/past-events/my-show/cover.webp is referenced as
//   "/past-events/my-show/cover.webp".
// - highlights: short punchy lines, shown as a checklist on the
//   detail page.
// - videoUrl: optional. A YouTube watch/share/embed link — the
//   detail page converts it to an embeddable player automatically.
// ─────────────────────────────────────────────────────────────────

export const PAST_EVENTS = [
  {
    slug: "seven-stages-of-love-jalgaon-jun-2026",
    title: "Seven Stages Of Love",
    subtitle: "The Notebook Concert",
    displayDate: "6th June 2026",
    date: "2026-06-06",
    venue: "Saffron Hotel",
    city: "Jalgaon, Maharashtra",
    attendeeCount: "90+",
    tags: [
      "Live Music",
      "Storytelling",
      "Piano",
      "Bass Guitar",
      "Drums",
      "Cinematic Visuals",
    ],
    coverImage:
      "/past_events/seven_stages_of_love_jun_2026/7_stages_event_banner_2.webp",
    gallery: [
      "/past_events/seven_stages_of_love_jun_2026/audience_3.webp",
      "/past_events/seven_stages_of_love_jun_2026/band_photo_3.webp",
      "/past_events/seven_stages_of_love_jun_2026/anchor_1.webp",
      "/past_events/seven_stages_of_love_jun_2026/band_photo_2.webp",
      "/past_events/seven_stages_of_love_jun_2026/audience_5.webp",
      "/past_events/seven_stages_of_love_jun_2026/sanam_and_rahul_with_instru.webp",
    ],
    shortDescription:
      "A sold-out evening of live storytelling and music with Sanam and Rahul at Saffron Hotel, Jalgaon.",
    description:
      "The Notebook Concert brought together live vocals, piano, bass guitar, drum and cinematic visuals for a night built like the pages of a diary. Sanam and Rahul with the band performed an emotional, narrative-driven set in front of a packed room, closing out the evening with a singalong that the crowd didn't want to end.",
    highlights: [
      "Sold-out show — every seat booked",
      "Live performance by Sanam, Rahul, and the band",
      "Immersive projection mapping and lighting design",
      "Surprise acoustic encore to close the night",
    ],
    artists: [
      { name: "Sanam", role: "Vocals", image: "/artists/sanam.webp" },
      { name: "Rahul", role: "Piano", image: "/artists/rahul.webp" },
      { name: "Akshay", role: "Drums", image: "/artists/akshay.webp" },
      { name: "Sachin", role: "Bass Guitar", image: "/artists/sachin.webp" },
    ],

    videoUrl: "https://youtube.com/shorts/Q9hf5h-v6MY?si=n6cK3o4fX7Cy38-B",
  },
  // ↓ Add your next completed event here, following the same shape.
  // {
  //   slug: "your-next-event-slug",
  //   title: "Event Name",
  //   subtitle: "Tagline",
  //   displayDate: "Month Year",
  //   date: "YYYY-MM-DD",
  //   venue: "Venue name",
  //   city: "City, State",
  //   attendeeCount: "200+",
  //   tags: ["Tag 1", "Tag 2"],
  //   coverImage: "/past-events/your-event/cover.webp",
  //   gallery: ["/past-events/your-event/1.webp"],
  //   shortDescription: "One or two lines for cards and meta tags.",
  //   description: "Longer recap shown on the detail page.",
  //   highlights: ["Highlight one", "Highlight two"],
  //   artists: ["Artist Name"],
  //   videoUrl: "https://youtube.com/watch?v=...",
  // },
];

// Events are shown newest-first on the listing page.
export const getPastEventsSorted = () =>
  [...PAST_EVENTS].sort((a, b) => new Date(b.date) - new Date(a.date));

export const getPastEventBySlug = (slug) =>
  PAST_EVENTS.find((event) => event.slug === slug);
