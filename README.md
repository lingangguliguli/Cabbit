# 🐇 Cabbit — Find the Cheapest Cab, Instantly

> **Course:** Building Web Applications with React | **Batch:** 2029
> **Author:** Arjun Saxena | **GitHub:** [lingangguliguli](https://github.com/lingangguliguli?tab=repositories)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-v6-CA4245?style=flat&logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🌐 Live Demo

🚀 https://cabbit-idc30szli-arjuns-projects-8333951a.vercel.app/

---

## 🧠 Problem Statement

### Who is the user?
Urban Indian commuters — students, working professionals, and daily office-goers — who book cabs regularly in cities like Bengaluru, Mumbai, and Delhi.

### What problem does Cabbit solve?
Before every cab booking, users manually switch between the Uber, Ola, and Rapido apps one by one just to check which platform is cheapest at that moment. This wastes 3–5 minutes per trip and is genuinely frustrating — especially when surge pricing kicks in on one platform but not another.

**There is no single place to compare all three platforms at once. Cabbit fixes that.**

### Why does this problem matter?
With surge pricing, platform fees, and GST varying across platforms at any given time, the price gap between the cheapest and most expensive option can be ₹50–₹200 per trip. For someone commuting daily, that compounds to thousands of rupees saved every month — just by making a smarter choice. Cabbit makes that choice effortless and instant.

---

## ✨ Features

- 🔍 **Instant Comparison** — Enter pickup and drop-off, get prices from Uber, Ola, and Rapido in under 3 seconds
- 🐇 **Best Deal Detection** — Cheapest option auto-highlighted with a Best Deal badge
- 🎛️ **Ride Type Filtering** — Filter by Bike, Auto, Mini, Sedan, SUV, Premium, or Electric
- 💰 **Price Breakdown** — Base fare, platform fee, GST, and surge shown per card
- 🔖 **Save Routes** — Save frequent routes for instant one-click re-comparison
- 🕐 **Search History** — Last 20 searches stored and accessible anytime
- 🔐 **Authentication** — Email/password and Google Sign-In via Firebase
- 🛡️ **Protected Routes** — Saved routes and history only accessible when logged in
- 📱 **Fully Responsive** — Clean experience on mobile, tablet, and desktop
- ⚡ **Performance Optimised** — Parallel Firestore fetching, query limits, lazy loading

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Authentication | Firebase Auth (Email + Google OAuth) |
| Database | Cloud Firestore |
| Location Input | Google Maps Places API (with demo fallback) |
| Price Data | Simulated mock data — all platforms |
| Deployment | Vercel |

---

## ⚛️ React Concepts Used

### Core Concepts ✅
| Concept | Implementation |
|---|---|
| Functional Components | Every component and page in the project |
| Props & Component Composition | `PriceCard`, `SearchBar`, `SavedRouteCard`, `Navbar` all receive and pass props |
| `useState` | Search inputs, price results, loading states, error states, form fields, modal toggles |
| `useEffect` | Fetching prices on location change, loading Firestore data on mount, auth state listener |
| Conditional Rendering | Loading skeletons, empty states, auth-gated UI, error displays, best deal badge |
| Lists & Keys | Price cards grid, saved routes list, history list — all rendered with unique keys |

### Intermediate Concepts ✅
| Concept | Implementation |
|---|---|
| Lifting State Up | `SearchBar` lifts source/destination state up to `Compare` page via `SearchContext` |
| Controlled Components | All inputs in `Login`, `Signup`, `Profile`, and `SearchBar` are fully controlled |
| React Router v6 | Full client-side routing, `NavLink` for active states, `useNavigate`, `useLocation` |
| Context API | `AuthContext` — global auth state; `SearchContext` — global search/location state |

### Advanced Concepts ✅
| Concept | Implementation |
|---|---|
| `useMemo` | Memoizing filtered and sorted price results in `Compare.jsx` to avoid recalculation |
| `useCallback` | Memoizing fetch and Firestore CRUD functions passed down as props |
| `useRef` | Google Maps Places Autocomplete attached to input elements |
| `React.lazy` + `Suspense` | `Compare` page is lazy loaded for code splitting |
| Performance Optimisation | Parallel Firestore queries via `Promise.all`, query `limit()`, cached auth data from context |

---

## 🔐 Authentication & Database

### Firebase Auth
- Email/password signup and login
- Google OAuth Sign-In
- `onAuthStateChanged` listener for persistent sessions
- Proper error handling with user-friendly messages per error code
- Protected routes redirect unauthenticated users to `/login` and return them after login

### Firestore CRUD Operations
| Operation | Where Used |
|---|---|
| **Create** | Save a route, save a search to history, create user document on signup |
| **Read** | Fetch saved routes, fetch search history, fetch user stats on profile page |
| **Update** | Update display name on profile page |
| **Delete** | Delete a saved route, clear all search history |

### Firestore Data Structure
```
users/
  {userId}/
    savedRoutes/
      {routeId}
        - source: string
        - destination: string
        - sourceLat: number
        - sourceLng: number
        - destLat: number
        - destLng: number
        - cheapestPlatform: string
        - cheapestPrice: number
        - savedAt: timestamp
    searchHistory/
      {historyId}
        - source: string
        - destination: string
        - cheapestPlatform: string
        - cheapestPrice: number
        - searchedAt: timestamp
```

---

## 📦 Required Features Checklist

- ✅ Authentication system (Email/password + Google OAuth)
- ✅ Dashboard / Main screen (Home page + Compare page)
- ✅ Core Feature 1 — Real-time price comparison across 3 platforms
- ✅ Core Feature 2 — Save and manage frequent routes
- ✅ Core Feature 3 — Search history with re-compare functionality
- ✅ CRUD functionality (save, read, update display name, delete routes/history)
- ✅ Persistent storage (Firestore + Firebase Auth session persistence)
- ✅ Routing (7 routes including 3 protected routes)
- ✅ State management (Context API — AuthContext + SearchContext)

---

## 🏗️ Project Structure & Code Quality

```
cabbit/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky nav, auth state, mobile hamburger menu
│   │   ├── ProtectedRoute.jsx    # Redirects unauthenticated users to /login
│   │   ├── PriceCard.jsx         # Individual platform price card with breakdown
│   │   ├── SearchBar.jsx         # Location picker with Google Places + fallback
│   │   ├── LoadingSpinner.jsx    # Full-page spinner + skeleton loading cards
│   │   ├── ErrorMessage.jsx      # Error display with retry button
│   │   ├── RideTypeFilter.jsx    # Horizontal scrollable filter pills
│   │   └── SavedRouteCard.jsx    # Card for each saved route
│   ├── pages/
│   │   ├── Home.jsx              # Landing page — hero, search, how it works, stats
│   │   ├── Compare.jsx           # Core comparison page — most important
│   │   ├── SavedRoutes.jsx       # Saved routes list — protected
│   │   ├── History.jsx           # Search history — protected
│   │   ├── Profile.jsx           # User profile + stats — protected
│   │   ├── Login.jsx             # Email + Google login
│   │   └── Signup.jsx            # Registration with inline validation
│   ├── context/
│   │   ├── AuthContext.jsx       # Global Firebase auth state + auth functions
│   │   └── SearchContext.jsx     # Global source/destination state + swap
│   ├── hooks/
│   │   ├── useUberPrices.js      # Uber mock price generator custom hook
│   │   ├── useMockPrices.js      # Ola + Rapido mock price generator custom hook
│   │   └── useFirestore.js       # All Firestore CRUD operations as custom hook
│   ├── services/
│   │   ├── firebase.js           # Firebase app initialisation and exports
│   │   ├── uberApi.js            # Uber mock price generation logic
│   │   └── mockData.js           # Ola + Rapido mock price generation logic
│   ├── utils/
│   │   └── priceHelpers.js       # Haversine distance, price formatting, deep links
│   ├── App.jsx                   # Route definitions + context provider wrapping
│   ├── main.jsx                  # React DOM entry point
│   └── index.css                 # Global styles, Inter font import, Tailwind base
├── .env.example                  # Environment variable template
├── .gitignore
├── index.html
├── vite.config.js
├── tailwind.config.js
└── README.md
```

**Code quality principles followed:**
- All Firebase calls isolated in `services/` and `hooks/` — never in components directly
- Separation of concerns — UI, data fetching, and business logic are fully separated
- Reusable components — `PriceCard` renders all 3 platforms, `SavedRouteCard` used across pages
- No unnecessary re-renders — `useMemo` and `useCallback` used meaningfully with correct dependency arrays
- All async operations wrapped in `try/catch` with user-facing error handling

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- A Firebase project (free Spark plan is sufficient)
- Google Maps API key *(optional — app works without it using Bengaluru demo coordinates)*

### Step 1 — Clone the repository
```bash
git clone https://github.com/lingangguliguli/cabbit.git
cd cabbit
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Configure environment variables
```bash
cp .env.example .env
```

Fill in your `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

### Step 4 — Firebase configuration
1. Create a project at [firebase.google.com](https://firebase.google.com)
2. Go to **Authentication → Sign-in method** and enable:
   - Email/Password
   - Google
3. Go to **Authentication → Settings → Authorised domains** and add:
   - `localhost`
   - `127.0.0.1`
4. Go to **Firestore Database** → Create database (test mode for development)
5. Copy config from **Project Settings → Your apps** into `.env`

### Step 5 — Google Maps (optional)
1. Enable **Maps JavaScript API** and **Places API** in [Google Cloud Console](https://console.cloud.google.com)
2. Create an API key and paste it into `.env`
3. If skipped — the app uses Bengaluru demo coordinates automatically and still works fully

### Step 6 — Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Step 7 — Build for production
```bash
npm run build
npm run preview
```

---

## 🌐 Deploying to Vercel

```bash
npx vercel
```

Add all `.env` variables in **Vercel → Project → Settings → Environment Variables**.

Then go to **Firebase → Authentication → Authorised domains** and add your Vercel deployment URL.

---

## ⚠️ Data Disclaimer

All cab prices shown in Cabbit — including Uber, Ola, and Rapido — are **simulated estimates** based on real 2025 Bengaluru fare structures. The pricing engine uses per-km rates, minimum fares, platform fees, 5% GST, and randomised surge multipliers to produce realistic results. No official cab platform API is used, as none are publicly available.

Always open the actual platform app for live pricing before booking.

---

## 📄 License

MIT — free to use and build upon.

---

## 👤 Author

**Arjun Saxena**
Building Web Applications with React
GitHub: [github.com/lingangguliguli](https://github.com/lingangguliguli?tab=repositories)

---

> *"This project is not just an assignment — it's a portfolio piece."*
