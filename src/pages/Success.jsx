import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  // AUTO DOWNLOAD PDF
  useEffect(() => {
    if (state?.bookingId) {
      window.location.href =
        `${api_base_url}/api/bookings/${state.bookingId}/pdf`;
    }
  }, [state?.bookingId]);

  if (!state) return <div className="text-white p-10">No data</div>;

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
          <p><b>Name:</b> {state.name}</p>
          <p><b>Email:</b> {state.email}</p>
          <p><b>Phone:</b> {state.phone}</p>
          <p><b>Tickets:</b> {state.qty}</p>
          <p><b>Total:</b> ₹{state.total}</p>

          {!state.isAdmin && (
            <p><b>UTR:</b> {state.utr}</p>
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

        {/* DOWNLOAD BUTTON (backup option) */}
        <button
          onClick={() =>
            window.location.href =
              `${api_base_url}/api/bookings/${state.bookingId}/pdf`
          }
          className="mt-5 w-full bg-green-600 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Download Ticket PDF
        </button>

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