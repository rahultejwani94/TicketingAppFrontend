"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Music,
  Ticket,
  ChevronRight,
  Star,
  Mic2,
  Film,
  Heart,
  Calendar,
  MapPin,
  Menu,
  X,
  Clock,
  ExternalLink,
} from "lucide-react";
import ConcertLayout from "./ConcertLayout";
import { GlassCard, SectionHeading } from "./ConcertLayout";
import {
  EVENT_DETAILS,
  SOCIAL_LINKS,
  CONCERT_THEME,
  POST_EVENT,
} from "../config/event";
import { getTicketPrice } from "../utils/pricing";
import {
  getEventMode,
  EVENT_MODE,
  isBookingOpen,
  isSoldOut,
  isEventOver,
} from "../utils/eventStateUtils";

// ─── Social Icons ─────────────────────────────────────────────
const InstagramIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const TwitterIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ─── Static Data ──────────────────────────────────────────────
const STAGES = [
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

const FEATURES = [
  {
    icon: <Heart className="w-7 h-7" />,
    title: "Storytelling",
    desc: "A narrative-driven performance that unfolds like the pages of a cherished diary.",
  },
  {
    icon: <Mic2 className="w-7 h-7" />,
    title: "Live Vocals",
    desc: "Raw, unfiltered vocal performances that strip away everything but pure emotion.",
  },
  {
    icon: <Film className="w-7 h-7" />,
    title: "Cinematic Visuals",
    desc: "Immersive projection mapping and lighting design that transports you into the story.",
  },
  {
    icon: <Music className="w-7 h-7" />,
    title: "Orchestral Arrangements",
    desc: "A fusion of acoustic warmth and electronic textures, scored for the soul.",
  },
];

const ARTISTS = [
  {
    name: "Sanam",
    role: "Vocalist",
    image: "/artists/sanam.png",
    bio: "A passionate vocalist bringing emotion, energy, and soulful melodies to every performance.",
    socials: {
      instagram: "https://instagram.com/sanam_musician",
      twitter: "https://twitter.com/...",
      youtube: "https://youtube.com/...",
    },
  },
  {
    name: "Rahul",
    role: "Pianist",
    image: "/artists/rahul.png",
    bio: "Creating expressive piano melodies that add warmth and depth to the music.",
    socials: {
      instagram: "https://instagram.com/rahultejwani94",
      twitter: "https://twitter.com/...",
      youtube: "https://youtube.com/...",
    },
  },
];

// ─── Derived at module level (no re-computation per render) ───
const eventMode = getEventMode();
const homepagePricing = getTicketPrice(1, EVENT_DETAILS.pricing);

// ─── Countdown Timer ──────────────────────────────────────────
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
        });
      }
    };
    calc();
    const t = setInterval(calc, 60_000); // minutes precision is enough
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className="flex gap-5 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <span className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-white/40 uppercase tracking-wider mt-1 block">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Hero CTA — changes with event state ──────────────────────
function HeroCTA() {
  if (eventMode === EVENT_MODE.LIVE) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center mt-2">
        <a
          href="/booking"
          className={`group px-10 py-4 w-full sm:w-auto bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-bold tracking-wider uppercase text-sm rounded-full transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
        >
          <span className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Book Tickets — From ₹{homepagePricing.pricePerTicket}
          </span>
        </a>
        <a
          href="#stages"
          className="group flex items-center gap-2 px-7 py-3.5 bg-white/[0.03] border border-white/10 hover:border-white/40 rounded-full text-white/70 hover:text-white transition-all text-sm tracking-widest uppercase font-medium backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          Explore Stages{" "}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    );
  }

  if (eventMode === EVENT_MODE.SOLD_OUT) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
        <a
          href="/sold-out"
          className="px-10 py-4 bg-white/5 border border-white/20 text-white/60 font-bold tracking-wider uppercase text-sm rounded-full cursor-not-allowed"
        >
          Tickets Sold Out
        </a>
        <a
          href="#stages"
          className="group flex items-center gap-2 px-7 py-3.5 bg-white/[0.03] border border-white/10 hover:border-white/40 rounded-full text-white/70 hover:text-white transition-all text-sm tracking-widest uppercase font-medium backdrop-blur-xl"
        >
          Explore Stages{" "}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    );
  }

  if (eventMode === EVENT_MODE.PAUSED) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
        <div className="px-10 py-4 bg-white/5 border border-yellow-400/20 text-yellow-300/70 font-bold tracking-wider uppercase text-sm rounded-full">
          Booking Temporarily Paused
        </div>
        <a
          href="#stages"
          className="group flex items-center gap-2 px-7 py-3.5 bg-white/[0.03] border border-white/10 hover:border-white/40 rounded-full text-white/70 hover:text-white transition-all text-sm tracking-widest uppercase font-medium backdrop-blur-xl"
        >
          Explore Stages{" "}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    );
  }

  // ENDED — show post-event CTA from config
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
      <a
        href={POST_EVENT.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`group px-10 py-4 bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-bold tracking-wider uppercase text-sm rounded-full transition-all hover:scale-105 hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
      >
        <span className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          {POST_EVENT.ctaLabel}
        </span>
      </a>
      <a
        href="#stages"
        className="group flex items-center gap-2 px-7 py-3.5 bg-white/[0.03] border border-white/10 hover:border-white/40 rounded-full text-white/70 hover:text-white transition-all text-sm tracking-widest uppercase font-medium backdrop-blur-xl"
      >
        Explore Stages{" "}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}

// ─── Urgency / status badge in hero ──────────────────────────
function HeroStatusBadge() {
  if (eventMode === EVENT_MODE.LIVE) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-pink-400/20 rounded-full text-sm backdrop-blur-xl">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-pink-100/80 font-medium tracking-wide">
          Limited seats available — Book now
        </span>
      </div>
    );
  }
  if (eventMode === EVENT_MODE.SOLD_OUT) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-red-400/20 rounded-full text-sm backdrop-blur-xl">
        <span className="text-red-300 font-medium tracking-wide">
          All tickets sold out
        </span>
      </div>
    );
  }
  if (eventMode === EVENT_MODE.PAUSED) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-yellow-400/20 rounded-full text-sm backdrop-blur-xl">
        <span className="text-yellow-200/80 font-medium tracking-wide">
          Booking temporarily paused
        </span>
      </div>
    );
  }
  // ENDED
  return (
    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] border border-purple-400/20 rounded-full text-sm backdrop-blur-xl">
      <span className="text-purple-200/80 font-medium tracking-wide">
        {POST_EVENT.badge}
      </span>
    </div>
  );
}

