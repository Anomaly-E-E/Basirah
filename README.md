# Basirah — بصيرة

> *"Those who spend their wealth by night and by day, secretly and openly — their reward is with their Lord, and there will be no fear upon them, nor will they grieve."*
> — Al-Baqarah 2:274

**Basirah** (بصيرة) means *insight* — seeing the truth with clarity. This app turns humanitarian data into understanding, and understanding into action.

---

## What It Does

Most donation platforms show you a problem and ask for money. Basirah does something different:

- **Shows** you where crises are happening in real time on a 3D globe
- **Explains** the severity, funding gaps, and people affected
- **Enables** Zakat and Sadaqah donations with verified organization links
- **Visualizes** your donation as a beam of light traveling from your location to the crisis zone
- **Confirms** the impact so you know exactly where your money went

**One-line flow:** `Explore → Understand → Donate → Visualize Impact`

---

## Features

### 🌍 Live Crisis Globe
- Interactive 3D globe powered by Mapbox GL JS
- 12 active crisis zones plotted by coordinates
- Color-coded by severity: Critical (red) → High (orange) → Medium (yellow) → Recovering (green)
- Auto-rotating globe with smooth camera controls
- Filter by severity level or category (conflict, famine, flood, displacement, disease)

### 📋 Crisis Intelligence Panel
- Scrollable list of all active zones in the left sidebar
- Click any zone to fly the camera directly to it
- Real-time live updates feed per zone (recent events, casualties, aid status)
- Verified organization links for each crisis (UNICEF, Red Cross, MSF, Islamic Relief, UNHCR, and more)
- Funding goal display showing how much is still needed

### 💸 Donation Flow
- Choose Zakat or Sadaqah
- Quick-select amounts ($10, $25, $50, $100) or enter custom amount
- Donate in CAD

### ✨ Impact Animation
- When you donate, the globe zooms out to show the full world
- A gold beam of light animates from Toronto to the crisis zone
- Ripple effect pulses at the destination
- Confirmation toast: *"$X sent to [Crisis Name] — impact recorded"*

### 🔐 Authentication
- Google OAuth sign-in via `@react-oauth/google`
- Email + password login flow
- Full signup flow with name, email, password, and confirmation
- Animated dot matrix canvas background on the auth screen
- Quranic verse displayed on the login page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Map / Globe | Mapbox GL JS (globe projection) |
| Animations | Framer Motion |
| 3D Canvas | Three.js + @react-three/fiber |
| Auth | @react-oauth/google |
| UI Components | Lucide React, Radix UI |

---

## Project Structure

```
src/
  components/
    ui/
      SignInPage.tsx        # Auth page with login + signup flows
      CanvasRevealEffect.tsx # Animated dot matrix background
      TopBar.tsx            # App header
      LeftSidebar.tsx       # Crisis list + filters
      RightPanel.tsx        # Crisis detail + donation flow
      BottomLegend.tsx      # Severity legend
      CrisisGlobe.tsx       # Mapbox 3D globe
      DonationBeam.tsx      # Light beam animation
  data/
    crisisZones.ts          # All crisis data, types, and helpers
  pages/
    Index.tsx               # Main dashboard page
  App.tsx                   # Auth gate + routing
  main.tsx                  # App entry point + Google OAuth provider
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Mapbox account](https://mapbox.com) for the map token
- A [Google Cloud OAuth 2.0 Client ID](https://console.cloud.google.com) for authentication

### Installation

```bash
git clone https://github.com/your-username/basirah.git
cd basirah
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:8080` in your browser.

---

## How It Works

### Data Layer
Crisis data is stored as structured TypeScript objects in `crisisZones.ts`. Each zone includes coordinates, severity, funding status, live updates, and verified organization links.

### Map Engine
Mapbox GL JS renders a 3D globe using the `globe` projection. Crisis zones are added as GeoJSON circle layers with severity-based color mapping. The globe auto-rotates using `requestAnimationFrame` and pauses on user interaction.

### State Management
React hooks (`useState`, `useCallback`, `useRef`) manage selected zone, active filters, donation state, and animation triggers. All state lives in `Index.tsx` and is passed down as props.

### Donation Animation
When a donation is made, `DonationBeam.tsx` draws an arc from Toronto's coordinates to the crisis zone using a great circle path. The beam animates using Mapbox's `line-dasharray` trick — a moving dash pattern that simulates a traveling light.

### Authentication
`App.tsx` gates the entire app behind `SignInPage.tsx`. Google OAuth uses `useGoogleLogin` from `@react-oauth/google`. On success, `isAuthenticated` is set to `true` and the main dashboard renders.

---

## Crisis Zones

| Zone | Country | Category | Severity |
|---|---|---|---|
| Gaza Strip | Palestine | Conflict | Critical |
| Darfur Region | Sudan | Conflict | Critical |
| Kandahar Province | Afghanistan | Displacement | Critical |
| Sana'a Governorate | Yemen | Conflict | Critical |
| Southern Somalia | Somalia | Famine | High |
| Cox's Bazar Camps | Bangladesh | Displacement | High |
| Northern Mali | Mali | Conflict | High |
| Idlib Province | Syria | Conflict | High |
| Tigray Region | Ethiopia | Famine | High |
| Kashmir Valley | India/Pakistan | Displacement | Medium |
| Sindh Province | Pakistan | Flood | Medium |
| Mosul District | Iraq | Displacement | Recovering |

---

## Inspiration

The humanitarian aid landscape suffers from **spotlight inequality** — crises only get funded when they go viral. Millions of people suffering in silence never receive help because they never trend.

Basirah was built to fix that. Every crisis on this globe deserves to be seen, understood, and funded — not just the ones that happen to appear on social media.

> *"Basirah is not just an app. It is a reminder that seeing the truth comes with the responsibility to act on it."*

---

## Built With Purpose

Originally built at **Ummah Hacks 2026** — the largest Muslim hackathon in North America — in 36 hours. Won 1st place overall and Yasin Ehsan's Choice Award (a16z Speedrun / Headstarter).

**Team:** Muhammad Bin Usman · Abdullah Rajput · Daniel Chen · Elijah Dagbo

---

## License

MIT License. Use it, build on it, make it better.

---

*May your wealth be purified and your impact be seen. آمين*