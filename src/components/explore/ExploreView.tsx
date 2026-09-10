import React from "react";
import { Sparkles, ArrowRight, Music, Image as ImageIcon, Heart, Gift, Share2, Shield, Star, CheckCircle2 } from "lucide-react";

interface ExploreViewProps {
  onCreateClick: () => void;
  onExploreTemplatesClick: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onCreateClick,
  onExploreTemplatesClick,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#9D6BFF]" />
          <span>The Next Generation Birthday Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] leading-tight tracking-tight mb-6">
          Make their birthday <br />
          <span className="bv-gradient-text">a little more magical.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#746B80] dark:text-[#B8AEC5] max-w-xl mx-auto mb-8 leading-relaxed font-sans">
          Photos, music, memories, and your heartfelt words in one stunning digital birthday experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onCreateClick}
            className="bv-gradient-btn px-8 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>Create a birthday surprise</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreTemplatesClick}
            className="px-6 py-3.5 rounded-full text-sm font-bold bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] text-[#241B35] dark:text-[#F7F3FC] hover:bg-[#EDE7F6]/50 dark:hover:bg-[#251B35] transition-all cursor-pointer w-full sm:w-auto"
          >
            Explore Templates
          </button>
        </div>
      </section>

      {/* How It Works (3 simple steps) */}
      <section className="pt-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-2">
            How Birthdayverse Works
          </h2>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5]">
            Create an unforgettable celebration in under two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#7952D6] dark:text-[#9D6BFF] flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-[#241B35] dark:text-[#F7F3FC] mb-2">
              Personalize Your Message
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Add the recipient’s name, relationship, and write heartfelt wishes with optional AI writing assistance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-[#F47FB5] flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-[#241B35] dark:text-[#F7F3FC] mb-2">
              Add Memories & Music
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Upload favorite photos and pick the perfect soundtrack from our curated acoustic & pop tracks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-[#241B35] dark:text-[#F7F3FC] mb-2">
              Share the Magical Surprise
            </h3>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
              Generate an interactive link, QR code, or WhatsApp greeting that unfolds with confetti and cinema.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white/60 dark:bg-[#171122]/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-[#EDE7F6] dark:border-[#251B35]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-2">
            Loved by Thousands of Celebrators
          </h2>
          <div className="flex justify-center gap-1 text-amber-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#F8F6FC] dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C]">
            <p className="text-xs italic text-[#746B80] dark:text-[#B8AEC5] mb-4">
              "My best friend cried happy tears when she opened her Birthdayverse link. The music synced right with our vacation photos!"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#9D6BFF] text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Aarav Mehta</p>
                <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Sent to his college bestie</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8F6FC] dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C]">
            <p className="text-xs italic text-[#746B80] dark:text-[#B8AEC5] mb-4">
              "The design looks like a luxury studio project. Far better than a boring text message or basic e-card."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F47FB5] text-white flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Sneha Roy</p>
                <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Sent to her sister</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8F6FC] dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C]">
            <p className="text-xs italic text-[#746B80] dark:text-[#B8AEC5] mb-4">
              "The live preview while typing made it super fun to customize. Generating the link and sending it via WhatsApp took seconds."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                K
              </div>
              <div>
                <p className="text-xs font-bold text-[#241B35] dark:text-[#F7F3FC]">Karan Patel</p>
                <p className="text-[10px] text-[#746B80] dark:text-[#B8AEC5]">Sent to his girlfriend</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-[#7952D6] via-[#9D6BFF] to-[#F47FB5] text-white shadow-xl shadow-purple-500/20 overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-display font-bold mb-3">
            Ready to craft pure birthday magic?
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mb-6">
            Join thousands of creators who turn ordinary birthdays into unforgettable digital gifts.
          </p>
          <button
            onClick={onCreateClick}
            className="px-8 py-3.5 rounded-full bg-white text-[#7952D6] font-bold text-sm shadow-lg hover:bg-gray-50 cursor-pointer transition-all transform hover:scale-105"
          >
            Create a Birthday Wish Now
          </button>
        </div>
      </section>

    </div>
  );
};
