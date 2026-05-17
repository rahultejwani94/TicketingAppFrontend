"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Ticket } from "lucide-react";
import ConcertLayout from "./ConcertLayout";
import { CONCERT_THEME } from "../config/api";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <ConcertLayout>
      <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full top-[-20%] left-[-10%]" />
          <div className="absolute w-[400px] h-[400px] bg-pink-500/10 blur-[100px] rounded-full bottom-[-10%] right-[-5%]" />
        </div>

        <div className="relative z-10 text-center max-w-lg w-full">

          {/* Big 404 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mb-6 select-none"
          >
            <span className="text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/[0.03]">
              404
            </span>
            {/* Overlaid readable 404 */}
            <span className="absolute inset-0 flex items-center justify-center text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-purple-400/60 via-pink-400/40 to-transparent blur-[1px]">
              404
            </span>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-purple-300 text-xs tracking-[0.35em] uppercase mb-3 font-medium">
              Lost in the story
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              This page doesn't exist
            </h1>
            <p className="text-white/40 text-sm leading-relaxed mb-10">
              The page you're looking for may have been moved, deleted,<br className="hidden sm:block" />
              or perhaps it was never part of this chapter.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => navigate("/")}
              className={`flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} text-white font-bold text-sm tracking-wider hover:scale-105 hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>

            <button
              onClick={() => navigate("/booking")}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <Ticket className="w-4 h-4" />
              Book Tickets
            </button>
          </motion.div>

        </div>
      </div>
    </ConcertLayout>
  );
}
