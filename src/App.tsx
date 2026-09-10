import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";

const Home = React.lazy(() => import("./pages/Home"));
const Surprise = React.lazy(() => import("./pages/Surprise"));
const Admin = React.lazy(() => import("./pages/Admin"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#F8F6FC] dark:bg-[#100C18] flex items-center justify-center text-[#7952D6] dark:text-[#A77BFF]">
    <Sparkles className="animate-pulse w-7 h-7 mr-2" />
    <span className="text-sm font-semibold">Loading Birthday Verse...</span>
  </div>
);

function AppContent() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Suspense fallback={<LoadingScreen />}><Home /></Suspense>} />
        <Route path="/surprise/:id" element={<Suspense fallback={<LoadingScreen />}><Surprise /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={<LoadingScreen />}><Admin /></Suspense>} />
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
