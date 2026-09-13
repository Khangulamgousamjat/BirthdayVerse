export interface Soundtrack {
  id: string;
  file: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
}

export const SOUNDTRACK_CATEGORIES = [
  "Popular",
  "Happy",
  "Romantic",
  "Calm",
  "Energetic",
  "Party",
  "Upload",
] as const;

export const SOUNDTRACKS: Soundtrack[] = [
  {
    id: "Coldplay - A Sky Full of Stars",
    file: "/funky groovin.mp3",
    title: "A Sky Full of Stars",
    artist: "Coldplay",
    duration: "4:28",
    category: "Popular",
  },
  {
    id: "/Happy Birthday Song.mp3",
    file: "/Happy Birthday Song.mp3",
    title: "Classic Happy Birthday",
    artist: "Birthdayverse Mix",
    duration: "2:54",
    category: "Happy",
  },
  {
    id: "/happy birthday slowed.mp3",
    file: "/happy birthday slowed.mp3",
    title: "Happy Birthday (Lo-Fi Slowed)",
    artist: "Chill Midnight Mix",
    duration: "1:23",
    category: "Calm",
  },
  {
    id: "/pianocafe.mp3",
    file: "/pianocafe.mp3",
    title: "Acoustic Piano Cafe",
    artist: "Acoustic Cafe",
    duration: "3:10",
    category: "Calm",
  },
  {
    id: "/romantic.mp3",
    file: "/romantic.mp3",
    title: "Romantic Strings & Cello",
    artist: "Sweet Melodies",
    duration: "3:45",
    category: "Romantic",
  },
  {
    id: "/funky groovin.mp3",
    file: "/funky groovin.mp3",
    title: "Funky Groovin Disco",
    artist: "Groove Party",
    duration: "2:15",
    category: "Energetic",
  },
  {
    id: "/playhouse.mp3",
    file: "/playhouse.mp3",
    title: "Playhouse Celebration",
    artist: "Playful Pop",
    duration: "2:30",
    category: "Happy",
  },
  {
    id: "golden_sunset",
    file: "/pianocafe.mp3",
    title: "Golden Sunset Chords",
    artist: "Acoustic Warmth",
    duration: "3:15",
    category: "Calm",
  },
  {
    id: "dreamy_starlight",
    file: "/happy birthday slowed.mp3",
    title: "Dreamy Starlight Lullaby",
    artist: "Celestial Music Box",
    duration: "2:40",
    category: "Romantic",
  },
  {
    id: "confetti_pop",
    file: "/playhouse.mp3",
    title: "Celebration Confetti Pop",
    artist: "Festival Beats",
    duration: "2:50",
    category: "Happy",
  },
  {
    id: "sweet_serenade",
    file: "/romantic.mp3",
    title: "Sweet Rose Serenade",
    artist: "Violin Ensemble",
    duration: "3:20",
    category: "Romantic",
  },
  {
    id: "neon_dance",
    file: "/funky groovin.mp3",
    title: "Neon Midnight Dance",
    artist: "Club Party Remix",
    duration: "2:45",
    category: "Party",
  },
  {
    id: "bollywood_dhol",
    file: "/Happy Birthday Song.mp3",
    title: "Bollywood Dhol Celebration",
    artist: "Desi Festive Mix",
    duration: "3:30",
    category: "Party",
  },
  {
    id: "peaceful_morning",
    file: "/pianocafe.mp3",
    title: "Peaceful Morning Light",
    artist: "Zen Meditation Piano",
    duration: "3:05",
    category: "Calm",
  },
  {
    id: "joyful_ukulele",
    file: "/playhouse.mp3",
    title: "Joyful Ukulele Whistle",
    artist: "Sunshine Acoustic",
    duration: "2:25",
    category: "Energetic",
  },
  {
    id: "none",
    file: "none",
    title: "No Music (Silent Experience)",
    artist: "Muted Experience",
    duration: "—",
    category: "Calm",
  },
];

/**
 * Resolves any soundtrack identifier, preset ID, storage URL, or custom file path
 * to a browser-safe, encoded, playable audio URL.
 */
export function resolveSoundtrackUrl(trackIdOrUrl?: string | null): string {
  if (!trackIdOrUrl || trackIdOrUrl === "none") {
    return "";
  }

  // If it's already a full remote URL (Firebase Storage, HTTPS, blob preview URL, or data URL)
  if (
    trackIdOrUrl.startsWith("http://") ||
    trackIdOrUrl.startsWith("https://") ||
    trackIdOrUrl.startsWith("blob:") ||
    trackIdOrUrl.startsWith("data:")
  ) {
    return trackIdOrUrl;
  }

  // Look up in curated SOUNDTRACKS list
  const found = SOUNDTRACKS.find(
    (s) => s.id === trackIdOrUrl || s.file === trackIdOrUrl
  );

  let rawPath = found ? found.file : trackIdOrUrl;

  // If it's "none"
  if (rawPath === "none") {
    return "";
  }

  // If rawPath doesn't start with a slash and doesn't look like a path, fallback to default
  if (!rawPath.startsWith("/") && !rawPath.includes(".")) {
    rawPath = "/Happy Birthday Song.mp3";
  }

  // Encode spaces and special characters for mobile browser compatibility
  return encodeURI(rawPath);
}

/**
 * Get track metadata by ID or URL
 */
export function getSoundtrackMeta(trackIdOrUrl?: string | null): {
  title: string;
  artist: string;
  duration: string;
} {
  if (!trackIdOrUrl || trackIdOrUrl === "none") {
    return {
      title: "No Music",
      artist: "Muted Experience",
      duration: "—",
    };
  }

  const found = SOUNDTRACKS.find(
    (s) => s.id === trackIdOrUrl || s.file === trackIdOrUrl
  );
  if (found) {
    return {
      title: found.title,
      artist: found.artist,
      duration: found.duration,
    };
  }

  if (
    trackIdOrUrl.startsWith("http://") ||
    trackIdOrUrl.startsWith("https://") ||
    trackIdOrUrl.startsWith("blob:")
  ) {
    return {
      title: "Custom Uploaded Song",
      artist: "Personal Soundtrack",
      duration: "Custom",
    };
  }

  return {
    title: "Birthday Soundtrack",
    artist: "BirthdayVerse Mix",
    duration: "3:00",
  };
}