// ─── Tickets section CTA ──────────────────────────────────────
function TicketsSectionCTA() {
  if (eventMode === EVENT_MODE.LIVE) {
    return (
      <>
        <a
          href="/booking"
          className={`inline-flex whitespace-nowrap items-center gap-2 px-10 py-4 bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-bold tracking-wider uppercase text-sm rounded-full hover:shadow-[0_10px_40px_rgba(236,72,153,0.45)] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
        >
          <Ticket className="w-5 h-5" />
          Book Your Tickets
        </a>
        <p className="mt-5 text-white/40 text-sm tracking-wider flex flex-wrap justify-center gap-1">
          <span>
            Starting from{" "}
            <span className="text-white font-semibold">
              ₹{homepagePricing.pricePerTicket}
            </span>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="whitespace-nowrap">
            {homepagePricing.pricingLabel} Pricing
          </span>
        </p>
      </>
    );
  }

  if (eventMode === EVENT_MODE.SOLD_OUT) {
    return (
      <>
        <a
          href="/sold-out"
          className="inline-flex items-center gap-2 px-10 py-4 bg-white/5 border border-white/20 text-white/50 font-bold tracking-wider uppercase text-sm rounded-full"
        >
          <Ticket className="w-5 h-5" />
          Tickets Sold Out
        </a>
        <p className="mt-5 text-white/30 text-sm">
          Follow us on Instagram for future shows.
        </p>
      </>
    );
  }

  if (eventMode === EVENT_MODE.PAUSED) {
    return (
      <p className="text-yellow-300/70 font-semibold tracking-wider uppercase text-sm border border-yellow-400/20 px-8 py-4 rounded-full">
        Booking Temporarily Paused — Check Back Soon
      </p>
    );
  }

  // ENDED
  return (
    <>
      <a
        href={POST_EVENT.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex whitespace-nowrap items-center gap-2 px-10 py-4 bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-bold tracking-wider uppercase text-sm rounded-full hover:shadow-[0_10px_40px_rgba(236,72,153,0.45)] hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
      >
        <ExternalLink className="w-5 h-5" />
        {POST_EVENT.ctaLabel}
      </a>
      <p className="mt-5 text-white/30 text-sm">{POST_EVENT.badge}</p>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function TheNotebookConcert() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  // Higher damping = less overshoot on mobile fast-scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  // clamp: true prevents spring overshoot going negative on mobile Safari/Chrome
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0], {
    clamp: true,
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  return (
    <ConcertLayout>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5"
        role="navigation"
        aria-label="Main navigation"
      >
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
        >
          <img
            src="/logo.png"
            alt=""
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            aria-hidden="true"
          />
          <span className="text-lg font-bold tracking-tighter hidden sm:block">
            THE NOTEBOOK CONCERT
          </span>
        </motion.a>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex gap-8 text-sm tracking-widest uppercase font-medium items-center"
        >
          <a href="#stages" className="hover:text-purple-300 transition-colors">
            Stages
          </a>
          <a
            href="#artists"
            className="hover:text-purple-300 transition-colors"
          >
            Artists
          </a>
          <a
            href="#experience"
            className="hover:text-purple-300 transition-colors"
          >
            Experience
          </a>
          <a
            href="#tickets"
            className="hover:text-purple-300 transition-colors"
          >
            Tickets
          </a>

          {/* Download Ticket — hidden after event ends */}
          {!isEventOver && (
            <a
              href="/download-ticket"
              className="hover:text-purple-300 transition-colors"
            >
              Download Ticket
            </a>
          )}

          {/* Book Now — only when live */}
          {isBookingOpen && (
            <a
              href="/booking"
              className={`px-5 py-2 bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} rounded-full text-xs font-bold tracking-wider hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] hover:scale-105 transition-all`}
            >
              Book Now
            </a>
          )}
        </motion.div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {["stages", "artists", "experience", "tickets"].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold tracking-wider hover:text-purple-300 transition-colors capitalize"
              >
                {id}
              </a>
            ))}
            {!isEventOver && (
              <a
                href="/download-ticket"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-bold tracking-wider hover:text-purple-300 transition-colors"
              >
                Download Ticket
              </a>
            )}
            {isBookingOpen && (
              <a
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className={`mt-4 px-8 py-3 bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} rounded-full text-sm font-bold tracking-wider`}
              >
                Book Now
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Hero ── */}
      <section
        id="main-content"
        className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden"
      >
        <motion.div
          style={{ y: backgroundY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt=""
            className="w-full h-full object-cover opacity-40 scale-110"
            loading="eager"
            fetchPriority="high"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#090914]/75 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_55%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
        </motion.div>

        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-3xl z-0"
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
              <motion.img
                src="/logo.png"
                alt="The Notebook Concert"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-16 h-16 md:w-20 md:h-20 object-contain opacity-90"
              />
            </div>
            <p className="mt-4 text-white/70 text-xs md:text-sm tracking-[0.35em] uppercase font-semibold">
              The Notebook Concert
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-purple-200/80 text-xs md:text-sm tracking-[0.35em] uppercase mb-5 font-medium">
              Presents
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-[-0.05em] leading-[0.9] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
              {CONCERT_THEME.title}
              <br />
              {CONCERT_THEME.subtitle}
            </h1>
            <p className="text-lg md:text-2xl text-white/55 font-light tracking-wide max-w-2xl mx-auto leading-relaxed mb-10">
              {CONCERT_THEME.description}
            </p>

            {/* Event detail badges — hidden after event ends */}
            {!isEventOver && (
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-white/80">{EVENT_DETAILS.dates}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span className="text-white/80">{EVENT_DETAILS.venue}</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80">{EVENT_DETAILS.time}</span>
                </div>
              </div>
            )}

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <HeroStatusBadge />
            </motion.div>
          </motion.div>

          {/* Countdown — hidden after event ends */}
          {!isEventOver && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200/80 text-xs tracking-[0.25em] uppercase">
                  Event Starts In
                </span>
              </div>
              <CountdownTimer targetDate={EVENT_DETAILS.eventDateTimeStart} />
            </motion.div>
          )}

          {/* CTA buttons — plain div, no scroll-sensitive animation so it never disappears on re-scroll */}
          <div className="relative z-20 mt-2">
            <HeroCTA />
          </div>
        </div>
      </section>

      {/* ── 2. Stages ── */}
      <section id="stages" className="relative py-28 md:py-36 px-6">
        <SectionHeading subtitle="The Journey">7 Stages of Love</SectionHeading>
        <div className="max-w-6xl mx-auto flex flex-col gap-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {STAGES.slice(0, 4).map((stage, index) => (
              <StageCard key={stage.title} stage={stage} index={index} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:max-w-4xl mx-auto w-full">
            {STAGES.slice(4).map((stage, index) => (
              <StageCard key={stage.title} stage={stage} index={index + 4} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Artists ── */}
      <section id="artists" className="relative py-28 md:py-36 px-6">
        <SectionHeading subtitle="The Voices">Featured Artists</SectionHeading>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {ARTISTS.map((artist, index) => (
            <ArtistCard key={artist.name} artist={artist} index={index} />
          ))}
        </div>
      </section>

      {/* ── 4. Experience ── */}
      <section id="experience" className="relative py-28 md:py-36 px-6">
        <SectionHeading subtitle="What Awaits">Live Experience</SectionHeading>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <GlassCard className="p-6 h-full">
                <div
                  className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 text-purple-300"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. Tickets CTA ── */}
      <section id="tickets" className="relative py-28 md:py-36 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard
              hover={false}
              className="p-10 md:p-14 mt-10 border-purple-400/20 bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden md:flex">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.35)]`}
                >
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>

              <p className="text-purple-300 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
                {isEventOver ? "Thank You" : "Limited Availability"}
              </p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-balance">
                {isEventOver ? "See You Next Time" : "Be Part of the Story"}
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                {isEventOver
                  ? "The Notebook Concert was an unforgettable evening. Stay tuned for future shows."
                  : "Join us for an unforgettable evening where music meets memory."}
              </p>

              {/* hide date/venue/time row when event is over */}
              {!isEventOver && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>{EVENT_DETAILS.dates}</span>
                  </div>
                  <span className="hidden sm:block text-white/20">|</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    <span>{EVENT_DETAILS.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{EVENT_DETAILS.time}</span>
                  </div>
                </div>
              )}

              <TicketsSectionCTA />
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative py-12 px-6 border-t border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <a
            href="/"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
          >
            <img
              src="/logo.png"
              alt=""
              className="w-8 h-8 object-contain opacity-60"
              aria-hidden="true"
            />
            <span className="text-lg font-bold tracking-tight text-white/70">
              THE NOTEBOOK CONCERT
            </span>
          </a>
          <div className="flex gap-6">
            {[
              {
                href: SOCIAL_LINKS.instagram,
                icon: <InstagramIcon className="w-3 h-3" />,
                label: "Instagram",
              },
              {
                href: SOCIAL_LINKS.twitter,
                icon: <TwitterIcon className="w-3 h-3" />,
                label: "Twitter",
              },
              {
                href: SOCIAL_LINKS.youtube,
                icon: <YoutubeIcon className="w-3 h-3" />,
                label: "YouTube",
              },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/25 hover:text-purple-300 text-xs tracking-widest uppercase transition-colors flex items-center gap-1.5"
                aria-label={`Follow us on ${label}`}
              >
                {icon} {label}
              </a>
            ))}
          </div>
          <div className="text-white/20 text-xs tracking-[0.2em] uppercase">
            Crafted with music & memory.
          </div>
        </div>
      </footer>
    </ConcertLayout>
  );
}

