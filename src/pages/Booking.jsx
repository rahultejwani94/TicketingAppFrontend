"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import {
  Ticket,
  Minus,
  Plus,
  Copy,
  Phone,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import API_BASE_URL from "../config/api";
import { EVENT_DETAILS, SUPPORT_PHONES } from "../config/event";
import ConcertLayout from "./ConcertLayout";
import { getTicketPrice } from "../utils/pricing";

export default function Booking({ isAdmin = false }) {
  const isAdminFlow = isAdmin;
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(isAdmin);

  // Auto-focus first input on mount
  useEffect(() => {
    if (!isCheckingAuth && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isCheckingAuth]);

  // Check admin auth status
  useEffect(() => {
    if (isAdmin) {
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }
      setIsCheckingAuth(false);
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  useEffect(() => {
    if (!reservationId || !expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(interval);

        toast.error("Reservation expired");

        setReservationId(null);
        setExpiresAt(null);
        setStep(1);
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationId, expiresAt]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qty: 1,
    utr: "",
  });

  // Real-time validation states
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    utr: false,
  });

  const pricing = getTicketPrice(form.qty, EVENT_DETAILS.pricing);

  const pricePerTicket = pricing.pricePerTicket;

  const total = isAdminFlow ? 0 : pricing.total;

  const isEarlyBird = pricing.isEarlyBird;
  const isBulkDiscount = pricing.isBulkDiscount;

  const upiId = import.meta.env.VITE_UPI_ID;
  const merchant = import.meta.env.VITE_MERCHANT_NAME;
  const upiLink = `upi://pay?pa=${upiId}&pn=${merchant}&am=${total}&tn=Ticket`;

  const isMobile =
    typeof window !== "undefined"
      ? /iPhone|Android/i.test(navigator.userAgent)
      : false;

  // ---------------- VALIDATION ----------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  const getFieldError = (field) => {
    if (!touched[field]) return null;

    switch (field) {
      case "name":
        if (!form.name.trim()) return "Name is required";
        if (form.name.trim().length < 2) return "Name is too short";
        return null;
      case "email":
        if (!form.email.trim()) return "Email is required";
        if (!emailRegex.test(form.email)) return "Enter a valid email";
        return null;
      case "phone":
        if (!form.phone.trim()) return "Phone is required";
        if (!phoneRegex.test(form.phone)) return "Enter valid 10-digit phone";
        return null;
      case "utr":
        const utr = form.utr.trim();
        if (!utr) return "UTR is required";
        if (utr.includes(" ")) return "UTR should not contain spaces";
        if (!/^[A-Za-z0-9]+$/.test(utr))
          return "UTR can only contain letters and numbers";
        if (utr.length < 10) return "UTR is too short (min 10 characters)";
        return null;
      default:
        return null;
    }
  };

  const validateStep1 = () => {
    setTouched({ ...touched, name: true, email: true, phone: true });

    if (!form.name.trim()) {
      toast.error("Enter your name");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      toast.error("Enter valid email");
      return false;
    }
    if (!phoneRegex.test(form.phone)) {
      toast.error("Enter valid 10-digit phone");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    setTouched({ ...touched, utr: true });
    const utr = form.utr.trim();

    if (!utr) {
      toast.error("Enter UTR / Transaction ID");
      return false;
    }
    if (utr.includes(" ")) {
      toast.error("UTR should not contain spaces");
      return false;
    }
    if (!/^[A-Za-z0-9]+$/.test(utr)) {
      toast.error("Invalid UTR format");
      return false;
    }
    if (utr.length < 10) {
      toast.error("UTR is too short");
      return false;
    }
    return true;
  };

  // ---------------- STEP HANDLERS ----------------
  const goToPayment = async () => {
    if (!validateStep1()) return;

    try {
      setLoading(true);

      const reservePayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        ticketCount: form.qty,
        totalAmount: total,
        paymentType: isAdminFlow ? "FREE" : "PAID",
      };

      const url = reservationId
        ? `${API_BASE_URL}/api/bookings/reserve/${reservationId}`
        : `${API_BASE_URL}/api/bookings/reserve`;

      const method = reservationId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservePayload),
      });

      if (response.status === 404) {
        setReservationId(null);
        toast.error("Reservation expired. Please try again.");
        return;
      }

      if (response.status === 409) {
        toast.error("Tickets sold out");
        setTimeout(() => {
          toast.dismiss();
          navigate("/sold-out");
        }, 1200);
        return;
      }

      if (!response.ok) {
        throw new Error("Reservation failed");
      }

      const data = await response.json();

      const newReservationId = data.reservationId;

      if (!data.reservationId) {
        throw new Error("Invalid response from server");
      }

      setReservationId(newReservationId);

      const isNewReservation = !reservationId;

      if (isNewReservation && data.expiresAt) {
        setExpiresAt(Date.parse(data.expiresAt));
      }
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Unable to reserve tickets");
    } finally {
      setLoading(false);
    }
  };

  const goToUTR = () => {
    setStep(3);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const handleSubmit = async () => {
    if (!isAdminFlow && !validateStep3()) return;

    try {
      setLoading(true);

      const token = sessionStorage.getItem("adminToken");

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        ticketCount: form.qty,
        totalAmount: total,
        paymentType: isAdminFlow ? "FREE" : "PAID",
        utr: isAdminFlow ? "FREE_ADMIN" : form.utr.trim(),
      };

      if (!reservationId) {
        toast.error("Reservation expired. Please try again.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/bookings/confirm/${reservationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isAdminFlow &&
              token && {
                Authorization: `Bearer ${token}`,
              }),
          },
          body: JSON.stringify(payload),
        },
      );

      if (res.status === 409) {
        toast.error("Tickets sold out during payment");
        setTimeout(() => {
          toast.dismiss();
          navigate("/sold-out");
        }, 1200);
        return;
      }

      if (res.status === 404) {
        toast.error("Reservation expired. Please book again.");
        setReservationId(null);
        setStep(1);
        return;
      }

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();

      toast.success("Tickets generated!");

      setTimeout(() => {
        toast.dismiss();

        navigate("/success", {
          state: {
            ...form,
            total,
            bookingId: data.bookingId,
            tickets: data.tickets,
            pdfUrl: data.pdfUrl,
            emailSent: data.emailSent,
            isAdmin: isAdminFlow,
          },
        });
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("UPI ID copied");
    } catch (err) {
      toast.error("Failed to copy UPI ID");
      console.error(err);
    }
  };

  // Step labels
  const stepLabels = isAdminFlow
    ? [
        { id: 1, label: "Details" },
        { id: 2, label: "Confirm" },
      ]
    : [
        { id: 1, label: "Details" },
        { id: 2, label: "Payment" },
        { id: 3, label: "Confirm" },
      ];

  // Show loading skeleton while checking auth
  if (isCheckingAuth) {
    return (
      <ConcertLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white/50">Verifying admin access...</p>
          </div>
        </div>
      </ConcertLayout>
    );
  }

  return (
    <ConcertLayout showBackground={false}>
      <div className="min-h-screen px-4 py-8 flex justify-center bg-gradient-to-b from-black via-[#0b0b1a] to-black">
        {/* Loading Overlay */}
        {loading && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            role="alert"
            aria-live="polite"
          >
            <div className="bg-white/10 border border-white/20 px-8 py-6 rounded-2xl text-center backdrop-blur-md shadow-xl">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-white text-lg font-medium">Processing...</p>
            </div>
          </div>
        )}

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

        <div className="w-full max-w-6xl space-y-6">
          {/* HEADER WITH LOGO */}
          <header className="text-center space-y-1 relative">
            {isAdmin && (
              <div className="absolute top-0 right-0">
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 text-sm bg-red-600/80 hover:bg-red-500 rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Logout
                </button>
              </div>
            )}

            <a
              href="/"
              className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg"
            >
              <img
                src="/logo.png"
                alt="The Notebook Concert"
                className="w-32 h-20 mx-auto object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              />
              {/* <p className="absolute left-1/2 -translate-x-1/2 text-xs text-purple-300/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Back to event page
              </p> */}
            </a>
            <p className="text-sm tracking-[0.3em] text-purple-300 uppercase">
              {EVENT_DETAILS.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">Book Your Ticket</h1>

            {/* Mobile download ticket link */}
            <div className="md:hidden flex justify-center mt-3">
              <button
                onClick={() => navigate("/download-ticket")}
                className="text-sm text-purple-300 hover:text-white transition underline underline-offset-4 focus:outline-none focus-visible:text-white"
              >
                <Ticket className="w-4 h-4 inline mr-1" />
                Already booked? Download Ticket
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-white/60 text-sm">
                {isAdminFlow
                  ? "Fill details and create booking"
                  : "Fill details → pay → confirm with UTR"}
              </p>

              <a
                href="/"
                className="inline-flex items-center gap-1 text-xs text-purple-300/70 hover:text-purple-200 transition"
              >
                ← View Event Details
              </a>
            </div>

            {/* Desktop floating download button */}
            <div className="hidden md:block">
              <button
                onClick={() => navigate("/download-ticket")}
                className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_8px_30px_rgba(168,85,247,0.35)] hover:scale-105 hover:shadow-[0_10px_40px_rgba(236,72,153,0.45)] transition-all duration-300 backdrop-blur-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <Ticket className="w-5 h-5" />
                <div className="text-left leading-tight">
                  <div className="text-white font-semibold text-sm">
                    Already Booked?
                  </div>
                  <div className="text-white/80 text-xs">Download Ticket</div>
                </div>
              </button>
            </div>
          </header>

          {/* STEP INDICATOR */}
          <nav className="flex justify-center" aria-label="Booking progress">
            <div className="flex gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              {stepLabels.map((s) => (
                <div
                  key={s.id}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    step === s.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium"
                      : step > s.id
                        ? "text-purple-300"
                        : "text-white/50"
                  }`}
                  aria-current={step === s.id ? "step" : undefined}
                >
                  {s.id}: {s.label}
                </div>
              ))}
            </div>
          </nav>
          {/* ⏱️ ADD THIS RIGHT HERE */}
          {timeLeft !== null && reservationId && (
            <div className="text-center text-sm text-yellow-300 mt-3">
              Reservation expires in {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}

          {/* MAIN GRID */}
          <div className="grid md:grid-cols-2 gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
            {/* LEFT - FORM */}
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-sm"
                    aria-hidden="true"
                  >
                    1
                  </span>
                  Your Details
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    ref={nameInputRef}
                    className={`w-full p-3.5 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white ${
                      getFieldError("name")
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/15 focus:border-purple-500/50"
                    }`}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    disabled={step !== 1}
                    aria-invalid={!!getFieldError("name")}
                    aria-describedby={
                      getFieldError("name") ? "name-error" : undefined
                    }
                  />
                  {getFieldError("name") && (
                    <p
                      id="name-error"
                      className="text-red-400 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />{" "}
                      {getFieldError("name")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    id="email"
                    className={`w-full p-3.5 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white ${
                      getFieldError("email")
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/15 focus:border-purple-500/50"
                    }`}
                    placeholder="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onBlur={() => setTouched({ ...touched, email: true })}
                    disabled={step !== 1}
                    aria-invalid={!!getFieldError("email")}
                    aria-describedby={
                      getFieldError("email") ? "email-error" : undefined
                    }
                  />
                  {getFieldError("email") && (
                    <p
                      id="email-error"
                      className="text-red-400 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />{" "}
                      {getFieldError("email")}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    className={`w-full p-3.5 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white ${
                      getFieldError("phone")
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/15 focus:border-purple-500/50"
                    }`}
                    placeholder="Phone Number (10 digits)"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setForm({ ...form, phone: value });
                    }}
                    onBlur={() => setTouched({ ...touched, phone: true })}
                    disabled={step !== 1}
                    aria-invalid={!!getFieldError("phone")}
                    aria-describedby={
                      getFieldError("phone") ? "phone-error" : undefined
                    }
                  />
                  {getFieldError("phone") && (
                    <p
                      id="phone-error"
                      className="text-red-400 text-xs mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />{" "}
                      {getFieldError("phone")}
                    </p>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-sm text-white/60">Number of Tickets</span>

                <div className="flex items-center gap-3">
                  <button
                    disabled={step !== 1 || reservationId || form.qty <= 1}
                    onClick={() =>
                      setForm({
                        ...form,
                        qty: Math.max(1, form.qty - 1),
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-purple-600/80 hover:bg-purple-500 rounded-lg disabled:opacity-30 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-bold text-lg">
                    {form.qty}
                  </span>

                  <button
                    disabled={step !== 1 || reservationId}
                    onClick={() =>
                      setForm({
                        ...form,
                        qty: form.qty + 1,
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center bg-purple-600/80 hover:bg-purple-500 rounded-lg disabled:opacity-30 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price info */}
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-400/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/50 text-xs">Price per ticket</p>
                    <p className="text-lg font-bold">
                      {isAdminFlow ? "FREE" : `₹${pricePerTicket}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs">Total Amount</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹{total}
                    </p>
                  </div>
                </div>

                {!isAdminFlow && (
                  <div className="mt-2 space-y-1">
                    {isEarlyBird && (
                      <p className="text-xs text-green-300">
                        Early Bird pricing active — ₹
                        {EVENT_DETAILS.pricing.earlyBird.price} per ticket
                      </p>
                    )}

                    {!isEarlyBird && isBulkDiscount && (
                      <p className="text-xs text-purple-300">
                        Group discount applied — ₹
                        {EVENT_DETAILS.pricing.regular.singleTicketPrice -
                          EVENT_DETAILS.pricing.regular.bulkTicketPrice}
                        off per ticket
                      </p>
                    )}
                  </div>
                )}
              </div>

              {step === 1 && (
                <button
                  onClick={goToPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] hover:scale-[1.02] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdminFlow ? "Continue to Booking" : "Continue to Payment"}
                </button>
              )}

              {step > 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition flex items-center justify-center gap-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Details
                </button>
              )}
            </div>

            {/* RIGHT - SUMMARY + PAYMENT */}
            <div className="space-y-5">
              {/* ORDER SUMMARY */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-sm"
                    aria-hidden="true"
                  >
                    2
                  </span>
                  Order Summary
                </h2>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Name</span>
                    <span className="font-medium">{form.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Email</span>
                    <span className="truncate max-w-[180px]">
                      {form.email || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Phone</span>
                    <span>{form.phone || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Tickets</span>
                    <span>{form.qty}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-400">
                      {isAdminFlow ? "FREE" : `₹${total}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT */}
              {!isAdminFlow && step >= 2 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span
                      className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-sm"
                      aria-hidden="true"
                    >
                      3
                    </span>
                    Payment
                  </h2>

                  {isMobile ? (
                    <a
                      href={upiLink}
                      className="block text-center bg-gradient-to-r from-purple-500 to-pink-600 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                      Pay Now via UPI App
                    </a>
                  ) : (
                    <div className="p-5 border border-dashed border-white/20 rounded-2xl text-center bg-white/5">
                      <div className="bg-white p-4 rounded-xl inline-block shadow-[0_0_25px_rgba(255,255,255,0.15)]">
                        <QRCodeCanvas
                          value={upiLink}
                          size={170}
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                      <p className="text-xs text-white/60 mt-3">
                        Scan using any UPI app (GPay, PhonePe, Paytm)
                      </p>
                    </div>
                  )}

                  {/* UPI ID COPY */}
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-3">
                    <p className="text-xs text-white/50 mb-2">
                      Unable to scan? Pay directly to this UPI ID:
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="truncate text-sm font-medium text-purple-300 font-mono">
                        {upiId}
                      </div>
                      <button
                        onClick={() => copyToClipboard(upiId)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                        aria-label="Copy UPI ID"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={goToUTR}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    I Have Paid
                  </button>
                </div>
              )}

              {/* UTR STEP */}
              {((!isAdminFlow && step === 3) ||
                (isAdminFlow && step === 2)) && (
                <div className="space-y-3">
                  {!isAdminFlow && (
                    <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      <span
                        className="w-8 h-8 rounded-lg bg-green-600/30 flex items-center justify-center text-sm"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      Confirm Payment
                    </h2>
                  )}
                  {!isAdminFlow && (
                    <div>
                      <label htmlFor="utr" className="sr-only">
                        UTR / Transaction ID
                      </label>
                      <input
                        id="utr"
                        className={`w-full p-3.5 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white font-mono ${
                          getFieldError("utr")
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-white/15 focus:border-green-500/50"
                        }`}
                        placeholder="Enter UTR / Transaction ID"
                        value={form.utr}
                        onChange={(e) =>
                          setForm({ ...form, utr: e.target.value.trimStart() })
                        }
                        onBlur={() => setTouched({ ...touched, utr: true })}
                        aria-invalid={!!getFieldError("utr")}
                        aria-describedby={
                          getFieldError("utr") ? "utr-error" : "utr-hint"
                        }
                      />
                      {getFieldError("utr") ? (
                        <p
                          id="utr-error"
                          className="text-red-400 text-xs mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />{" "}
                          {getFieldError("utr")}
                        </p>
                      ) : (
                        <p id="utr-hint" className="text-white/30 text-xs mt-1">
                          Find UTR in your UPI app payment history (12-22
                          characters)
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(34,197,94,0.35)] hover:scale-[1.02] transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
                  >
                    {loading
                      ? "Processing..."
                      : isAdminFlow
                        ? "Create Free Booking"
                        : "Confirm Booking"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DISCOVER MORE */}
          <div className="flex justify-center mb-4">
            <a
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white/60 hover:text-white hover:border-purple-400/30 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <img
                src="/logo.png"
                alt=""
                className="w-5 h-5 object-contain opacity-70 drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]"
                aria-hidden="true"
              />
              Want to learn more about the event? Visit our home page
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
