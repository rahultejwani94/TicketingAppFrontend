import { Routes, Route, Navigate } from "react-router-dom";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import DownloadTicket from "./pages/DownloadTicket";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<Navigate to="/booking" />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin-booking"
          element={
            <ProtectedRoute>
              <Booking isAdmin={true} />
            </ProtectedRoute>
          }
        />

        <Route path="/success" element={<Success />} />
        <Route path="/download-ticket" element={<DownloadTicket />} />
      </Routes>
    </>
  );
}