// ─── Stage Card ───────────────────────────────────────────────
function StageCard({ stage, index }) {
  const isLater = index >= 4;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
      className="flex"
    >
      <GlassCard className="relative overflow-hidden flex flex-col items-center justify-start w-full h-full min-h-[260px] group border border-white/10 bg-black/20">
        <img
          src={stage.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/65" />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${isLater ? "from-pink-500/10" : "from-purple-500/10"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        <div className="relative z-10 flex flex-col h-full items-center p-8">
          <span
            className={`text-4xl font-black mb-3 transition-all duration-500 block ${isLater ? "text-pink-400/40 group-hover:text-pink-400" : "text-purple-400/40 group-hover:text-purple-400"}`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
            {stage.title}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed mt-4">
            {stage.desc}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

// ─── Artist Card ──────────────────────────────────────────────
function ArtistCard({ artist, index }) {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="group"
    >
      <GlassCard className="overflow-hidden">
        <div className="relative h-72 overflow-hidden">
          {!imgError ? (
            <img
              src={artist.image}
              alt={`${artist.name} - ${artist.role}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/60 via-[#0b0b1a] to-pink-900/40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-purple-400/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-300">
                    {artist.name[0]}
                  </span>
                </div>
                <p className="text-white/40 text-sm">Photo coming soon</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute top-4 right-4 backdrop-blur-md bg-purple-600/30 border border-purple-400/30 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase font-medium">
            {artist.role}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">
            {artist.name}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">{artist.bio}</p>
          <div className="flex gap-3 mt-4">
            {[
              {
                href: artist.socials.instagram,
                Icon: InstagramIcon,
                label: "Instagram",
              },
              {
                href: artist.socials.twitter,
                Icon: TwitterIcon,
                label: "Twitter",
              },
              {
                href: artist.socials.youtube,
                Icon: YoutubeIcon,
                label: "YouTube",
              },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-purple-600/50 flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-label={`${artist.name} on ${label}`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}
