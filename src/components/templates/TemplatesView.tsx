import React, { useState } from "react";
import { Sparkles, Check, Eye, Heart, Crown, PartyPopper, Moon, Music, Gift, Feather, Star } from "lucide-react";

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  badge?: string;
  previewBg: string;
  bgGradient: string;
  previewText: string;
  icon: React.ReactNode;
}

export const TEMPLATES_DATA: TemplateItem[] = [
  {
    id: "elegant",
    name: "Golden Elegance",
    category: "Elegant",
    description: "Refined lavender gold aesthetics with classical serif typography.",
    accent: "#7952D6",
    badge: "Popular",
    previewBg: "bg-gradient-to-br from-[#2D1654] via-[#1F103A] to-[#120824]",
    bgGradient: "from-[#F3E8FF] via-[#EDE9FE] to-[#FCE7F3]",
    previewText: "Elegant & Luxurious",
    icon: <Crown className="w-4 h-4 text-amber-300" />,
  },
  {
    id: "dreamy",
    name: "Dreamy Starlight",
    category: "Dreamy",
    description: "Soft celestial clouds, twinkling stars, and pastel purple skies.",
    accent: "#9D6BFF",
    badge: "Trending",
    previewBg: "bg-gradient-to-br from-[#4338CA] via-[#6D28D9] to-[#C084FC]",
    bgGradient: "from-[#E0E7FF] via-[#EDE9FE] to-[#F5D0FE]",
    previewText: "Clouds & Starlight",
    icon: <Moon className="w-4 h-4 text-purple-300" />,
  },
  {
    id: "romantic",
    name: "Sweet Romance",
    category: "Romantic",
    description: "Rose gold petals, soft bokeh lights, and warm heartfelt vibes.",
    accent: "#F47FB5",
    badge: "Special",
    previewBg: "bg-gradient-to-br from-[#881337] via-[#BE123C] to-[#FB7185]",
    bgGradient: "from-[#FFE4E6] via-[#FCE7F3] to-[#EDE9FE]",
    previewText: "Warm & Heartfelt",
    icon: <Heart className="w-4 h-4 text-rose-300" />,
  },
  {
    id: "fun",
    name: "Confetti Fiesta",
    category: "Fun",
    description: "Bursting confetti cascades, lively vibrant colors, and pure joy.",
    accent: "#EA580C",
    previewBg: "bg-gradient-to-br from-[#EA580C] via-[#F59E0B] to-[#EC4899]",
    bgGradient: "from-[#FEF3C7] via-[#FEE2E2] to-[#EDE9FE]",
    previewText: "Joyful & Energetic",
    icon: <PartyPopper className="w-4 h-4 text-amber-300" />,
  },
  {
    id: "cute",
    name: "Pastel Sweetness",
    category: "Cute",
    description: "Playful balloons, cute gift wraps, and adorable celebration art.",
    accent: "#DB2777",
    previewBg: "bg-gradient-to-br from-[#F47FB5] via-[#A78BFA] to-[#93C5FD]",
    bgGradient: "from-[#FCE7F3] via-[#E0E7FF] to-[#FEF3C7]",
    previewText: "Sweet & Adorable",
    icon: <Gift className="w-4 h-4 text-pink-300" />,
  },
  {
    id: "party",
    name: "Midnight Disco",
    category: "Party",
    description: "Neon rave lights, dark moody glow, and high-energy club soundtrack.",
    accent: "#A855F7",
    badge: "Hot",
    previewBg: "bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#BE185D]",
    bgGradient: "from-[#2E1065] via-[#4C1D95] to-[#701A75]",
    previewText: "Neon & High Energy",
    icon: <Music className="w-4 h-4 text-purple-300" />,
  },
  {
    id: "minimal",
    name: "Modern Minimalist",
    category: "Minimal",
    description: "Crisp whitespace, timeless typography, and subtle micro-accents.",
    accent: "#4B5563",
    previewBg: "bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#6B7280]",
    bgGradient: "from-[#F9FAFB] via-[#F3F4F6] to-[#EDE9FE]",
    previewText: "Clean & Modern",
    icon: <Feather className="w-4 h-4 text-gray-300" />,
  },
];

interface TemplatesViewProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplateId?: string;
  searchQuery?: string;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
  selectedTemplateId = "elegant",
  searchQuery = "",
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Elegant", "Romantic", "Fun", "Cute", "Party", "Minimal"];

  const filteredTemplates = TEMPLATES_DATA.filter((tmpl) => {
    const matchesCategory = activeCategory === "All" || tmpl.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Design Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC] mb-3">
          Birthday Experience Templates
        </h1>
        <p className="text-sm text-[#746B80] dark:text-[#B8AEC5]">
          Pick from high-craft artistic styles built for emotion, excitement, and unforgettable moments.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? "bg-[#7952D6] text-white shadow-md shadow-purple-500/25 scale-105"
                : "bg-white dark:bg-[#1D162A] text-[#746B80] dark:text-[#B8AEC5] border border-[#EDE7F6] dark:border-[#2A203C] hover:text-[#241B35] dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplateId === template.id;

          return (
            <div
              key={template.id}
              className={`group relative rounded-2xl bg-white dark:bg-[#1D162A] border transition-all duration-300 overflow-hidden flex flex-col ${
                isSelected
                  ? "border-[#9D6BFF] ring-2 ring-[#9D6BFF]/30 shadow-lg shadow-purple-500/15"
                  : "border-[#EDE7F6] dark:border-[#2A203C] hover:border-[#9D6BFF]/50 hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Preview Thumbnail Cover */}
              <div className={`relative h-48 w-full ${template.previewBg} p-4 flex flex-col justify-between overflow-hidden`}>
                
                {/* Badge */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                    {template.icon}
                    <span>{template.category}</span>
                  </div>

                  {template.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F47FB5] to-[#9D6BFF] text-white text-[10px] font-bold shadow-sm">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Inner Miniature Card */}
                <div className="self-center text-center p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white transform group-hover:scale-105 transition-transform duration-300">
                  <p className="font-display font-bold text-sm tracking-wide">{template.previewText}</p>
                  <p className="text-[10px] text-white/80 font-serif italic mt-0.5">Happy Birthday!</p>
                </div>

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
                  <button
                    onClick={() => onSelectTemplate(template.id)}
                    className="px-4 py-2 rounded-full bg-white text-[#7952D6] font-bold text-xs shadow-lg hover:bg-[#EDE7F6] cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <span>Use Template</span>
                  </button>
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-[#241B35] dark:text-[#F7F3FC]">
                      {template.name}
                    </h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[#9D6BFF] text-xs font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: template.accent }}
                    />
                    <span className="text-[11px] font-medium text-[#746B80] dark:text-[#B8AEC5]">
                      Theme Color
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTemplate(template.id)}
                    className={`text-xs font-bold cursor-pointer transition-colors ${
                      isSelected 
                        ? "text-[#7952D6] dark:text-[#9D6BFF]" 
                        : "text-[#746B80] dark:text-[#B8AEC5] hover:text-[#7952D6]"
                    }`}
                  >
                    {isSelected ? "Active" : "Apply →"}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
