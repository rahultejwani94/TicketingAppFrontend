"use client";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  SearchX,
} from "lucide-react";
import ConcertLayout, { GlassCard, SectionHeading, PageNav } from "./ConcertLayout";
import SEO from "../components/SEO";
import { getPastEventBySlug } from "../config/pastEvents";

// Accepts watch / share / already-embed YouTube URLs and returns an
// embeddable URL, or null if it doesn't look like a YouTube link.
function getYoutubeEmbed(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  if (!url) return null;

  try {
    // Tolerate links pasted without "https://"
    const withProtocol = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(withProtocol);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId
        ? { embedUrl: `https://www.youtube.com/embed/${videoId}`, isShort: false }
        : null;
    }

    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return { embedUrl: withProtocol, isShort: false };
      }

      // Shorts links: youtube.com/shorts/<id> — these are vertical (9:16)
      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.split("/")[2];
        return videoId
          ? { embedUrl: `https://www.youtube.com/embed/${videoId}`, isShort: true }
          : null;
      }

      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return { embedUrl: `https://www.youtube.com/embed/${videoId}`, isShort: false };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function PastEventDetail() {
  const { slug } = useParams();
  const event = getPastEventBySlug(slug);

  if (!event) return <EventNotFound slug={slug} />;

  const videoEmbed = getYoutubeEmbed(event.videoUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${event.title} – ${event.subtitle}`,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: "IN",
      },
    },
    image: event.coverImage,
    description: event.shortDescription,
    performer: event.artists?.map((artist) => ({
      "@type": "Person",
      name: artist.name,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://thenotebookconcert.in/" },
      { "@type": "ListItem", position: 2, name: "Past Events", item: "https://thenotebookconcert.in/past-events" },
      { "@type": "ListItem", position: 3, name: event.title, item: `https://thenotebookconcert.in/past-events/${event.slug}` },
    ],
  };

  return (
    <ConcertLayout>
      <SEO
        title={`${event.title} — ${event.subtitle}`}
        description={event.shortDescription}
        path={`/past-events/${event.slug}`}
        image={event.coverImage}
        type="article"
        jsonLd={[jsonLd, breadcrumbJsonLd]}
      />

      <PageNav backTo="/past-events" backLabel="All Past Events" />

      {/* Breadcrumb (visual) */}
      <nav aria-label="Breadcrumb" className="px-6 max-w-5xl mx-auto pt-28 md:pt-32 text-xs text-white/35">
        <ol className="flex items-center gap-2 flex-wrap">
          <li><Link to="/" className="hover:text-white/70">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/past-events" className="hover:text-white/70">Past Events</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-white/60">{event.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-8 pb-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden h-72 md:h-96 mb-6"
        >
          <img
            src={event.coverImage}
            alt={`${event.title} — ${event.subtitle}`}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="mb-8">
          <p className="text-purple-300 text-xs tracking-[0.3em] uppercase mb-2 font-medium">
            {event.subtitle}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            {event.title}
          </h1>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-4 mb-8 text-sm">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-white/80">{event.displayDate}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="text-white/80">{event.venue}, {event.city}</span>
          </div>
          {event.attendeeCount && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-full backdrop-blur-xl">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-white/80">{event.attendeeCount} attendees</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-purple-600/15 border border-purple-400/20 text-purple-200/80 text-xs tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-3xl">
          {event.description}
        </p>

        {/* Highlights */}
        {event.highlights?.length > 0 && (
          <div className="mb-16">
            <SectionHeading subtitle="Recap">Highlights</SectionHeading>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {event.highlights.map((highlight) => (
                <GlassCard key={highlight} className="p-5 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
                  <span className="text-white/70 text-sm leading-relaxed">{highlight}</span>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* Artists */}
        {event.artists?.length > 0 && (
          <div className="mb-16">
            <SectionHeading subtitle="On Stage">Featuring</SectionHeading>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {event.artists.map((artist) => (
                <FeaturedArtist key={artist.name} artist={artist} />
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {event.gallery?.length > 0 && (
          <div className="mb-16">
            <SectionHeading subtitle="Moments">Gallery</SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.gallery.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <img
                    src={src}
                    alt={`${event.title} — gallery photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-40 md:h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {videoEmbed && (
          <div className="mb-16">
            <SectionHeading subtitle="Watch">Event Recap</SectionHeading>
            <div
              className={`relative mx-auto rounded-2xl overflow-hidden ${
                videoEmbed.isShort
                  ? "w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16]"
                  : "w-full max-w-3xl aspect-video"
              }`}
            >
              <iframe
                src={videoEmbed.embedUrl}
                title={`${event.title} recap video`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-6 border-t border-white/5">
          <p className="text-white/40 text-sm mb-5">
            Want to be at the next one?
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold tracking-wider uppercase text-sm rounded-full hover:scale-105 hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            See What's Coming Up
          </Link>
        </div>
      </section>
    </ConcertLayout>
  );
}

function FeaturedArtist({ artist }) {
  const [imgError, setImgError] = useState(false);
  const showPhoto = artist.image && !imgError;

  return (
    <div className="flex flex-col items-center gap-4 w-36 md:w-40">
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_8px_24px_rgba(168,85,247,0.15)]">
        {showPhoto ? (
          <img
            src={artist.image}
            alt={`${artist.name} — ${artist.role}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/60 via-[#0b0b1a] to-pink-900/40">
            <span className="text-4xl font-bold text-purple-300">
              {artist.name[0]}
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-white/90 font-semibold text-base">{artist.name}</p>
        {artist.role && (
          <p className="text-purple-300/70 text-xs uppercase tracking-wide mt-0.5">
            {artist.role}
          </p>
        )}
      </div>
    </div>
  );
}

function EventNotFound({ slug }) {
  return (
    <ConcertLayout>
      <SEO
        title="Event Not Found"
        description="This past event recap couldn't be found."
        path={`/past-events/${slug || ""}`}
        noindex
      />
      <PageNav backTo="/past-events" backLabel="All Past Events" />
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <SearchX className="w-7 h-7 text-pink-300/70" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-white/40 text-sm mb-8">
            We couldn't find a recap for this event. It may have been moved or doesn't exist.
          </p>
          <Link
            to="/past-events"
            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition text-sm font-medium"
          >
            Browse Past Events
          </Link>
        </div>
      </div>
    </ConcertLayout>
  );
}
