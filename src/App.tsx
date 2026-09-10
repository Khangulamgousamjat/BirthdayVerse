import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load both pages — Home loads fast, Surprise loads only when navigated to
const Home = React.lazy(() => import("./pages/Home"));
const Surprise = React.lazy(() => import("./pages/Surprise"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F8F6FC] dark:bg-[#100C18] flex items-center justify-center text-[#7952D6] dark:text-[#9D6BFF]">
    <Sparkles className="animate-spin w-8 h-8 mr-2" />
    <span className="text-sm font-semibold">Loading Birthdayverse...</span>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isSurprisePage = location.pathname.startsWith("/surprise");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-300">
      {/* Video Background only for Surprise recipient experience */}
      {isSurprisePage && (
        <div className="aurora-bg" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
            style={{
              willChange: "auto",
              opacity: 0.45,
              transform: "translateZ(0)",
            }}
            onCanPlay={(e) => {
              (e.target as HTMLVideoElement).playbackRate = 0.6;
            }}
          >
            <source src="/background.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/surprise/:id"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Surprise />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <AppContent />
      </LazyMotion>
    </ThemeProvider>
  );
}

export default App;
