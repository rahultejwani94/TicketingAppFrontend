"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Fullscreen image viewer. Pass the full list of images plus the
 * index to show (or null to keep it closed) — works for a single
 * image or a gallery with prev/next navigation.
 *
 * <Lightbox
 *   images={event.gallery}
 *   index={lightboxIndex}        // null when closed
 *   onClose={() => setLightboxIndex(null)}
 *   onIndexChange={setLightboxIndex}
 *   altPrefix={event.title}
 * />
 */
export default function Lightbox({ images, index, onClose, onIndexChange, altPrefix = "Photo" }) {
  const total = images.length;
  const isOpen = index !== null && index !== undefined && index >= 0;

  const goTo = useCallback(
    (newIndex) => {
      if (total <= 1) return;
      onIndexChange(((newIndex % total) + total) % total);
    },
    [total, onIndexChange]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, index, goTo, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center px-3 sm:px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={onClose}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-8 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>

          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(index - 1);
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            src={images[index]}
            alt={`${altPrefix} — photo ${index + 1} of ${total}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          />

          {total > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(index + 1);
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {total > 1 && (
            <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase">
              {index + 1} / {total}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
