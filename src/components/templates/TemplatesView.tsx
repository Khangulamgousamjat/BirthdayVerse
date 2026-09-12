import React, { useState } from "react";
import { Sparkles, Crown, PartyPopper, Moon, Music, Gift, Feather, Heart, Zap, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TEMPLATES_DATA, VisualTemplate } from "@/lib/templates";

export type TemplateItem = VisualTemplate;
export { TEMPLATES_DATA };

interface TemplatesViewProps {
  onSelectTemplate: (template: VisualTemplate) => void;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFFA] dark:border-[#282038]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#211A30] dark:text-[#F9F7FD]">
            Visual Style Templates
          </h1>
          <p className="text-xs sm:text-sm text-[#736886] dark:text-[#A89EC0] mt-1">
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
                  ? "bg-[#7659E4] text-white font-bold shadow-xs"
                  : "bg-white dark:bg-[#1E182A] text-[#736886] dark:text-[#A89EC0] border border-[#E8DFFA] dark:border-[#282038] hover:text-[#211A30]"
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
            className="rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
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
                <h3 className="text-base font-bold text-[#211A30] dark:text-[#F9F7FD]">
                  {template.name}
                </h3>
                <p className="text-xs text-[#736886] dark:text-[#A89EC0] mt-1.5 leading-relaxed">
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
