import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Each page now loads as its own chunk, fetched only when that route is
// visited — instead of every page's JS (booking flow, admin login, ticket
// download, etc.) being bundled into the very first page load.
const TheNotebookConcert = lazy(() => import("./pages/TheNotebookConcert"));
const Booking = lazy(() => import("./pages/Booking"));
const Success = lazy(() => import("./pages/Success"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const DownloadTicket = lazy(() => import("./pages/DownloadTicket"));
const SoldOutPage = lazy(() => import("./pages/SoldOutPage"));
const PastEvents = lazy(() => import("./pages/PastEvents"));
const PastEventDetail = lazy(() => import("./pages/PastEventDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal, on-brand fallback so route-chunk loading never flashes a
// blank white screen against the site's dark theme.
function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-400 animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" />

      <Suspense fallback={<RouteLoader />}>
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
      </Suspense>
    </>
  );
}
