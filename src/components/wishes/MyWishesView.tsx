import React, { useState, useEffect } from "react";
import { Plus, Gift, Eye, Copy, ExternalLink, Trash2, Calendar, Sparkles, CheckCircle2, Clock } from "lucide-react";

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
    id: "ananya-bday",
    name: "Ananya",
    relationship: "Best Friend",
    date: "Sep 20",
    status: "Published",
    url: "/surprise/ananya-bday",
    views: 14,
    reactions: 9,
  },
  {
    id: "rohit-draft",
    name: "Rohit",
    relationship: "Brother",
    date: "Oct 05",
    status: "Draft",
    views: 0,
    reactions: 0,
  },
  {
    id: "priya-surprise",
    name: "Priya",
    relationship: "Partner",
    date: "Nov 12",
    status: "Scheduled",
    views: 0,
    reactions: 0,
  }
];

export const MyWishesView: React.FC<MyWishesViewProps> = ({ onCreateNew, onEditWish }) => {
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

  const getStatusBadge = (status: WishCardData["status"]) => {
    switch (status) {
      case "Published":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Draft":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Scheduled":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Expired":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE7F6] dark:border-[#251B35] mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#241B35] dark:text-[#F7F3FC]">
            My Birthday Wishes
          </h1>
          <p className="text-xs sm:text-sm text-[#746B80] dark:text-[#B8AEC5] mt-1">
            Manage your created birthday experiences, track views, and edit live surprises.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="bv-gradient-btn px-5 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer w-fit shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New</span>
        </button>
      </div>

      {/* Wishes List or Empty State */}
      {wishes.length === 0 ? (
        /* Phase 16: Empty State */
        <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#EDE7F6] dark:bg-[#251B35] flex items-center justify-center text-3xl mb-4 text-[#7952D6] dark:text-[#9D6BFF]">
            🎂
          </div>
          <h2 className="text-xl font-bold text-[#241B35] dark:text-[#F7F3FC] mb-2 font-display">
            No birthday wishes yet.
          </h2>
          <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mb-6 leading-relaxed">
            Create your first magical birthday experience with photos, music, and personalized words.
          </p>
          <button
            onClick={onCreateNew}
            className="bv-gradient-btn px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Birthday Wish</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="group rounded-2xl bg-white dark:bg-[#1D162A] border border-[#EDE7F6] dark:border-[#2A203C] p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <h3 className="font-bold text-base text-[#241B35] dark:text-[#F7F3FC]">
                        {wish.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#746B80] dark:text-[#B8AEC5]">
                        <Calendar className="w-3 h-3" />
                        <span>Birthday · {wish.date}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(wish.status)}`}>
                    {wish.status}
                  </span>
                </div>

                {wish.relationship && (
                  <p className="text-xs text-[#746B80] dark:text-[#B8AEC5] mb-4 bg-[#EDE7F6]/40 dark:bg-[#251B35]/50 px-3 py-1.5 rounded-xl w-fit">
                    Relationship: <span className="font-semibold text-[#241B35] dark:text-[#F7F3FC]">{wish.relationship}</span>
                  </p>
                )}

                {/* View count & Loves metrics */}
                {wish.status === "Published" && (
                  <div className="flex items-center gap-4 text-xs text-[#746B80] dark:text-[#B8AEC5] my-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#9D6BFF]" />
                      <span>{wish.views || 0} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[#F47FB5]">💖</span>
                      <span>{wish.reactions || 0} loves</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-[#EDE7F6] dark:border-[#251B35] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditWish?.(wish)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDE7F6] dark:bg-[#251B35] text-[#7952D6] dark:text-[#9D6BFF] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Edit
                  </button>

                  {wish.url && (
                    <a
                      href={wish.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EDE7F6] dark:bg-[#251B35] text-[#241B35] dark:text-[#F7F3FC] hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {wish.url && (
                    <button
                      onClick={() => handleCopyLink(wish.url, wish.id)}
                      className="p-1.5 rounded-lg text-[#746B80] dark:text-[#B8AEC5] hover:text-[#7952D6] hover:bg-[#EDE7F6] dark:hover:bg-[#251B35] transition-colors cursor-pointer"
                      title="Copy Link"
                    >
                      {copiedId === wish.id ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(wish.id)}
                    className="p-1.5 rounded-lg text-[#746B80] dark:text-[#B8AEC5] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete Wish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
