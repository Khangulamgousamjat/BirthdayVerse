# ✨ Birthdayverse — Premium Digital Birthday Experience Builder

> **Make Every Birthday Magical ✨**

A world-class, cinematic, web-based birthday experience platform designed around one core idea: **The creator interface should be clean and professional, while the final birthday page should be magical and emotional.**

Built with **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **Firebase**, offering real-time live previewing, interactive polaroids, confetti physics, curated audio soundtrack libraries, and an automated data lifecycle.

---

## 📖 Table of Contents
- [🌟 Design Philosophy & System](#-design-philosophy--system)
  - [1. Color Foundation](#1-color-foundation)
  - [2. Typography](#2-typography)
- [✨ Key User Experience & Flows](#-key-user-experience--flows)
  - [1. Creator Studio (Home Screen `/`)](#1-creator-studio-home-screen-)
  - [2. Live Interactive Preview Frame](#2-live-interactive-preview-frame)
  - [3. Dedicated Template Library](#3-dedicated-template-library)
  - [4. My Wishes Dashboard](#4-my-wishes-dashboard)
  - [5. Recipient Journey (Surprise Page `/surprise/:id`)](#5-recipient-journey-surprise-page-surpriseid)
- [🛠️ Tech Stack & Styling System](#️-tech-stack--styling-system)
- [📂 Codebase Structure](#-codebase-structure)
- [💾 Data Architecture & Schema](#-data-architecture--schema)
  - [Firestore Document Schema (`surprises` collection)](#firestore-document-schema-surprises-collection)
  - [Storage Assets Directory](#storage-assets-directory)
- [⚙️ Technical Workflows & Performance Details](#️-technical-workflows--performance-details)
  - [1. Performance-Optimized Image Handling](#1-performance-optimized-image-handling)
  - [2. File Expiration & Self-Cleaning Lifecycle (48-Hour TTL)](#2-file-expiration--self-cleaning-lifecycle-48-hour-ttl)
  - [3. Browser Audio Autoplay Workaround](#3-browser-audio-autoplay-workaround)
  - [4. Pointer-based Canvas Confetti Injection](#4-pointer-based-canvas-confetti-injection)
- [📦 Installation & Environment Setup](#-installation--environment-setup)
- [🚀 Deployment](#-deployment)

---

## 🌟 Design Philosophy & System

### 1. Color Foundation

* **Primary:** `#9D6BFF` (Lavender Purple), `#7952D6` (Deep Purple)
* **Light Mode:** `#EDE7F6` (Pale Mist Lavender), `#F8F6FC` (Background), `#FFFFFF` (Cards)
* **Dark Mode:** `#100C18` (Background), `#171122` (Secondary), `#1D162A` (Cards), `#251B35` (Elevated Cards)
* **Text:** `#241B35` (Light mode), `#F7F3FC` (Dark mode), `#746B80` (Muted light), `#B8AEC5` (Muted dark)
* **Celebration Accents:** Pink `#F47FB5`, Gold `#E7B85C`, Mint `#9AD8C2`

### 2. Typography

* **Main UI:** Inter / Manrope / DM Sans for navigation, buttons, forms, labels, and dashboard controls.
* **Special Headings:** Playfair Display for birthday messages, hero headings, and recipient reveals.

---

## ✨ Key User Experience & Flows

### 1. Creator Studio (Home Screen `/`)
* **Two-Column Studio Layout:** Left/Center 8-step creator workflow alongside an always-visible, real-time live preview.
* **8-Step Guided Workflow:**
  1. **Recipient:** Name, relationship, optional nickname, profile photo, and vibe selection (Elegant, Fun, Romantic, Cute, Dreamy, Party).
  2. **Message:** Personal letter editor, character counter, AI-style message suggestions (Heartfelt, Nostalgic, Playful, Short & Sweet), and finale headline.
  3. **Photos:** Add memories, preview polaroid photo cards, and manage gallery.
  4. **Music:** Searchable audio library (Coldplay, acoustic piano, lo-fi slowed, classic birthday) with play/pause preview.
  5. **Theme:** Select artistic template styles.
  6. **Customize:** Switch between light, dark, or auto themes, accent colors, and animation levels.
  7. **Preview:** Complete preview verification before publishing.
  8. **Share:** Instant link generation, 1-click clipboard copy, WhatsApp direct share, native mobile share, and QR code modal.

### 2. Live Interactive Preview Frame
* Features a high-fidelity mobile device mockup with camera island and battery/wifi status bar.
* Real-time synchronized updates of recipient name, personal message, polaroid memories, and bottom music controller card.
* Quick toggles for mobile vs. desktop preview frame and live audio playback in preview.

### 3. Dedicated Template Library
* Browse curated styles: All, Elegant, Romantic, Fun, Cute, Party, Minimal.
* One-click "Use Template" action to immediately populate creator settings.

### 4. My Wishes Dashboard
* Track created celebrations, views, and reaction hearts.
* Statuses: Draft, Published, Scheduled, Expired.
* Friendly empty state for first-time creators.

### 5. Recipient Journey (Surprise Page `/surprise/:id`)
* **Scene 0 (The Gatekeeper):** Interactive gift box/envelope bypasses browser audio autoplay restrictions.
* **Scene 1 (The Preface):** Soft blurred cinematic intro.
* **Scene 2 (The Name Reveal):** Playfair serif gold reveal with ambient particle glow.
* **Scene 3 (The Personal Letter):** Word-by-word typewriter narrative.
* **Scene 4 (Interactive Heart):** Confetti burst eruptions under pointer/tap coordinates.
* **Scene 5 (The Climax):** Photo memory reveal, halo rings, and dual confetti stream fountains.
* **Scene 6 (Make a Wish Cake):** Interactive birthday cake with glowing candles that extinguish when tapped.

---

## 🛠️ Tech Stack & Styling System

* **Frontend Engine:** React 19, Vite, TypeScript
* **Routing:** React Router DOM v7
* **Animations:** Framer Motion (`AnimatePresence`, spring physics), `canvas-confetti`
* **Database & Media:** Firebase v12+ (Cloud Firestore, Cloud Storage)
* **Styling Foundation:** Tailwind CSS v4, PostCSS, HSL custom properties

---

## 📂 Codebase Structure

```
Birthdayverse/
├── public/                 # Static audio tracks & background video
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx            # Sticky brand navbar with tabs and theme toggle
│   │   ├── preview/
│   │   │   └── LivePhonePreview.tsx  # Interactive mobile mockup preview
│   │   ├── templates/
│   │   │   └── TemplatesView.tsx     # Phase 8 template gallery
│   │   ├── wishes/
│   │   │   └── MyWishesView.tsx      # Phase 14 & 16 dashboard and empty state
│   │   ├── explore/
│   │   │   └── ExploreView.tsx       # Phase 4 landing & feature explore
│   │   └── ui/
│   │       └── Button.tsx            # Framer Motion animated glass button
│   ├── context/
│   │   └── ThemeContext.tsx          # Light / Dark mode state provider
│   ├── lib/
│   │   ├── db.ts                     # Firestore & Firebase Storage controller
│   │   ├── firebase.ts               # Firebase client configuration
│   │   └── utils.ts                  # Tailwind class merge helper
│   ├── pages/
│   │   ├── Home.tsx                  # 8-step creator studio
│   │   └── Surprise.tsx              # Recipient cinematic birthday player
│   ├── App.tsx                       # App layout, ThemeProvider, and routing
│   ├── main.tsx                      # Root entry
│   └── index.css                     # Design tokens, typography & animation utilities
├── tsconfig.json
└── vite.config.ts
```

---

## 💾 Data Architecture & Schema

### Firestore Document Schema (`surprises` collection)

```typescript
type SurpriseData = {
  short_id: string;      // Unique 8-character ID matching Firestore Doc ID
  name: string;          // Recipient name
  message: string;       // JSON-serialized string with body, finaleText, selectedMusic, theme, etc.
  image_path?: string;   // Firebase Storage download URL for photo
  music_path?: string;   // Firebase Storage download URL for custom music
  created_at: string;    // ISO timestamp
  view_count?: number;   // Total times opened
  reactions?: number;    // Heart reactions
}
```

### File Expiration (48-Hour TTL)
To conserve cloud database storage, records older than 48 hours are automatically pruned upon retrieval.
