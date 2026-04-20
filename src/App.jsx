// React concepts: React.lazy, Suspense, Context providers, protected routes

import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SavedRoutes from './pages/SavedRoutes';
import History from './pages/History';
import Profile from './pages/Profile';

const Compare = lazy(() => import('./pages/Compare'));

const greenLinkStyle = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '11px 24px',
  minHeight: '42px',
  fontSize: '14px',
  fontWeight: '700',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  boxShadow: '0 0 20px rgba(34,197,94,0.35)',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '24px',
  textDecoration: 'none',
};

function applyGreenHover(event) {
  event.currentTarget.style.boxShadow = '0 0 30px rgba(34,197,94,0.55)';
  event.currentTarget.style.transform = 'translateY(-1px)';
  event.currentTarget.style.background = 'linear-gradient(135deg, #22c55e, #4ade80)';
}

function resetGreenHover(event) {
  event.currentTarget.style.boxShadow = '0 0 20px rgba(34,197,94,0.35)';
  event.currentTarget.style.transform = 'translateY(0)';
  event.currentTarget.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cab-bg px-4 text-center">
      <div>
        <div className="mb-5 text-6xl">🐇</div>
        <h1 className="text-3xl font-black text-cab-text">Page not found</h1>
        <p className="mt-2 text-sm text-cab-muted">This route hopped away.</p>
        <Link to="/" style={greenLinkStyle} onMouseEnter={applyGreenHover} onMouseLeave={resetGreenHover}>
          Back home
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <Navbar />
          <Suspense fallback={<LoadingSpinner fullPage message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/saved" element={<ProtectedRoute><SavedRoutes /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
