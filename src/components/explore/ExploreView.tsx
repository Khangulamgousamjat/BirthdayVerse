import React from "react";
import { Sparkles, ArrowRight, Music, Image as ImageIcon, Heart, Gift, Share2, Shield, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExploreViewProps {
  onCreateClick: () => void;
  onExploreTemplatesClick: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onCreateClick,
  onExploreTemplatesClick,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 py-6 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D6BFF]" />
          <span>The Next Generation Birthday Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] leading-tight tracking-tight">
          Make their birthday <br />
          <span className="bv-gradient-text">a little more magical.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#746B80] dark:text-[#B8AEC5] max-w-xl mx-auto leading-relaxed">
          Photos, music, memories, and your heartfelt words woven into an unforgettable, cinematic digital birthday experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onCreateClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Birthday Experience
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onExploreTemplatesClick}
          >
            Explore Templates
          </Button>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            How BirthdayVerse Works
          </h2>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5]">
            Create an unforgettable celebration in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] flex items-center justify-center text-lg font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-[#241B35] dark:text-[#F7F3FC]">
              Personalize with Memories
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Add photos, write from the heart with AI tone assistance, and pick a custom soundtrack.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] flex items-center justify-center text-lg font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-[#241B35] dark:text-[#F7F3FC]">
              Instant Private Magic Link
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Generate a shareable link protected by a 72-hour privacy promise, or choose to keep it forever.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] flex items-center justify-center text-lg font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-[#241B35] dark:text-[#F7F3FC]">
              A Cinematic Surprise
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              The recipient opens a magical 8-scene experience complete with audio, floating photos, and an interactive cake.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1C1230] to-[#251540] text-white border border-purple-900/40 text-left space-y-8">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E7B85C]">
            Crafted for Emotion
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold">
            Everything you need to make someone feel truly celebrated.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#E7B85C] font-semibold text-xs">
              <Gift className="w-4 h-4" />
              <span>Interactive Cake</span>
            </div>
            <p className="text-[11px] text-[#B8AEC5] leading-relaxed">
              Candles with real-time extinguishing and celebration confetti.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#9D6BFF] font-semibold text-xs">
              <Music className="w-4 h-4" />
              <span>Audio Atmosphere</span>
            </div>
            <p className="text-[11px] text-[#B8AEC5] leading-relaxed">
              Smooth audio fade-in complying with browser autoplay restrictions.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#F47FB5] font-semibold text-xs">
              <Heart className="w-4 h-4" />
              <span>Love Reactions</span>
            </div>
            <p className="text-[11px] text-[#B8AEC5] leading-relaxed">
              Recipient can tap the heart to send instant gratitude back to the creator.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Shield className="w-4 h-4" />
              <span>72h Ephemeral Privacy</span>
            </div>
            <p className="text-[11px] text-[#B8AEC5] leading-relaxed">
              Auto-purges photos and personal notes after 72 hours for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
