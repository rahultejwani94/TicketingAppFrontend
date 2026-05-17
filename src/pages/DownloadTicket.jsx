"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Download,
  Ticket,
  ArrowLeft,
  Search,
  Clock,
  Trash2,
  AlertCircle,
} from "lucide-react";
import API_BASE_URL, { EVENT_DETAILS, SUPPORT_PHONES } from "../config/api";
import ConcertLayout from "./ConcertLayout";
import { Phone } from "lucide-react";

export default function DownloadTicket() {
  const [bookingId, setBookingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Real-time validation
  const validateBookingId = (id) => {
    if (!id.trim()) {
      return "Booking ID is required";
    }
    if (id.trim().length < 5) {
      return "Booking ID is too short";
    }
    if (!/^[A-Za-z0-9-_]+$/.test(id.trim())) {
      return "Invalid characters in Booking ID";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBookingId(value);
    if (value.trim()) {
      setValidationError(validateBookingId(value));
    } else {
      setValidationError("");
    }
  };

  const handleDownload = async () => {
    const error = validateBookingId(bookingId);
    if (error) {
      setValidationError(error);
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/bookings/download/${bookingId.trim()}`,
      );

      if (response.status === 404) {
        toast.error("Invalid Booking ID");
        setValidationError("No booking found with this ID");
        return;
      }

      if (!response.ok) {
        toast.error("Something went wrong");
        return;
      }

      const blob = await response.blob();
      // Force octet-stream so iOS Safari downloads instead of opening inline
      const pdfBlob = new Blob([blob], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `The_Notebook_Concert_Ticket_${bookingId.trim()}.pdf`;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
      }, 300);

      toast.success("Download started!");
      setValidationError("");
    } catch (err) {
      console.error(err);
      toast.error("Unable to download ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleDownload();
    }
  };

  return (
    <ConcertLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: "rgba(20,20,20,0.95)",
              color: "#fff",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "12px 14px",
              fontSize: "14px",
            },
          }}
        />

        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-2 text-white/50 hover:text-white transition text-sm focus:outline-none focus-visible:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Event Context */}
          <div className="mb-6 bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-purple-600/20 border border-purple-400/20 rounded-xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt=""
                className="w-10 h-10 object-contain"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-bold text-white">
                  {EVENT_DETAILS.name}
                </p>
                <p className="text-xs text-purple-300">
                  {EVENT_DETAILS.tagline} | {EVENT_DETAILS.dates}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-lg shadow-[0_8px_30px_rgba(168,85,247,0.1)]">
            {/* Logo */}
            <div className="text-center mb-6">
              <img
                src="/logo.png"
                alt={EVENT_DETAILS.name}
                className="w-20 h-16 mx-auto object-contain mb-3 opacity-80"
              />
              <h1 className="text-2xl font-bold">Download Ticket</h1>
              <p className="text-white/50 text-sm mt-1">
                Enter your booking ID to get your ticket
              </p>
            </div>

            {/* Input */}
            <div className="mb-4">
              <label htmlFor="bookingId" className="sr-only">
                Booking ID
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"
                  aria-hidden="true"
                />
                <input
                  id="bookingId"
                  ref={inputRef}
                  value={bookingId}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter Booking ID"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white font-mono ${
                    validationError
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/15 focus:border-purple-500/50"
                  }`}
                  aria-invalid={!!validationError}
                  aria-describedby={
                    validationError ? "booking-id-error" : undefined
                  }
                />
              </div>
              {validationError && (
                <p
                  id="booking-id-error"
                  className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> {validationError}
                </p>
              )}
              <p className="mt-2 text-xs text-white/35 leading-relaxed">
                Your Booking ID was shared on the confirmation screen
              </p>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:scale-[1.02] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Ticket
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" aria-hidden="true" />
              <span className="text-white/30 text-xs uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-white/10" aria-hidden="true" />
            </div>

            {/* Book New Ticket */}
            <button
              onClick={() => navigate("/booking")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <Ticket className="w-4 h-4" />
              Book a New Ticket
            </button>
          </div>

          {/* New User Discovery - less prominent */}
          <div className="mt-4 mb-4 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition focus:outline-none focus-visible:text-white"
            >
              <img
                src="/logo.png"
                alt=""
                className="w-4 h-4 object-contain opacity-50"
                aria-hidden="true"
              />
              New here? Explore the event
            </a>
          </div>

          {/* SUPPORT / CONTACT */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/20 px-6 py-4 rounded-xl backdrop-blur-md shadow-lg text-center">
              <p className="text-sm text-white/80 mb-2 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-purple-300" />
                Need help? Contact us
              </p>
              <div className="flex justify-center items-center gap-4 text-base font-semibold">
                {SUPPORT_PHONES.map((phone, idx) => (
                  <span key={phone}>
                    <a
                      href={`tel:${phone}`}
                      className="text-purple-300 hover:text-white transition"
                    >
                      {phone}
                    </a>
                    {idx < SUPPORT_PHONES.length - 1 && (
                      <span className="text-white/30 ml-4">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConcertLayout>
  );
}
