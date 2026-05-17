"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, TicketX, Home, Bell } from "lucide-react";
import { CONCERT_THEME, EVENT_DETAILS, SOCIAL_LINKS } from "../config/api";

export default function SoldOutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-3xl rounded-full top-[-10%] left-[-10%]" />
        <div className="absolute w-[400px] h-[400px] bg-pink-500/10 blur-3xl rounded-full bottom-[-10%] right-[-10%]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <TicketX className="w-10 h-10 text-pink-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
          Tickets Sold Out
        </h1>

        <p className="text-white/60 text-lg mb-8 leading-relaxed">
          All seats for{" "}
          <span className="text-purple-300 font-semibold">
            {CONCERT_THEME.title} {CONCERT_THEME.subtitle}
          </span>{" "}
          are currently booked. We understand the disappointment — this one
          filled up fast.
        </p>

        {/* Event Info Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-xl">
          <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{EVENT_DETAILS.dates}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>{EVENT_DETAILS.venue}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{EVENT_DETAILS.time}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <a
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </a>

          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            className={`w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-semibold hover:scale-105 transition flex items-center justify-center gap-2`}
          >
            <Bell className="w-4 h-4" />
            Follow for Updates
          </a>
        </div>

        {/* Footer note */}
        <p className="text-white/30 text-xs mt-8 tracking-widest uppercase">
          More shows coming soon
        </p>
      </motion.div>
    </div>
  );
}
