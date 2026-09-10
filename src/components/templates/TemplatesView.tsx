import React, { useState } from "react";
import { Sparkles, Crown, PartyPopper, Moon, Music, Gift, Feather, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  badge?: string;
  previewBg: string;
  previewText: string;
  icon: React.ReactNode;
}

export const TEMPLATES_DATA: TemplateItem[] = [
  {
    id: "elegant",
    name: "Golden Elegance",
    category: "Elegant",
    description: "Refined lavender gold aesthetics with classical serif typography and subtle candlelight warmth.",
    accent: "#7952D6",
    badge: "Popular",
    previewBg: "bg-gradient-to-br from-[#2D1654] via-[#1F103A] to-[#120824]",
    previewText: "Elegant & Luxurious",
    icon: <Crown className="w-4 h-4 text-amber-300" />,
  },
  {
    id: "dreamy",
    name: "Dreamy Starlight",
    category: "Dreamy",
    description: "Soft celestial clouds, twinkling stars, and gentle pastel purple ambient gradients.",
    accent: "#9D6BFF",
    badge: "Trending",
    previewBg: "bg-gradient-to-br from-[#4338CA] via-[#6D28D9] to-[#C084FC]",
    previewText: "Clouds & Starlight",
    icon: <Moon className="w-4 h-4 text-purple-300" />,
  },
  {
    id: "romantic",
    name: "Sweet Romance",
    category: "Romantic",
    description: "Rose gold petals, soft bokeh lights, and warm heartfelt words of affection.",
    accent: "#F47FB5",
    badge: "Special",
    previewBg: "bg-gradient-to-br from-[#881337] via-[#BE123C] to-[#FB7185]",
    previewText: "Warm & Heartfelt",
    icon: <Heart className="w-4 h-4 text-rose-300" />,
  },
  {
    id: "fun",
    name: "Confetti Fiesta",
    category: "Fun",
    description: "Bursting confetti cascades, lively vibrant colors, and pure joyful celebration energy.",
    accent: "#EA580C",
    previewBg: "bg-gradient-to-br from-[#EA580C] via-[#F59E0B] to-[#EC4899]",
    previewText: "Joyful & Energetic",
    icon: <PartyPopper className="w-4 h-4 text-amber-300" />,
  },
  {
    id: "cute",
    name: "Pastel Sweetness",
    category: "Cute",
    description: "Playful balloons, cute gift wraps, and adorable celebration art for smiles.",
    accent: "#DB2777",
    previewBg: "bg-gradient-to-br from-[#F47FB5] via-[#A78BFA] to-[#93C5FD]",
    previewText: "Sweet & Adorable",
    icon: <Gift className="w-4 h-4 text-pink-300" />,
  },
  {
    id: "party",
    name: "Midnight Disco",
    category: "Party",
    description: "Neon rave lights, dark moody glow, and high-energy celebration music vibes.",
    accent: "#A855F7",
    badge: "Hot",
    previewBg: "bg-gradient-to-br from-[#1E1B4B] via-[#4C1D95] to-[#BE185D]",
    previewText: "Neon & High Energy",
    icon: <Music className="w-4 h-4 text-purple-300" />,
  },
  {
    id: "minimal",
    name: "Modern Minimalist",
    category: "Minimal",
    description: "Crisp whitespace, timeless typography, and subtle micro-accents for understated elegance.",
    accent: "#4B5563",
    previewBg: "bg-gradient-to-br from-[#1F2937] via-[#374151] to-[#6B7280]",
    previewText: "Clean & Modern",
    icon: <Feather className="w-4 h-4 text-gray-300" />,
  },
];

interface TemplatesViewProps {
  onSelectTemplate: (template: TemplateItem) => void;
  selectedTemplateId?: string;
  searchQuery?: string;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplate,
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
    <div className="w-full max-w-7xl mx-auto space-y-8 text-left animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7F6] dark:border-[#251B35]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            Visual Style Templates
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Pick from curated artistic directions handcrafted for emotion and celebration.
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#7952D6] text-white font-bold shadow-xs"
                  : "bg-white dark:bg-[#1D162A] text-[#746B80] dark:text-[#B8AEC5] border border-[#EDE7F6] dark:border-[#251B35] hover:text-[#241B35]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            {/* Template Banner Preview */}
            <div className={`h-36 ${template.previewBg} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                  {template.category}
                </span>
                {template.badge && (
                  <Badge variant="primary">{template.badge}</Badge>
                )}
              </div>
              <div className="text-white font-display font-bold text-base tracking-wide z-10">
                {template.previewText}
              </div>
            </div>

            {/* Template Info Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-[#241B35] dark:text-[#F7F3FC]">
                  {template.name}
                </h3>
                <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1.5 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => onSelectTemplate(template)}
                className="w-full"
              >
                Use This Template
              </Button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
