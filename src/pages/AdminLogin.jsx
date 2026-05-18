"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Shield, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API_BASE_URL from "../config/api";
import { EVENT_DETAILS } from "../config/event";
import ConcertLayout from "./ConcertLayout";

export default function AdminLogin() {
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  // Auto-focus password input on mount
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      navigate("/admin-booking");
    }
  }, [navigate]);

  // Check lockout status
  useEffect(() => {
    const stored = localStorage.getItem('adminLockout');
    if (stored) {
      const lockoutTime = parseInt(stored, 10);
      if (Date.now() < lockoutTime) {
        setLockedUntil(lockoutTime);
      } else {
        localStorage.removeItem('adminLockout');
        setAttempts(0);
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) return;

    const interval = setInterval(() => {
      if (Date.now() >= lockedUntil) {
        setLockedUntil(null);
        setAttempts(0);
        localStorage.removeItem('adminLockout');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const getRemainingLockoutTime = () => {
    if (!lockedUntil) return 0;
    return Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      toast.error(`Too many attempts. Try again in ${getRemainingLockoutTime()}s`);
      return;
    }

    if (!password.trim()) {
      toast.error("Enter password");
      return;
    }

    try {
      setLoading(true);
      const admin_login_url = `${API_BASE_URL}/api/admin/login`;
      const res = await fetch(admin_login_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        // Lock after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutTime = Date.now() + 60000; // 1 minute lockout
          setLockedUntil(lockoutTime);
          localStorage.setItem('adminLockout', lockoutTime.toString());
          toast.error("Too many failed attempts. Locked for 1 minute.");
        } else {
          toast.error(`Invalid password (${5 - newAttempts} attempts remaining)`);
        }
        return;
      }

      const data = await res.json();

      // Clear lockout on successful login
      localStorage.removeItem('adminLockout');
      setAttempts(0);

      sessionStorage.setItem("adminToken", data.token);
      toast.success("Login successful");
      
      // Short delay for toast to show
      setTimeout(() => {
        navigate("/admin-booking");
      }, 300);

    } catch (err) {
      console.error(err);
      toast.error("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  return (
    <ConcertLayout>      

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <a href="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg">
              <img 
                src="/logo.png" 
                alt={EVENT_DETAILS.name}
                className="w-20 h-20 mx-auto object-contain mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              />
            </a>
            <p className="text-xs tracking-[0.3em] text-purple-300 uppercase mb-1">
              {EVENT_DETAILS.name}
            </p>
            <h1 className="text-xl font-bold text-white/80">Admin Portal</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-[0_8px_30px_rgba(168,85,247,0.1)]">
            {/* Admin Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-400/30 flex items-center justify-center">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-center mb-6">Admin Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* PASSWORD INPUT WITH ICON */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className={`w-full p-3.5 pr-12 rounded-xl bg-black/40 border outline-none transition placeholder:text-white/30 text-white ${
                      isLocked ? 'border-red-500/50 cursor-not-allowed opacity-50' : 'border-white/15 focus:border-purple-500/50'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || isLocked}
                    aria-describedby={isLocked ? "lockout-message" : undefined}
                  />

                  {/* Toggle visibility button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading || isLocked}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Lockout warning */}
              {isLocked && (
                <div 
                  id="lockout-message"
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/20 rounded-xl text-sm text-red-300"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Too many attempts. Try again in {getRemainingLockoutTime()}s</span>
                </div>
              )}

              {/* Attempt warning */}
              {!isLocked && attempts > 0 && attempts < 5 && (
                <p className="text-yellow-400/80 text-xs text-center">
                  {5 - attempts} attempts remaining before lockout
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 rounded-xl font-bold tracking-wider uppercase text-sm hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" aria-hidden="true" />
              <span className="text-white/20 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" aria-hidden="true" />
            </div>

            {/* Back to main site */}
            <a
              href="/"
              className="block w-full py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition text-sm font-medium text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              Back to Event Page
            </a>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-white/20 text-xs">
            Authorized personnel only. Access is logged.
          </p>
        </div>
      </div>
    </ConcertLayout>
  );
}