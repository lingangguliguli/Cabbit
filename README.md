<div align="center">

# 🐇 Cabbit

### Compare Uber, Ola & Rapido prices — instantly.

Stop switching between three apps. Cabbit shows you the cheapest cab option for any route in seconds.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-ffca28?logo=firebase&logoColor=black&style=flat-square)](https://firebase.google.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Instant Comparison** | Compare Uber, Ola & Rapido prices side-by-side for any route |
| 🏆 **Best Deal Badge** | Cheapest option is automatically highlighted |
| 🔁 **Swap Locations** | Reverse pick-up and drop-off with one click |
| 🔖 **Save Routes** | Bookmark frequent trips for quick access |
| 🕓 **Search History** | Track past comparisons, replay them anytime |
| 👤 **Auth** | Email/password + Google Sign-In via Firebase |
| 🛡️ **Protected Routes** | Saved routes & history require login |
| 📱 **Responsive** | Works seamlessly on mobile, tablet, and desktop |
| 🌑 **Electric Dark Theme** | Premium dark UI with blue accent glow effects |

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Styling** | Tailwind CSS v4 (custom `cab-*` design tokens) |
| **Routing** | React Router v7 |
| **Auth** | Firebase Authentication (Email/Password + Google) |
| **Database** | Cloud Firestore (saved routes, search history) |
| **Prices** | Fully offline mock data — no external cab API needed |
| **State** | Context API (`AuthContext`, `SearchContext`) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
cabbit/
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx  # Reusable inline error display
│   │   ├── LoadingSpinner.jsx # Full-page and inline spinners
│   │   ├── Navbar.jsx        # Sticky top nav with auth-aware buttons
│   │   ├── PriceCard.jsx     # Individual cab platform price card
│   │   ├── ProtectedRoute.jsx # Auth guard for private routes
│   │   ├── RideTypeFilter.jsx # Filter: Mini / Sedan / Auto / Bike
│   │   ├── SavedRouteCard.jsx # Card for a saved/bookmarked route
│   │   └── SearchBar.jsx     # Pick-up / drop-off search form
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   # Firebase auth state + helpers
│   │   └── SearchContext.jsx # Global source/destination state
│   │
│   ├── hooks/
│   │   ├── useFirestore.js   # Saved routes & history Firestore ops
│   │   ├── useMockPrices.js  # Generates deterministic mock prices
│   │   └── useUberPrices.js  # (Legacy stub — kept for compatibility)
│   │
│   ├── pages/
│   │   ├── Compare.jsx       # Main price comparison results page
│   │   ├── History.jsx       # Past searches with replay support
│   │   ├── Home.jsx          # Landing page with search bar hero
│   │   ├── Login.jsx         # Email + Google sign-in
│   │   ├── Profile.jsx       # User profile & account settings
│   │   ├── SavedRoutes.jsx   # Bookmarked routes list
│   │   └── Signup.jsx        # Email + Google registration
│   │
│   ├── services/
│   │   ├── firebase.js       # Firebase app + auth + Firestore init
│   │   ├── mockData.js       # Seeded price generator (Uber/Ola/Rapido)
│   │   └── uberApi.js        # (Legacy stub — kept for compatibility)
│   │
│   ├── utils/
│   │   └── priceHelpers.js   # Fare formatting, sorting, best-deal logic
│   │
│   ├── App.jsx               # Route definitions + lazy loading
│   ├── index.css             # Global styles + design token variables
│   └── main.jsx              # React app entry point
│
├── .env.example              # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node)
- A **Firebase** project — [firebase.google.com](https://firebase.google.com)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cabbit.git
cd cabbit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=optional_for_autocomplete
```

> **Note:** The Google Maps API key is optional. Without it, Cabbit works fully offline — users type locations manually and realistic prices are generated from the text seed. Autocomplete only activates when the key is present.

### 4. Firebase Project Setup

1. Go to [firebase.google.com](https://firebase.google.com) → **Add project**
2. Enable **Authentication** → Sign-in methods:
   - ✅ Email/Password
   - ✅ Google
3. Go to **Authentication → Settings → Authorised domains** and add:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (e.g. `cabbit.vercel.app`)
4. Enable **Firestore Database** → Start in production mode
5. Copy your config from **Project Settings → Your apps → SDK setup**

### 5. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build optimised production bundle to `dist/` |
| `npm run preview` | Locally preview the production build |

---

## ☁️ Deploying to Vercel

1. Push your repo to GitHub (see below)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add all `VITE_*` environment variables in **Project Settings → Environment Variables**
4. Click **Deploy** — Vercel auto-detects Vite and builds correctly

> After deploying, add your `your-app.vercel.app` domain to Firebase's **Authorised domains** list.

---

## 📊 How Prices Are Generated

Cabbit does **not** call any live cab API. All prices are generated offline using a deterministic seeded algorithm in `src/services/mockData.js`:

- The pick-up and drop-off location strings are hashed into a numeric seed
- That seed drives consistent, realistic fare calculations per ride category (Mini, Sedan, Auto, Bike)
- Prices mirror real 2025 Bengaluru fare structures (base fare + per-km rate + surge multiplier)
- The same route always returns the same prices — no random flickering

This makes the app fully usable offline, with zero API costs.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## ⚠️ Disclaimer

All cab prices shown in Cabbit are **simulated estimates** based on real 2025 Bengaluru fare structures. No official Uber, Ola, or Rapido API is used. Always check the actual app for live pricing before booking.

---

## 📄 License

MIT — free to use, fork, and modify.

---

<div align="center">
Made with ❤️ and ☕ | Built with React + Firebase + Vite
</div>
