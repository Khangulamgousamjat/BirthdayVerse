// Upcoming Birthdays management with persistent localStorage support

export interface UpcomingBirthday {
  id: string;
  name: string;
  rawDate: string; // YYYY-MM-DD
  date: string; // formatted e.g. "Sep 20"
  month: string;
  day: number;
  rel: string;
  daysLeft: number;
  avatar: string;
  reminder?: string;
}

const STORAGE_KEY = "birthdayverse_upcoming_birthdays";
const CHANGE_EVENT = "birthdayverse_birthdays_updated";

const RELATIONSHIP_AVATARS: Record<string, string> = {
  "Best Friend": "🌸",
  "Partner": "💖",
  "Sister": "🎀",
  "Brother": "⚡",
  "Mother": "💐",
  "Father": "👑",
  "Colleague": "💼",
  "Friend": "🎉",
  "Other": "🎂",
};

export function getAvatarForRel(rel: string): string {
  return RELATIONSHIP_AVATARS[rel] || "🎂";
}

export function calculateDaysLeft(rawDate: string): number {
  if (!rawDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let targetMonth: number;
  let targetDay: number;

  if (rawDate.includes("-")) {
    const parts = rawDate.split("-");
    if (parts.length === 3) {
      targetMonth = parseInt(parts[1], 10) - 1;
      targetDay = parseInt(parts[2], 10);
    } else {
      targetMonth = parseInt(parts[0], 10) - 1;
      targetDay = parseInt(parts[1], 10);
    }
  } else {
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return 0;
    targetMonth = parsed.getMonth();
    targetDay = parsed.getDate();
  }

  let nextBday = new Date(today.getFullYear(), targetMonth, targetDay);
  if (nextBday.getTime() < today.getTime()) {
    nextBday = new Date(today.getFullYear() + 1, targetMonth, targetDay);
  }

  const diffMs = nextBday.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getStoredBirthdays(): UpcomingBirthday[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: UpcomingBirthday[] = JSON.parse(raw);
    // Recalculate daysLeft dynamically on every load
    const updated = list.map((item) => ({
      ...item,
      daysLeft: item.rawDate ? calculateDaysLeft(item.rawDate) : item.daysLeft,
      avatar: item.avatar || getAvatarForRel(item.rel),
    }));
    // Sort ascending by daysLeft
    return updated.sort((a, b) => a.daysLeft - b.daysLeft);
  } catch {
    return [];
  }
}

export function saveBirthday(birthday: Omit<UpcomingBirthday, "id" | "daysLeft" | "avatar">): UpcomingBirthday {
  const current = getStoredBirthdays();
  const daysLeft = calculateDaysLeft(birthday.rawDate);
  const avatar = getAvatarForRel(birthday.rel);

  const newEntry: UpcomingBirthday = {
    ...birthday,
    id: Date.now().toString(),
    daysLeft,
    avatar,
  };

  const updated = [...current, newEntry].sort((a, b) => a.daysLeft - b.daysLeft);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return newEntry;
}

export function deleteBirthday(id: string): void {
  const current = getStoredBirthdays();
  const filtered = current.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function onBirthdaysChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
