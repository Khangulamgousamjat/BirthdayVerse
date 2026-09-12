import React, { useState, useEffect } from "react";
import { Plus, Gift, Eye, Copy, ExternalLink, Trash2, Calendar, Sparkles, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSurpriseData } from "@/lib/db";

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

export const MyWishesView: React.FC<MyWishesViewProps> = ({ onCreateNew }) => {
  const [wishes, setWishes] = useState<WishCardData[]>(() => {
    const saved = localStorage.getItem("birthdayverse_my_wishes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filter out any old demo/sample entries that don't have real IDs
        return parsed.filter((w: WishCardData) =>
          w.id && w.id !== "aanya-sample" && w.id !== "rahul-draft"
        );
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem("birthdayverse_my_wishes", JSON.stringify(wishes));
  }, [wishes]);

  // Sync live stats (views + reactions) from Firestore for all published wishes
  const syncLiveStats = async () => {
    const publishedWishes = wishes.filter((w) => w.status === "Published" && w.id);
    if (publishedWishes.length === 0) return;
    setIsSyncing(true);
    try {
      const updates = await Promise.all(
        publishedWishes.map(async (w) => {
          try {
            const data = await getSurpriseData(w.id);
            if (data) {
              return { id: w.id, views: data.view_count ?? w.views, reactions: data.reactions ?? w.reactions };
            }
            // If null returned, link may be expired
            return { id: w.id, views: w.views, reactions: w.reactions, expired: true };
          } catch {
            return null;
          }
        })
      );
      setWishes((prev) =>
        prev.map((w) => {
          const upd = updates.find((u) => u?.id === w.id);
          if (!upd) return w;
          return {
            ...w,
            views: upd.views ?? w.views,
            reactions: upd.reactions ?? w.reactions,
          };
        })
      );
    } catch {
      // silently ignore
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync on mount
  useEffect(() => {
    syncLiveStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DFFA] dark:border-[#282038]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#211A30] dark:text-[#F9F7FD]">
            My Birthday Verses
          </h1>
          <p className="text-xs sm:text-sm text-[#736886] dark:text-[#A89EC0] mt-1">
            Manage your created birthday experiences, track views, and share live links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={syncLiveStats}
            disabled={isSyncing}
            title="Refresh views & reactions"
            className="p-2 rounded-xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] text-[#7659E4] dark:text-[#A28DF8] hover:bg-[#F1EBFD] dark:hover:bg-[#261F36] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
          <Button
            variant="primary"
            size="md"
            onClick={onCreateNew}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Verse
          </Button>
        </div>
      </div>

      {/* Wishes List or Empty State */}
      {wishes.length === 0 ? (
        <div className="text-center py-16 px-4 max-w-md mx-auto flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F1EBFD] dark:bg-[#261F36] flex items-center justify-center text-3xl text-[#7659E4] dark:text-[#C495C8]">
            🎂
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#211A30] dark:text-[#F9F7FD] font-display">
              No birthday verses created yet
            </h2>
            <p className="text-xs text-[#736886] dark:text-[#A89EC0] mt-1 leading-relaxed">
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
              className="rounded-3xl bg-white dark:bg-[#1E182A] border border-[#E8DFFA] dark:border-[#282038] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-[#211A30] dark:text-[#F9F7FD]">
                      {wish.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#736886] dark:text-[#A89EC0] mt-0.5">
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
                  <p className="text-xs text-[#736886] dark:text-[#A89EC0] bg-[#F1EBFD]/50 dark:bg-[#261F36]/60 px-3 py-1 rounded-xl w-fit">
                    Relationship: <span className="font-semibold text-[#211A30] dark:text-[#F9F7FD]">{wish.relationship}</span>
                  </p>
                )}

                {wish.status === "Published" && (
                  <div className="flex items-center gap-4 text-xs text-[#736886] dark:text-[#A89EC0] pt-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#8E72F0]" />
                      <span>{wish.views || 0} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E0A842]" />
                      <span>{wish.reactions || 0} loves</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E8DFFA] dark:border-[#282038]/60">
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
                        className="p-2 rounded-xl bg-[#F1EBFD] dark:bg-[#261F36] text-[#7659E4] dark:text-[#C495C8] hover:bg-[#7659E4] hover:text-white transition-all inline-flex items-center justify-center"
                        title="Open surprise"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(wish.id)}
                  className="p-2 rounded-xl text-[#736886] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
