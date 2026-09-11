import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";

// Lazy load pages for fast initial bundle
const Home = React.lazy(() => import("./pages/Home"));
const Surprise = React.lazy(() => import("./pages/Surprise"));
const Admin = React.lazy(() => import("./pages/Admin"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F9F7FD] dark:bg-[#13101C] flex items-center justify-center text-[#7659E4] dark:text-[#A28DF8]">
    <Sparkles className="animate-spin w-8 h-8 mr-2 text-[#7659E4]" />
    <span className="text-sm font-semibold tracking-wide">Loading BirthdayVerse...</span>
  </div>
);

function AppContent() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-300">
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
        <Route
          path="/admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Admin />
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
