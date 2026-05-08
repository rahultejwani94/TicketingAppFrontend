import { useState } from "react";
import API_BASE_URL from "../config/api";
import toast, { Toaster } from "react-hot-toast";

export default function DownloadTicket() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!bookingId.trim()) {
      toast.error("Enter booking ID");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/download/${bookingId}`,
      );

      if (response.status === 404) {
        toast.error("Invalid Booking ID");
        return;
      }

      if (!response.ok) {
        toast.error("Something went wrong");
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `The_Notebook_Concert_Ticket_${bookingId}.pdf`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started");
    } catch (err) {
      console.error(err);
      toast.error("Unable to download ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Toaster />

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Download Ticket</h1>

        <p className="text-white/60 text-sm text-center mb-6">
          Enter your booking ID to download ticket PDF
        </p>

        <input
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="Booking ID"
          className="w-full p-3 rounded-lg bg-black/40 border border-white/20 outline-none"
        />

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-500 py-3 rounded-lg transition"
        >
          {loading ? "Downloading..." : "Download Ticket"}
        </button>
      </div>
    </div>
  );
}
