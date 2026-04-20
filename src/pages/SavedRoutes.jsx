// React concepts: useEffect, useState, useCallback, Context API, lists and keys

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonCard } from '../components/LoadingSpinner';
import SavedRouteCard from '../components/SavedRouteCard';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import useFirestore from '../hooks/useFirestore';

const greenButtonStyle = {
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

export default function SavedRoutes() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setSource, setDestination } = useSearch();
  const { getSavedRoutes, deleteRoute, loading, error } = useFirestore();
  const [routes, setRoutes] = useState([]);
  const [toast, setToast] = useState('');

  const loadRoutes = useCallback(async () => {
    const data = await getSavedRoutes();
    setRoutes(data);
  }, [getSavedRoutes]);

  useEffect(() => {
    if (!currentUser) return;
    if (routes.length > 0) return;
    let active = true;
    getSavedRoutes().then((data) => {
      if (active) setRoutes(data);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleCompareAgain = useCallback(
    (route) => {
      setSource({ label: route.source, lat: route.sourceLat ?? null, lng: route.sourceLng ?? null });
      setDestination({ label: route.destination, lat: route.destLat ?? null, lng: route.destLng ?? null });
      navigate('/compare');
    },
    [navigate, setDestination, setSource],
  );

  const handleDelete = useCallback(
    async (routeId) => {
      await deleteRoute(routeId);
      setRoutes((current) => current.filter((route) => route.id !== routeId));
      setToast('Route deleted');
      window.setTimeout(() => setToast(''), 3000);
    },
    [deleteRoute],
  );

  return (
    <main className="min-h-screen bg-cab-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-cab-text">Saved Routes</h1>
          <p className="mt-1 text-sm text-cab-muted">{routes.length} routes saved</p>
        </header>

        {error && <ErrorMessage message={error} onRetry={loadRoutes} />}

        {loading && routes.length === 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        )}

        {!loading && routes.length === 0 && !error && (
          <section className="mx-auto max-w-md py-24 text-center">
            <div className="mb-4 text-6xl text-cab-muted">🗺️</div>
            <h2 className="text-xl font-bold text-cab-text">No saved routes yet</h2>
            <p className="mt-2 text-sm text-cab-muted">Compare routes and save your favourites.</p>
            <button
              type="button"
              onClick={() => navigate('/compare')}
              style={{ ...greenButtonStyle, marginTop: '24px' }}
              onMouseEnter={applyGreenHover}
              onMouseLeave={resetGreenHover}
            >
              Compare Now
            </button>
          </section>
        )}

        {routes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <SavedRouteCard key={route.id} route={route} onCompareAgain={handleCompareAgain} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {toast && <div className="fixed bottom-6 right-6 rounded-xl border border-cab-border bg-cab-surface px-4 py-2 text-sm text-cab-text shadow-xl">{toast}</div>}
    </main>
  );
}
