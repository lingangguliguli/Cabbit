// React concepts: useEffect, useState, useMemo, useCallback, useRef, Context API

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import { SkeletonCard } from '../components/LoadingSpinner';
import PriceCard from '../components/PriceCard';
import RideTypeFilter from '../components/RideTypeFilter';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import useFirestore from '../hooks/useFirestore';
import useMockPrices from '../hooks/useMockPrices';
import useUberPrices from '../hooks/useUberPrices';
import { findCheapest, formatPrice } from '../utils/priceHelpers';

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

const secondaryButtonStyle = {
  background: 'transparent',
  border: '1.5px solid #1e2535',
  color: '#8b949e',
  borderRadius: '10px',
  padding: '10px 20px',
  minHeight: '42px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const greenLinkStyle = {
  ...greenButtonStyle,
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

function applySecondaryHover(event) {
  event.currentTarget.style.borderColor = '#22c55e';
  event.currentTarget.style.color = '#22c55e';
  event.currentTarget.style.background = 'rgba(34,197,94,0.05)';
}

function resetSecondaryHover(event) {
  event.currentTarget.style.borderColor = '#1e2535';
  event.currentTarget.style.color = '#8b949e';
  event.currentTarget.style.background = 'transparent';
}

export default function Compare() {
  const { source, destination, hasValidSearch, distance } = useSearch();
  const { currentUser } = useAuth();
  const { saveRoute, saveToHistory, loading: firestoreLoading } = useFirestore();
  const { prices: uberPrices, loading: uberLoading, error: uberError, regenerate: regenerateUber } = useUberPrices(source, destination, distance);
  const { prices: otherPrices, loading: mockLoading, regenerate: regenerateMocks } = useMockPrices(source, destination, distance);
  const [rideFilter, setRideFilter] = useState('All');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const savedHistoryKeyRef = useRef('');

  const allPrices = useMemo(
    () => [...uberPrices, ...otherPrices].sort((a, b) => a.totalMin - b.totalMin),
    [otherPrices, uberPrices],
  );
  const cheapestPrice = useMemo(() => findCheapest(allPrices), [allPrices]);
  const mostExpensive = useMemo(() => (allPrices.length ? Math.max(...allPrices.map((price) => price.totalMin)) : 0), [allPrices]);
  const sortedPrices = useMemo(() => {
    const list = rideFilter === 'All' ? allPrices : allPrices.filter((price) => price.rideType === rideFilter);
    return [...list].sort((a, b) => a.totalMin - b.totalMin);
  }, [allPrices, rideFilter]);
  const isLoading = uberLoading || mockLoading;

  useEffect(() => {
    if (!currentUser || !cheapestPrice || !hasValidSearch) return;
    const key = `${source.label}|${destination.label}|${cheapestPrice.id}`;
    if (savedHistoryKeyRef.current === key) return;
    savedHistoryKeyRef.current = key;
    saveToHistory({
      source: source.label,
      destination: destination.label,
      sourceLat: source.lat,
      sourceLng: source.lng,
      destLat: destination.lat,
      destLng: destination.lng,
      distanceKm: distance,
      cheapestPlatform: cheapestPrice.platform,
      cheapestPrice: cheapestPrice.totalMin,
    }).catch(() => undefined);
  }, [cheapestPrice, currentUser, destination, distance, hasValidSearch, saveToHistory, source]);

  const handleRetry = useCallback(() => {
    regenerateUber();
    regenerateMocks();
  }, [regenerateMocks, regenerateUber]);

  const handleSaveRoute = useCallback(async () => {
    if (!currentUser || !cheapestPrice) return;
    try {
      await saveRoute({
        source: source.label,
        destination: destination.label,
        sourceLat: source.lat,
        sourceLng: source.lng,
        destLat: destination.lat,
        destLng: destination.lng,
        distanceKm: distance,
        cheapestPlatform: cheapestPrice.platform,
        cheapestPrice: cheapestPrice.totalMin,
      });
      setSaveModalOpen(false);
      setToast('Route saved');
      window.setTimeout(() => setToast(''), 3000);
    } catch (error) {
      setToast(error.message || 'Could not save route');
      window.setTimeout(() => setToast(''), 3000);
    }
  }, [cheapestPrice, currentUser, destination, distance, saveRoute, source]);

  if (!hasValidSearch) {
    return (
      <main className="min-h-screen bg-cab-bg px-4 py-10">
        <SearchBar compact />
        <section className="mx-auto mt-16 max-w-md text-center">
          <div className="mb-4 text-5xl">🐇</div>
          <h1 className="text-2xl font-black text-cab-text">Enter locations first</h1>
          <p className="mt-3 text-sm leading-relaxed text-cab-muted">Pick your source and destination to compare simulated ride prices.</p>
          <Link
            to="/"
            style={greenLinkStyle}
            onMouseEnter={applyGreenHover}
            onMouseLeave={resetGreenHover}
          >
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cab-bg pb-28">
      <section className="border-b border-cab-border bg-cab-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-cab-text sm:text-xl">
              📍 {source.label} <span className="text-cab-subtle">→</span> 🏁 {destination.label}
            </h1>
            <span className="mt-2 inline-flex rounded-full border border-cab-border bg-cab-elevated px-3 py-1 text-xs text-cab-muted">{distance} km</span>
          </div>
          {currentUser ? (
            <button
              type="button"
              onClick={() => setSaveModalOpen(true)}
              disabled={!cheapestPrice}
              className="hidden disabled:opacity-50 sm:inline-flex"
              style={greenButtonStyle}
              onMouseEnter={applyGreenHover}
              onMouseLeave={resetGreenHover}
            >
              Save Route
            </button>
          ) : (
            <Link to="/login" className="hidden text-sm font-semibold text-cab-blue hover:text-cab-blue-light sm:inline-flex">Login to Save</Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <SearchBar compact />

        {isLoading && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3 text-sm text-cab-muted">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cab-border border-t-cab-blue" />
              Generating prices...
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          </div>
        )}

        {!isLoading && uberError && <div className="mt-6"><ErrorMessage message={uberError} onRetry={handleRetry} /></div>}

        {!isLoading && sortedPrices.length > 0 && (
          <div className="mt-8">
            {cheapestPrice && (
              <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-cab-border bg-cab-surface p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-cab-muted">Best option</p>
                  <p className="mt-1 text-2xl font-black text-cab-text">
                    {cheapestPrice.platform} · {formatPrice(cheapestPrice.totalMin)}
                    <span className="ml-2 text-sm font-medium text-cab-muted">{cheapestPrice.displayName}</span>
                  </p>
                </div>
                {mostExpensive > cheapestPrice.totalMin && (
                  <div className="rounded-xl border border-cab-success/20 bg-cab-success/10 px-4 py-2 text-sm font-semibold text-cab-success">
                    Save up to {formatPrice(mostExpensive - cheapestPrice.totalMin)} vs most expensive option
                  </div>
                )}
              </div>
            )}

            <RideTypeFilter activeFilter={rideFilter} onFilterChange={setRideFilter} />
            <div className="mt-2 mb-4 rounded-xl bg-cab-elevated/50 px-4 py-2 text-center text-xs text-cab-subtle">
              ℹ️ All prices are simulated estimates based on real fare structures. Open the app to see live pricing.
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedPrices.map((price) => (
                <PriceCard
                  key={price.id}
                  priceData={price}
                  isBestDeal={cheapestPrice?.id === price.id}
                  source={source}
                  destination={destination}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cab-border bg-cab-surface p-4 sm:hidden">
        {currentUser ? (
          <button
            type="button"
            onClick={() => setSaveModalOpen(true)}
            disabled={!cheapestPrice}
            style={{ ...greenButtonStyle, width: '100%' }}
            onMouseEnter={applyGreenHover}
            onMouseLeave={resetGreenHover}
          >
            Save Route
          </button>
        ) : (
          <Link to="/login" className="block text-center text-sm font-semibold text-cab-blue">Login to save this route</Link>
        )}
      </div>

      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-cab-border bg-cab-surface p-6 shadow-blue-md">
            <h2 className="text-lg font-black text-cab-text">Save this route?</h2>
            <p className="mt-2 text-sm text-cab-muted">{source.label} → {destination.label}</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                style={{ ...secondaryButtonStyle, flex: 1 }}
                onMouseEnter={applySecondaryHover}
                onMouseLeave={resetSecondaryHover}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRoute}
                disabled={firestoreLoading}
                style={{ ...greenButtonStyle, flex: 1 }}
                onMouseEnter={applyGreenHover}
                onMouseLeave={resetGreenHover}
              >
                {firestoreLoading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-20 right-4 z-50 rounded-xl border border-cab-border bg-cab-surface px-4 py-2 text-sm text-cab-text shadow-xl">{toast}</div>}
    </main>
  );
}
