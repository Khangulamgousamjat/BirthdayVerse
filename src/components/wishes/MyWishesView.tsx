import React, { useState, useEffect } from "react";
import { Plus, Gift, Eye, Copy, ExternalLink, Trash2, Calendar, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface WishCardData {
  id: string;
  name: string;
  relationship?: string;
  date: string;
  status: "Published" | "Draft" | "Scheduled" | "Expired";
  url?: string;
  views?: number;
  reactions?: number;
}

interface MyWishesViewProps {
  onCreateNew: () => void;
  onEditWish?: (wish: WishCardData) => void;
}

const DEFAULT_SAMPLE_WISHES: WishCardData[] = [
  {
    id: "aanya-sample",
    name: "Aanya",
    relationship: "Best Friend",
    date: "Sep 20",
    status: "Published",
    url: "/surprise/aanya-sample",
    views: 14,
    reactions: 9,
  },
  {
    id: "rahul-draft",
    name: "Rahul",
    relationship: "Brother",
    date: "Oct 05",
    status: "Draft",
    views: 0,
    reactions: 0,
  }
];

export const MyWishesView: React.FC<MyWishesViewProps> = ({ onCreateNew }) => {
  const [wishes, setWishes] = useState<WishCardData[]>(() => {
    const saved = localStorage.getItem("birthdayverse_my_wishes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SAMPLE_WISHES;
      }
    }
    return DEFAULT_SAMPLE_WISHES;
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("birthdayverse_my_wishes", JSON.stringify(wishes));
  }, [wishes]);

  const handleDelete = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
  };

  const handleCopyLink = (url?: string, id?: string) => {
    if (!url) return;
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-left animate-in fade-in duration-300">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7F6] dark:border-[#251B35]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            My Birthday Verses
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Manage your created birthday experiences, track views, and share live links.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onCreateNew}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Verse
        </Button>
      </div>

      {/* Wishes List or Empty State */}
      {wishes.length === 0 ? (
        <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#EDE7F6] dark:bg-[#251B35] flex items-center justify-center text-3xl text-[#7952D6] dark:text-[#9D6BFF]">
            🎂
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#241B35] dark:text-[#F7F3FC] font-display">
              No birthday verses created yet
            </h2>
            <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mt-1 leading-relaxed">
              Create your first personalized birthday experience with photos, music, and heartwarming words.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={onCreateNew}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Create Your First Verse
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="rounded-3xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#251B35] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#241B35] dark:text-[#F7F3FC]">
                      {wish.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#746B80] dark:text-[#B8AEC5] mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{wish.date}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      wish.status === "Published"
                        ? "success"
                        : wish.status === "Draft"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {wish.status}
                  </Badge>
                </div>

                {wish.relationship && (
                  <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] bg-[#EDE7F6]/50 dark:bg-[#251B35]/60 px-3 py-1 rounded-xl w-fit">
                    Relationship: <span className="font-semibold text-[#241B35] dark:text-[#F7F3FC]">{wish.relationship}</span>
                  </p>
                )}

                {wish.status === "Published" && (
                  <div className="flex items-center gap-4 text-xs text-[#746B80] dark:text-[#B8AEC5] pt-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#9D6BFF]" />
                      <span>{wish.views || 0} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E7B85C]" />
                      <span>{wish.reactions || 0} loves</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#EDE7F6] dark:border-[#251B35]/60">
                <div className="flex items-center gap-1.5">
                  {wish.url && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyLink(wish.url, wish.id)}
                        leftIcon={copiedId === wish.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        className="text-[11px] h-8 px-3"
                      >
                        {copiedId === wish.id ? "Copied" : "Copy"}
                      </Button>
                      <a
                        href={wish.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#EDE7F6]/60 dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] hover:bg-[#7952D6] hover:text-white transition-all inline-flex items-center justify-center"
                        title="Open surprise"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(wish.id)}
                  className="p-2 rounded-xl text-[#746B80] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Delete from list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
