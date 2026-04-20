// React concepts: useEffect, useState, useCallback, Context API, lists and keys

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import useFirestore from '../hooks/useFirestore';
import { formatPrice, timeAgo } from '../utils/priceHelpers';

const greenButtonStyle = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '10px 20px',
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

const destructiveButtonStyle = {
  background: 'transparent',
  border: '1.5px solid rgba(239,68,68,0.3)',
  color: '#ef4444',
  borderRadius: '10px',
  padding: '10px 20px',
  minHeight: '42px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
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

function applyDestructiveHover(event) {
  event.currentTarget.style.background = 'rgba(239,68,68,0.08)';
  event.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
}

function resetDestructiveHover(event) {
  event.currentTarget.style.background = 'transparent';
  event.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
}

export default function History() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setSource, setDestination } = useSearch();
  const { getHistory, clearHistory, loading, error } = useFirestore();
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await getHistory(20);
    setHistory(data);
  }, [getHistory]);

  useEffect(() => {
    if (!currentUser) return;
    if (history.length > 0) return;
    let active = true;
    getHistory(20).then((data) => {
      if (active) setHistory(data);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleCompareAgain = useCallback(
    (item) => {
      setSource({ label: item.source, lat: item.sourceLat ?? null, lng: item.sourceLng ?? null });
      setDestination({ label: item.destination, lat: item.destLat ?? null, lng: item.destLng ?? null });
      navigate('/compare');
    },
    [navigate, setDestination, setSource],
  );

  const handleClearHistory = useCallback(async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    await clearHistory();
    setHistory([]);
    setConfirmClear(false);
  }, [clearHistory, confirmClear]);

  if (loading && history.length === 0) return <LoadingSpinner fullPage message="Loading history..." />;

  return (
    <main className="min-h-screen bg-cab-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-cab-text">Search History</h1>
            <p className="mt-1 text-sm text-cab-muted">Your last 20 searches</p>
          </div>
          {history.length > 0 && (
            <div className="flex items-center gap-3">
              {confirmClear && <span className="text-sm text-cab-muted">Are you sure?</span>}
              <button
                type="button"
                onClick={handleClearHistory}
                style={destructiveButtonStyle}
                onMouseEnter={applyDestructiveHover}
                onMouseLeave={resetDestructiveHover}
              >
                {confirmClear ? 'Yes, clear' : 'Clear History'}
              </button>
              {confirmClear && <button type="button" onClick={() => setConfirmClear(false)} className="text-sm text-cab-muted hover:text-cab-text">Cancel</button>}
            </div>
          )}
        </header>

        {error && <ErrorMessage message={error} onRetry={loadHistory} />}

        {!loading && history.length === 0 && !error && (
          <section className="py-24 text-center">
            <div className="mb-4 text-6xl text-cab-muted">🕘</div>
            <h2 className="text-xl font-bold text-cab-text">No recent searches</h2>
            <p className="mt-2 text-sm text-cab-muted">Your comparisons will appear here automatically.</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{ ...greenButtonStyle, marginTop: '24px' }}
              onMouseEnter={applyGreenHover}
              onMouseLeave={resetGreenHover}
            >
              Start Comparing
            </button>
          </section>
        )}

        <div className="space-y-3">
          {history.map((item) => (
            <article key={item.id} className="flex items-center gap-4 rounded-xl border border-cab-border bg-cab-surface px-4 py-3">
              <div className="min-w-[72px] text-xs text-cab-subtle">{timeAgo(item.searchedAt)}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-cab-text">{item.source} → {item.destination}</p>
                <p className="mt-1 text-xs text-cab-subtle">
                  Cheapest: <span className="text-cab-muted">{item.cheapestPlatform || 'Cabbit'}</span> · <span className="text-cab-success">{formatPrice(item.cheapestPrice || 0)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCompareAgain(item)}
                style={greenButtonStyle}
                onMouseEnter={applyGreenHover}
                onMouseLeave={resetGreenHover}
              >
                Compare Again
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
