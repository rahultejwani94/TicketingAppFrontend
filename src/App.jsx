import { Routes, Route } from "react-router-dom";
import Booking from "./pages/Booking";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import DownloadTicket from "./pages/DownloadTicket";
import SoldOutPage from "./pages/SoldOutPage";
import PastEvents from "./pages/PastEvents";
import PastEventDetail from "./pages/PastEventDetail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import TheNotebookConcert from "./pages/TheNotebookConcert";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<TheNotebookConcert />} />
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
        <Route path="/sold-out" element={<SoldOutPage />} />
        <Route path="/past-events" element={<PastEvents />} />
        <Route path="/past-events/:slug" element={<PastEventDetail />} />

        {/* Catch-all — must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
