// React concepts: props, conditional rendering, event handling

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

const destructiveIconStyle = {
  background: 'transparent',
  border: '1.5px solid rgba(239,68,68,0.3)',
  color: '#ef4444',
  borderRadius: '10px',
  padding: '10px 12px',
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

export default function SavedRouteCard({ route, onCompareAgain, onDelete }) {
  return (
    <div className="glass-card flex h-full flex-col p-4">
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="min-w-0 truncate font-medium text-cab-blue">{route.source?.label || route.source}</span>
          <span className="text-cab-subtle">→</span>
          <span className="min-w-0 truncate font-medium text-cab-text">{route.destination?.label || route.destination}</span>
        </div>
        <p className="text-xs text-cab-subtle">Cheapest last time:</p>
        <p className="mt-1 text-sm font-semibold text-cab-text">
          {route.cheapestPlatform || 'Cabbit'}
          <span className="mx-1 text-cab-subtle">·</span>
          <span className="text-cab-success">{formatPrice(route.cheapestPrice || route.totalMin || 0)}</span>
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-cab-border pt-4">
        <span className="text-xs text-cab-subtle">{timeAgo(route.savedAt)}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCompareAgain(route)}
            style={greenButtonStyle}
            onMouseEnter={applyGreenHover}
            onMouseLeave={resetGreenHover}
          >
            Compare Again
          </button>
          <button
            type="button"
            onClick={() => onDelete(route.id)}
            style={destructiveIconStyle}
            onMouseEnter={applyDestructiveHover}
            onMouseLeave={resetDestructiveHover}
            aria-label="Delete route"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
