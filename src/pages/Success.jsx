"use client";

import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import {
  Download,
  Ticket,
  Share2,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Copy,
  Calendar,
  MapPin,
  Music,
  ChevronRight,
} from "lucide-react";
import API_BASE_URL from "../config/api";
import { EVENT_DETAILS, CONCERT_THEME } from "../config/event";
import ConcertLayout from "./ConcertLayout";
import toast from "react-hot-toast";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  // Core fetch→blob→anchor download — works on iOS Safari, Android, desktop.
  // iOS Safari ignores window.location.href for PDFs (opens in browser instead).
  // The blob URL + programmatic click is the only reliable cross-platform approach.
  const triggerDownload = useCallback(async (bookingId) => {
    const response = await fetch(
      `${API_BASE_URL}/api/bookings/download/${bookingId}`,
    );
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    // Force octet-stream so iOS treats it as a file download, not inline navigation
    const pdfBlob = new Blob([blob], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `The_Notebook_Concert_Ticket_${bookingId}.pdf`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    // Small delay before cleanup so iOS has time to register the download
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 300);
  }, []);

  const downloadTicket = useCallback(async () => {
    if (!state?.bookingId || isDownloading) return;
    try {
      setIsDownloading(true);
      await triggerDownload(state.bookingId);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }, [state?.bookingId, isDownloading, triggerDownload]);

  // Auto-download on first load only — uses blob approach, NOT window.location.href
  // which opens the PDF inline on iOS Safari instead of downloading it.
  useEffect(() => {
    if (!state?.bookingId) return;
    const key = `ticketDownloaded-${state.bookingId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "true");
    triggerDownload(state.bookingId).catch((err) => {
      console.error("Auto-download failed:", err);
      // Silent fail — user can still tap the Download button manually
    });
  }, [state?.bookingId, triggerDownload]);

  // Persist booking to localStorage
  useEffect(() => {
    if (!state?.bookingId) return;
    try {
      const prev = JSON.parse(localStorage.getItem("recentBookings") || "[]");
      const updated = [
        {
          id: state.bookingId,
          name: state.name,
          qty: state.qty,
          date: new Date().toISOString(),
        },
        ...prev.filter((b) => b.id !== state.bookingId),
      ].slice(0, 5);
      localStorage.setItem("recentBookings", JSON.stringify(updated));
    } catch {}
  }, [state]);

  // ── Empty state ───────────────────────────────────────────────
  if (!state) {
    return (
      <ConcertLayout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <img
              src="/logo.png"
              alt=""
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              aria-hidden="true"
            />
            <p className="text-white/50 mb-4">No booking data found</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/booking")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-bold tracking-wider"
              >
                Book Tickets
              </button>
              <a
                href="/"
                className="text-sm text-purple-300 hover:text-white transition"
              >
                Explore the event
              </a>
            </div>
          </div>
        </div>
      </ConcertLayout>
    );
  }

  // ── WhatsApp share ────────────────────────────────────────────
  const message =
    `*${EVENT_DETAILS.name}* 🎉\n` +
    `${EVENT_DETAILS.tagline}\n\n` +
    `*Booking Confirmed!*\n\n` +
    `Name: ${state.name}\n` +
    `Tickets: ${state.qty}\n` +
    `Booking ID: ${state.bookingId}\n\n` +
    `*Download your tickets:*\n` +
    `${state.pdfUrl}`;

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodeURIComponent(message)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  const copyBookingId = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(state.bookingId);
      } else {
        const ta = document.createElement("textarea");
        ta.value = state.bookingId;
        ta.style.cssText = "position:fixed;left:-9999px;top:-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast.success("Booking ID copied", { icon: "✨" });
    } catch {
      toast.error("Copy failed");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
  };
  const item = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  return (
    <ConcertLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-md w-full space-y-4"
        >
          {/* ── Main confirmation card ── */}
          <div className="bg-white/[0.07] border border-white/20 p-8 rounded-2xl backdrop-blur-lg shadow-[0_8px_40px_rgba(168,85,247,0.15)]">
            {/* Header */}
            <div className="text-center mb-7">
              <motion.div
                className="flex justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, delay: 0.15 }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.35)]">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold text-green-400 mb-1">
                Booking Confirmed!
              </h1>
              <p className="text-white/60 text-sm">
                Your tickets have been generated
              </p>
            </div>

            {/* Booking details */}
            <motion.div
              className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-3 text-sm mb-6"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: "Name", value: state.name },
                { label: "Email", value: state.email, truncate: true },
                { label: "Phone", value: state.phone },
                { label: "Tickets", value: state.qty, highlight: true },
              ].map(({ label, value, truncate, highlight }) => (
                <motion.div
                  key={label}
                  className="flex justify-between items-center gap-3"
                  variants={item}
                >
                  <span className="text-white/50">{label}</span>
                  <span
                    className={`font-medium text-right break-all ${highlight ? "text-purple-300 font-bold" : "text-white"} ${truncate ? "truncate max-w-[180px]" : ""}`}
                  >
                    {value}
                  </span>
                </motion.div>
              ))}

              {/* Booking ID */}
              <motion.div
                className="border-t border-white/10 pt-3"
                variants={item}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/50 shrink-0">Booking ID</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-green-400 text-xs truncate">
                      {state.bookingId}
                    </span>
                    <button
                      onClick={copyBookingId}
                      className="shrink-0 p-1.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 transition"
                      title="Copy Booking ID"
                    >
                      <Copy className="w-3.5 h-3.5 text-white/60" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Total */}
              <motion.div
                className="flex justify-between items-center border-t border-white/10 pt-3"
                variants={item}
              >
                <span className="text-white/50">Total Paid</span>
                <span className="font-bold text-white text-base">
                  ₹{state.total}
                </span>
              </motion.div>

              {/* UTR */}
              {!state.isAdmin && state.utr && (
                <motion.div
                  className="flex justify-between items-center"
                  variants={item}
                >
                  <span className="text-white/50">UTR</span>
                  <span className="font-mono text-white/80 text-xs">
                    {state.utr}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Download nudge */}
            <motion.div
              className="mb-6 flex items-start gap-3 p-3.5 bg-yellow-500/10 border border-yellow-400/25 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Ticket className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-xs text-yellow-200/90 leading-relaxed">
                  {isDownloading
                    ? "Downloading your ticket…"
                    : "Your ticket download has started. If it didn't, tap the button below."}
                </p>

                {/* Email status */}
                {state.emailSent ? (
                  <p className="text-xs text-white/60">
                    📧 Ticket also sent to{" "}
                    <span className="text-white/80 font-medium">
                      {state.email}
                    </span>
                    — check spam if not received.
                  </p>
                ) : (
                  <p className="text-xs text-orange-300/80">
                    📧 Email could not be sent — please download your ticket
                    below and keep it safe.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {/* Primary */}
              <button
                onClick={downloadTicket}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(34,197,94,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Downloading…
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Ticket PDF
                  </>
                )}
              </button>

              {/* Secondary */}
              <button
                onClick={() =>
                  isMobile
                    ? (window.location.href = whatsappUrl)
                    : window.open(whatsappUrl, "_blank")
                }
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/8 border border-white/15 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/12 transition text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <Share2 className="w-4 h-4" />
                Share on WhatsApp
              </button>

              {/* Tertiary */}
              <button
                onClick={() => navigate("/booking")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white/40 hover:text-white/70 transition text-sm focus:outline-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Book More Tickets
              </button>
            </motion.div>

            {/* ── Compact event strip ── */}
            <a
              href="/"
              className="mt-6 flex items-center justify-between gap-3 p-3.5 rounded-xl border border-white/10 hover:border-purple-400/25 hover:bg-white/5 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${CONCERT_THEME.colors.primary} ${CONCERT_THEME.colors.secondary} flex items-center justify-center shrink-0`}
                >
                  <Music className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-xs font-semibold truncate">
                    {EVENT_DETAILS.name}
                  </p>
                  <div className="flex items-center gap-2 text-white/40 text-xs mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      {EVENT_DETAILS.dates}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      {EVENT_DETAILS.venue}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>

            <p className="mt-4 text-center text-xs text-white/30 leading-relaxed">
              Keep your{" "}
              <span className="text-purple-300/70 font-medium">Booking ID</span>{" "}
              safe — you'll need it to download your ticket later.
            </p>
          </div>
        </motion.div>
      </div>
    </ConcertLayout>
  );
}
