import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import API_BASE_URL from "../config/api";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // AUTO DOWNLOAD PDF
  useEffect(() => {
    if (state?.bookingId) {
      window.location.href = `${API_BASE_URL}/api/bookings/download/${state.bookingId}`; // Trigger download
    }
  }, [state?.bookingId]);

  if (!state) return <div className="text-white p-10">No data</div>;

  const message =
    "THE NOTEBOOK CONCERT 🎉\n\n" +
    "Booking Confirmed!\n\n" +
    `Name: ${state.name}\n` +
    `Tickets: ${state.qty}\n` +
    `Booking ID: ${state.bookingId}\n\n` +
    "Download your tickets here:\n" +
    `${API_BASE_URL}/api/bookings/download/${state.bookingId}`;

  // ✅ Proper UTF-8 encoding fix
  const encodedMessage = encodeURIComponent(message);

  // 🔥 mobile + desktop handling
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const whatsappUrl = isMobile
    ? `whatsapp://send?text=${encodedMessage}`
    : `https://api.whatsapp.com/send?text=${encodedMessage}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#070810] to-black">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 p-6 rounded-xl border border-white/20 max-w-md w-full backdrop-blur-md"
      >
        <div className="text-green-400 text-xl font-bold mb-4">
          ✓ Booking Confirmed
        </div>

        <div className="space-y-2 text-sm text-white/80">
          <p>
            <b>Name:</b> {state.name}
          </p>
          <p>
            <b>Email:</b> {state.email}
          </p>
          <p>
            <b>Phone:</b> {state.phone}
          </p>
          <p>
            <b>Tickets:</b> {state.qty}
          </p>
          <p>
            <b>Booking Id:</b> {state.bookingId}
          </p>
          <p>
            <b>Total:</b> ₹{state.total}
          </p>

          {!state.isAdmin && (
            <p>
              <b>UTR:</b> {state.utr}
            </p>
          )}
        </div>

        {/* MESSAGE */}
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg text-sm text-yellow-300 text-center leading-relaxed">
          🎟 Your ticket download has started.
          <br />
          If it didn’t download, please use the button below.
          <br />
          Keep your ticket ready for check-in at the event.
        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={() =>
            (window.location.href = `${API_BASE_URL}/api/bookings/download/${state.bookingId}`)
          }
          className="mt-5 w-full bg-green-600 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Download Ticket PDF
        </button>

        {/* ✅ WHATSAPP SHARE BUTTON */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => {
              if (isMobile) {
                window.location.href = whatsappUrl; // better for mobile apps
              } else {
                window.open(whatsappUrl, "_blank"); // desktop
              }
            }}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-2 rounded-full text-white font-medium shadow-lg transition"
          >
            {/* WhatsApp SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.77 11.77 0 0012.03 0C5.4 0 .03 5.36.03 11.97c0 2.11.55 4.17 1.6 6L0 24l6.2-1.63a11.9 11.9 0 005.83 1.49h.01c6.63 0 12-5.36 12-11.97 0-3.2-1.25-6.21-3.52-8.41zM12.04 21.8h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.21-3.68.97.98-3.58-.23-.37a9.73 9.73 0 01-1.5-5.17c0-5.38 4.4-9.77 9.8-9.77 2.62 0 5.08 1.02 6.92 2.87a9.7 9.7 0 012.87 6.9c0 5.38-4.4 9.77-9.8 9.77zm5.38-7.34c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.48-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.47 1.08 2.9 1.23 3.1.15.2 2.12 3.23 5.13 4.52.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.12-.28-.2-.58-.35z" />
            </svg>
            Share on WhatsApp
          </button>
        </div>

        <div className="mt-5 text-xs text-white/50 text-center">
          Keep this screen as proof of booking
        </div>

        {/* BOOK MORE */}
        <button
          onClick={() => navigate("/booking")}
          className="mt-5 w-full bg-gradient-to-r from-purple-500 to-pink-600 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Book More Tickets
        </button>
      </motion.div>
    </div>
  );
}
