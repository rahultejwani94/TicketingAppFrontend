"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Users, Archive } from "lucide-react";
import ConcertLayout, { GlassCard, SectionHeading, PageNav } from "./ConcertLayout";
import SEO from "../components/SEO";
import { getPastEventsSorted } from "../config/pastEvents";

const pastEvents = getPastEventsSorted();

export default function PastEvents() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Past Events — The Notebook Concert",
    itemListElement: pastEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://thenotebookconcert.in/past-events/${event.slug}`,
      name: event.title,
    })),
  };

  return (
    <ConcertLayout>
      <SEO
        title="Past Events"
        description="A look back at the shows The Notebook Concert has hosted — recaps, photos, and highlights from every past performance."
        path="/past-events"
        jsonLd={jsonLd}
      />

      <PageNav backTo="/" backLabel="Back to Home" />

      <div className="min-h-screen px-6 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <SectionHeading subtitle="The Story So Far">
            Past Events
          </SectionHeading>

          {pastEvents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-wrap justify-center gap-7 pb-20">
              {pastEvents.map((event, index) => (
                <PastEventCard key={event.slug} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ConcertLayout>
  );
}

function PastEventCard({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.08, duration: 0.5 }}
      className="w-full sm:w-[calc(50%-14px)] lg:w-[360px]"
    >
      <Link
        to={`/past-events/${event.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl"
      >
        <GlassCard className="overflow-hidden h-full flex flex-col group">
          <div className="relative h-48 overflow-hidden bg-black/40">
            <img
              src={event.coverImage}
              alt={`${event.title} — ${event.subtitle}`}
              loading="lazy"
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="absolute top-3 left-3 backdrop-blur-md bg-black/40 border border-white/10 rounded-full px-3 py-1 text-xs tracking-wide text-white/80">
              {event.displayDate}
            </div>
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-xl font-bold mb-1 group-hover:text-purple-300 transition-colors">
              {event.title}
            </h3>
            <p className="text-purple-300/80 text-sm mb-4">{event.subtitle}</p>

            <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
              {event.shortDescription}
            </p>

            <div className="flex flex-col gap-1.5 text-xs text-white/40 mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-pink-400" />
                <span>{event.venue}, {event.city}</span>
              </div>
              {event.attendeeCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{event.attendeeCount} attendees</span>
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 group-hover:text-white transition-colors mt-auto">
              View Recap
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Archive className="w-7 h-7 text-purple-300/70" />
      </div>
      <h3 className="text-xl font-bold mb-2">No past events yet</h3>
      <p className="text-white/40 text-sm max-w-sm mb-6">
        Once a show wraps up, its recap will appear here. Check back soon.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition text-sm font-medium"
      >
        Explore Upcoming Shows
      </Link>
    </div>
  );
}
