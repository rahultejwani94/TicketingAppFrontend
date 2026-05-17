"use client";

import { motion } from "framer-motion";

// Shared noise texture - self-hosted version for reliability
const NOISE_TEXTURE = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E";

export default function ConcertLayout({ children, showBackground = true }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-[#0b0b1a] to-black text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Background */}
      {showBackground && (
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }}
          />
        </div>
      )}
      
      {/* Main Content */}
      <main role="main" className="relative z-10">
        {children}
      </main>
      
      {/* Bottom accent line */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 z-50 opacity-40" 
        aria-hidden="true"
      />
    </div>
  );
}

// Reusable Glass Card component
export function GlassCard({ children, className = "", hover = true }) {
  return (
    <div 
      className={`
        backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl 
        ${hover ? 'hover:border-purple-400/30 hover:bg-white/10' : ''} 
        transition-all duration-500 
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Section heading component
export function SectionHeading({ children, subtitle }) {
  return (
    <div className="text-center mb-16">
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-purple-300 text-sm tracking-[0.3em] uppercase mb-4 font-medium"
      >
        {subtitle}
      </motion.p>
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight text-balance"
      >
        {children}
      </motion.h2>
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-8"
        aria-hidden="true"
      />
    </div>
  );
}