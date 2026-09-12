# 🎂 BirthdayVerse — Premium Digital Birthday Experience Platform

<div align="center">

### *Make Every Birthday Magical, Emotional & Unforgettable ✨*

[![React 19](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

---

**[🌐 Live Demo](https://birthdayverse-gk.vercel.app)** • **[🛠️ Admin Console](https://birthdayverse-gk.vercel.app/admin)** • **[📖 Documentation](#-table-of-contents)**

</div>

---

## 🌟 Overview

**BirthdayVerse** is a modern, cinematic web platform engineered to transform ordinary birthday text messages into deeply emotional, personalized digital celebrations. Built with a dual-philosophy design system:

> **For Creators:** A clean, intuitive, and professional 8-step studio with real-time live mobile previewing.  
> **For Recipients:** A magical, full-screen cinematic journey featuring interactive unwrapping, dynamic typewriting, interactive multi-photo polaroids, blowable birthday candles, floating love hearts, and celebratory confetti cannons.
## ✨ Key Features & Capabilities

### 1. 8-Step Creator Studio
A cohesive, state-of-the-art workflow guiding creators through every dimension of the experience:
1. **Experience Format:** Pick between *Cinematic Verse*, *Memory Book*, or *Animated Video* styles.
2. **Visual Theme:** Select curated aesthetic templates (Midnight Luxury, Rose Gold Dream, Neon Cyber, Golden Hour, Pastel Dream, Sunset Glow).
3. **Recipient Profile:** Enter recipient name, relationship (Bestie, Partner, Sibling, Parent, Mentor), and optional nickname.
4. **Message Composer:** Markdown-friendly personal letter editor with live character counter and instant AI-vibe prompt suggestions.
5. **Photo Memories (Up to 6 Photos):** Multi-photo file uploader with real-time compression, cover photo selector, and swipeable gallery preview.
6. **Soundtrack Selector:** Multi-genre audio library (Acoustic Piano, Lo-Fi Chill, Coldplay-inspired melodies, Classic Birthday Song) or custom MP3 upload.
7. **Theme Styling:** Dynamic accent color pickers and background contrast tuning.
8. **Publish & Privacy:** Choose between 72-Hour Ephemeral Self-Purge or Keep Forever, with instant short-link generation, 1-click clipboard copy, WhatsApp share, and downloadable vector QR codes.

---

### 2. Live Interactive Phone Preview
- **Real-Time Synchronization:** Every change made in the form immediately reflects inside a high-fidelity iPhone mockup frame.
- **Interactive Audio Controller:** Test soundtrack playback with real-time play/pause controls right inside the preview.
- **Dual Viewports:** Toggle seamlessly between desktop inspection and mobile phone viewports.
- **Swipeable Polaroid Stack:** Swipe through attached memory cards directly in the preview.

---

### 3. 8-Scene Cinematic Recipient Experience
When the recipient opens `/surprise/:id`, they are treated to a full-screen interactive cinematic journey:
- **Scene 0 (The Gatekeeper / Gift Box):** Interactive 3D gift box with pulsing glow that unwrap upon tap, bypassing modern browser audio autoplay restrictions smoothly.
- **Scene 1 (The Preface):** Soft, ambient gradient intro with dynamic particle stars and mood setting.
- **Scene 2 (Grand Name Reveal):** Dramatic golden typography reveal highlighting the recipient's name and nickname.
- **Scene 3 (Typewriter Love Letter):** Emotional word-by-word narrative message revealed in authentic typewriter rhythm.
- **Scene 4 (Multi-Photo Memory Gallery):** Swipeable polaroid gallery with high-res photos, touch gestures, and photo indicator pills.
- **Scene 5 (Interactive Birthday Cake):** Illustrated birthday cake with glowing animated candle flames that blow out when tapped.
- **Scene 6 (Love Reaction Explosion):** Interactive reaction heart counter triggering physics-based multi-colored confetti cascades across the viewport.
- **Scene 7 (Grand Finale & Keepsake):** Final golden fireworks, downloadable keepsake card, and instant social sharing.

---

### 4. Client-Side Image Optimizer
To guarantee lightning-fast page loads and strictly prevent Firestore's **1MB (1,048,576 byte) document limit** from ever triggering:
- **Automatic In-Browser Resizing:** Canvas-based intelligent downscaling scales high-res 4K/iPhone camera photos to 540px–720px at high-quality bicubic smoothing.
- **Strict Budget Capping:** All 6 photos combined are mathematically budgeted to **under ~260,000 base64 characters (~190 KB)**, leaving more than 800 KB of free buffer in Firestore.
- **Zero Redundancy:** Prevents duplicating primary photos across both `image_path` and `message` payload.
- **Graceful Fallback:** If Firebase Storage is unavailable or restricted by security rules, the optimized base64 payload delivers full functionality seamlessly.

---

### 5. Master Admin Control Center (`/admin`)
Private administrative dashboard for platform operators:
- **Key Metrics Overview:** Total celebrations created, cumulative views, heart reactions, and active vs. expired verses.
- **Traffic Trends:** 7-day visual bar charts tracking platform engagement.
- **Recent Verses Table:** Real-time inspectable table of created verses with direct link previews and instant purge actions.
- **Persistent Password Management:** Secure admin authentication with PBKDF2/SHA-256 salted hashing stored directly in Firestore, allowing password changes from anywhere without container state loss.

---

### 6. Ephemeral Privacy & Data Retention
- **72-Hour Privacy Promise:** Verses automatically self-destruct after 72 hours by default.
- **Keep Forever Option:** Creators can elect to lock precious memories permanently.
- **Instant Client Purge:** Expired records are automatically removed from database storage upon access verification.

---

## 🎨 Design System & Aesthetics

### Curated Color Palettes
| Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Electric Purple** | `#9D6BFF` | Brand Primary, Glow accents, CTA buttons |
| **Deep Lavender** | `#7952D6` | Primary hover states, headers |
| **Midnight Base** | `#100C18` | Dark mode background |
| **Obsidian Card** | `#1D162A` | Elevated containers, phone frames |
| **Soft Pink** | `#F47FB5` | Love reactions, secondary accents |
| **Celebration Gold** | `#E7B85C` | Cake candles, sparks, highlights |
| **Pale Mist** | `#EDE7F6` | Light mode border, subtle dividers |

### Typography Hierarchy
- **Headings & Reveals:** *Playfair Display* (Serif elegance for emotional moments).
- **Body & Controls:** *Inter* / *DM Sans* / *Outfit* (High legibility, clean modern interfaces).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Component architecture, state hooks |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Ultra-fast HMR, optimized ESM bundler |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility styling, CSS design tokens |
| **Motion** | [Framer Motion 12](https://www.framer.com/motion/) | Spring physics, layout animations, exit transitions |
| **Celebration Effects**| [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | High-performance particle explosions |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG vector icons |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) | Real-time NoSQL cloud document storage |
| **Storage** | [Firebase Storage](https://firebase.google.com/docs/storage) | Audio tracks & binary image hosting |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) | Client-side declarative routing |
| **Hosting** | [Vercel](https://vercel.com/) | Global edge network with serverless functions |

---

## 📂 Project Directory Structure

```
BirthdayVerse/
├── api/                             # Vercel Serverless Functions
│   └── admin/
│       ├── change-password.ts       # Secure password change endpoint
│       ├── login.ts                 # Admin session JWT creation & validation
│       └── verify.ts                # Token verification endpoint
├── public/                          # Static audio soundtracks & assets
│   ├── Happy Birthday Song.mp3
│   ├── acoustic guitar.mp3
│   ├── funky groovin.mp3
│   └── lofi chill.mp3
├── src/
│   ├── components/
│   │   ├── calendar/                # Calendar view & birthday reminders
│   │   ├── dashboard/               # Main creator overview dashboard
│   │   ├── explore/                 # Platform feature showcase
│   │   ├── layout/                  # Navbar, Sidebar & Navigation controls
│   │   ├── preview/                 # Interactive LivePhonePreview component
│   │   ├── templates/               # Pre-designed experience templates
│   │   ├── ui/                      # Primitive UI components (Button, Input, Modal, Badge)
│   │   └── wishes/                  # My Wishes saved experience manager
│   ├── context/                     # Theme & application context providers
│   ├── lib/
│   │   ├── db.ts                    # Firestore CRUD, analytics & admin auth controller
│   │   ├── firebase.ts              # Firebase app initialization & service bindings
│   │   ├── imageOptimizer.ts        # Client-side canvas image downscaler & budget optimizer
│   │   └── utils.ts                 # Class merger & utility helpers
│   ├── pages/
│   │   ├── Admin.tsx                # Master platform administration & metrics page
│   │   ├── Home.tsx                 # 8-step Creator Studio page
│   │   └── Surprise.tsx             # 8-scene cinematic recipient experience
│   ├── App.tsx                      # Root route configuration & theme provider
│   ├── main.tsx                     # React application entry point
│   └── index.css                    # Design tokens & animation utilities
├── vercel.json                      # Vercel SPA rewrites & asset caching headers
├── vite.config.ts                   # Vite configuration with path aliases
└── package.json                     # Dependencies & build scripts
```

---

## 💾 Data Architecture & Schema

### Firestore Document Schema (`surprises` collection)

| Field | Type | Description |
| :--- | :--- | :--- |
| `short_id` | `string` | Unique 8-character identifier used in the URL (`/surprise/:id`) |
| `name` | `string` | Recipient's display name |
| `message` | `string` | JSON-encoded configuration payload (see below) |
| `image_path` | `string \| null` | Direct Firebase Storage CDN URL (or `null` if inline) |
| `music_path` | `string \| null` | Direct download URL for custom uploaded soundtrack |
| `created_at` | `string` | ISO 8601 creation timestamp |
| `view_count` | `number` | Total number of times opened by recipient |
| `reactions` | `number` | Count of heart reactions sent by recipient |

#### The `message` JSON Payload Structure
```json
{
  "body": "Wishing you the happiest birthday filled with joy and love...",
  "finaleText": "HAPPY BIRTHDAY! 🎂",
  "signOff": "With all my warmest love • BirthdayVerse",
  "accentColor": "#9D6BFF",
  "selectedMusic": "/Happy Birthday Song.mp3",
  "vibe": "Fun",
  "theme": "midnight",
  "nickname": "Champ",
  "relationship": "Bestie",
  "birthdayDate": "2026-09-11",
  "experienceType": "verse",
  "retentionMode": "72h",
  "keepForever": false,
  "photos": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

### Admin Authentication Schema (`_system_settings/admin_auth`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `hash` | `string` | SHA-256 / PBKDF2 hash of active admin password |
| `updated_at` | `string` | ISO timestamp of last password modification |


---

## 🛡️ Security & Performance

- **Client-Side Guardrails:** Dynamic client-side downscaling prevents browser memory exhaustion and eliminates Firestore 1MB property rejections.
- **Audio Autoplay Safety:** Leverages user gesture unlock gates to guarantee audio playback across all iOS Safari and Android Chrome devices.
- **Strict Data Sanitization:** HTML entities and injected properties are parsed safely to prevent cross-site scripting (XSS).
- **Ephemeral Auto-Purge:** Automatic deletion of expired data reduces database footprints and maintains recipient privacy.

---

## 👨‍💻 Author & Credits

Designed, architected, and built:

### **GOUS KHAN**
*Founder & Creator of BirthdayVerse*

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Khangulamgousamjat-181717?style=for-the-badge&logo=github)](https://github.com/Khangulamgousamjat)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Made with passion to make every birthday celebration unforgettable.  
**© 2026 BirthdayVerse Studio • All Rights Reserved.**

</div>
