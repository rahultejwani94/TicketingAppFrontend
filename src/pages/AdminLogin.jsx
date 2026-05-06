import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW

  const api_base_url = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const admin_login_url = `${api_base_url}/api/admin/login`;
      const res = await fetch(admin_login_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Invalid password");
      }

      const data = await res.json();

      sessionStorage.setItem("adminToken", data.token);

      toast.success("Login successful");
      navigate("/admin-booking");

    } catch (err) {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-white/10 p-6 rounded-xl border border-white/20 w-80">
        <h1 className="text-xl mb-4 font-bold">Admin Login</h1>

        <form onSubmit={handleLogin}>

          {/* PASSWORD INPUT WITH ICON */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"} // 👈 toggle
              placeholder="Enter password"
              className="w-full p-2 pr-10 rounded bg-black/40 border border-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 👁️ ICON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 py-2 rounded"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}