import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeCanvas } from "qrcode.react";
import API_BASE_URL from "../config/api";

export default function Booking({ isAdmin = false }) {
  const isAdminFlow = isAdmin;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ PASTE HERE
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qty: 1,
    utr: "",
  });

  const pricePerTicket = form.qty <= 1 ? 400 : 350;
  const total = isAdminFlow ? 0 : pricePerTicket * form.qty;

  const upiId = import.meta.env.VITE_UPI_ID;
  const merchant = import.meta.env.VITE_MERCHANT_NAME;

  const upiLink = `upi://pay?pa=${upiId}&pn=${merchant}&am=${total}&tn=Ticket`;

  const isMobile =
    typeof window !== "undefined"
      ? /iPhone|Android/i.test(navigator.userAgent)
      : false;

  // ---------------- VALIDATION ----------------
  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

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
    if (!form.utr.trim()) {
      toast.error("Enter UTR / Transaction ID");
      return false;
    }
    return true;
  };

  // ---------------- STEP HANDLERS ----------------
  const goToPayment = () => {
    if (!validateStep1()) return;

    if (isAdminFlow) {
      setStep(3); // skip payment completely
    } else {
      setStep(2);
    }
  };

  const goToUTR = () => {
    setStep(3);
  };

  const payload = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    utr: isAdminFlow ? "FREE_ADMIN" : form.utr,
    ticketCount: form.qty,
    totalAmount: total,
    paymentType: isAdminFlow ? "FREE" : "PAID",
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const handleSubmit = async () => {
    if (!isAdminFlow && !validateStep3()) return;

    try {
      setLoading(true);

      const bookings_url = `${API_BASE_URL}/api/bookings`;

      const token = sessionStorage.getItem("adminToken");

      const res = await fetch(bookings_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAdminFlow &&
            token && {
              Authorization: `Bearer ${token}`,
            }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Booking failed");
      }

      const data = await res.json();

      toast.success("Tickets generated!");

      setTimeout(() => {
        toast.dismiss(); // ✅ clear toast
        navigate("/success", {
          state: {
            ...form,
            total,
            bookingId: data.bookingId,
            tickets: data.ticketIds,
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

  return (
    <div className="min-h-screen px-4 py-8 flex justify-center text-white bg-gradient-to-b from-black via-[#0b0b1a] to-black">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 border border-white/20 px-8 py-6 rounded-xl text-center backdrop-blur-md shadow-xl">
            {/* SPINNER */}
            <div className="w-10 h-10 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin mx-auto mb-4"></div>

            {/* TEXT */}
            <p className="text-white text-lg font-medium animate-pulse">
              Processing...
            </p>
          </div>
        </div>
      )}

      {/* SINGLE TOAST CONTAINER ONLY */}
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
        <div className="text-center space-y-3 relative">
          {isAdmin && (
            <div className="absolute top-4 right-4">
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          )}
          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Notebook Concert"
            className="w-34 h-24 mx-auto object-contain"
          />
          {/* BRAND NAME */}
          <p className="text-sm tracking-[0.3em] text-purple-300 uppercase">
            The Notebook Concert
          </p>
          {/* TITLE */}
          <h1 className="text-4xl font-bold">Book Your Ticket</h1>
          {/* SUBTEXT */}
          <p className="text-white/60">
            {isAdminFlow
              ? "Fill details → Create booking"
              : "Fill details → Pay → Confirm with UTR"}
          </p>{" "}
        </div>

        {/* STEP INDICATOR (CENTERED STRIPE STYLE) */}
        <div className="flex justify-center">
          <div className="flex gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {[
              { id: 1, label: "Details" },
              ...(!isAdminFlow ? [{ id: 2, label: "Payment" }] : []),
              { id: 3, label: "Confirm" },
            ].map((s) => (
              <div
                key={s.id}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  step === s.id ? "bg-purple-600 text-white" : "text-white/50"
                }`}
              >
                {s.id}: {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg">
          {/* LEFT - FORM */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Details</h2>

            <input
              className="input"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={step !== 1}
            />

            <input
              className="input"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={step !== 1}
            />

            <input
              className="input"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={step !== 1}
            />

            <div className="flex justify-between items-center bg-white/5 p-3 rounded">
              <button
                disabled={step !== 1}
                onClick={() =>
                  setForm({ ...form, qty: Math.max(1, form.qty - 1) })
                }
                className="px-3 py-1 bg-purple-600 rounded disabled:opacity-40"
              >
                -
              </button>

              <span>{form.qty}</span>

              <button
                disabled={step !== 1}
                onClick={() => setForm({ ...form, qty: form.qty + 1 })}
                className="px-3 py-1 bg-purple-600 rounded disabled:opacity-40"
              >
                +
              </button>
            </div>

            <div className="text-sm text-white/70">
              Total: <span className="font-bold text-white">₹{total}</span>
            </div>

            {step === 1 && (
              <button
                onClick={goToPayment}
                className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-500 transition"
              >
                Continue
              </button>
            )}
          </div>

          {/* RIGHT - SUMMARY + PAYMENT STACK */}
          <div className="space-y-5">
            {/* ORDER SUMMARY */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Name</span>
                  <span>{form.name || "-"}</span>
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

                <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-green-400">
                    {isAdminFlow ? "FREE (₹0)" : `₹${total}`}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            {!isAdminFlow && step >= 2 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Payment</h2>

                {isMobile ? (
                  <a
                    href={upiLink}
                    className="block text-center bg-gradient-to-r from-purple-500 to-pink-600 py-2 rounded-lg"
                  >
                    Pay Now
                  </a>
                ) : (
                  <div className="p-4 border border-dashed border-white/30 rounded-xl text-center">
                    {/* WHITE QR CARD */}
                    <div className="bg-white p-4 rounded-xl inline-block shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                      <QRCodeCanvas
                        value={upiLink}
                        size={160}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>

                    <p className="text-xs text-white/60 mt-3">
                      Scan this QR using any UPI app
                    </p>
                  </div>
                )}

                <button
                  onClick={goToUTR}
                  className="w-full mt-3 bg-purple-600 py-2 rounded-lg"
                >
                  I Have Paid
                </button>
              </div>
            )}

            {/* UTR STEP */}
            {step === 3 && (
              <div className="space-y-3">
                {!isAdminFlow && (
                  <input
                    className="input"
                    placeholder="UTR / Transaction ID"
                    value={form.utr}
                    onChange={(e) => setForm({ ...form, utr: e.target.value })}
                  />
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 py-2 rounded-lg"
                >
                  {loading
                    ? "Processing..."
                    : isAdminFlow
                      ? "Create Free Booking"
                      : "Confirm Booking"}{" "}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* SUPPORT / CONTACT */}
        <div className="mt-6 flex justify-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/20 px-5 py-3 rounded-xl backdrop-blur-md shadow-lg text-center">
            <p className="text-sm text-white/80 mb-1">Need help? Contact us</p>

            <div className="flex justify-center items-center gap-4 text-lg font-semibold">
              <a
                href="tel:9004940265"
                className="text-purple-300 hover:text-white transition"
              >
                9004940265
              </a>

              <span className="text-white/30">•</span>

              <a
                href="tel:9373695607"
                className="text-purple-300 hover:text-white transition"
              >
                9373695607
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.15);
          outline: none;
        }
        .input:disabled {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
