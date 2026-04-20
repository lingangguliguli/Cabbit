// React concepts: props, conditional rendering, event handling

import { formatPrice, getBookingUrl, getPlatformColor, getSurgeLabel } from '../utils/priceHelpers';

const PLATFORM_AVATAR_CLASSES = {
  Uber: 'bg-black text-white',
  Ola: 'bg-[#26b24b] text-white',
  Rapido: 'bg-[#ffdd00] text-black',
};

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

export default function PriceCard({ priceData, isBestDeal = false, isCheapest = false, source, destination }) {
  const bestDeal = isBestDeal || isCheapest;
  const colors = getPlatformColor(priceData.platform);
  const avatarClass = PLATFORM_AVATAR_CLASSES[priceData.platform] || 'bg-cab-elevated text-cab-text';
  const bookingUrl =
    priceData.bookingUrl ||
    getBookingUrl(
      priceData.platform,
      source?.lat,
      source?.lng,
      destination?.lat,
      destination?.lng,
    );
  const surgeLabel = getSurgeLabel(priceData.surge);

  const handleBook = () => {
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className={`${bestDeal ? 'best-deal-card' : 'glass-card'} flex h-full flex-col overflow-hidden p-5`}>
      {bestDeal && (
        <div className="-mx-5 -mt-5 mb-4 rounded-t-2xl bg-emerald-500 py-1.5 text-center text-xs font-bold tracking-widest text-emerald-950">
          🐇 BEST DEAL — Cheapest Option
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarClass}`} aria-label={`${priceData.platform} brand`} title={`${colors.bg} ${colors.text}`}>
            {priceData.platform?.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-cab-text">{priceData.platform}</span>
              <span className="rounded-md bg-cab-elevated px-2 py-0.5 text-xs text-cab-muted">{priceData.rideType}</span>
            </div>
            <p className="truncate text-xs text-cab-subtle">{priceData.displayName}</p>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-cab-elevated px-3 py-1 text-xs text-cab-muted">⏱ {priceData.eta}</div>
      </div>

      <div className="mt-1">
        <span className="text-3xl font-black text-cab-text">{formatPrice(priceData.minFare, priceData.currency)}</span>
        <span className="ml-1 text-lg text-cab-muted">–{formatPrice(priceData.maxFare, priceData.currency)}</span>
        {priceData.isMock && <span className="ml-1 text-xs text-cab-subtle">(est.)</span>}
      </div>

      {priceData.surge > 1 && surgeLabel && (
        <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1">
          <span className="text-xs text-amber-400">{surgeLabel}</span>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-1.5 border-t border-cab-border pt-3">
        <span className="text-xs text-cab-subtle">Base fare</span>
        <span className="text-right text-xs text-cab-muted">{formatPrice(priceData.baseFare, priceData.currency)}</span>
        <span className="text-xs text-cab-subtle">Platform fee</span>
        <span className="text-right text-xs text-cab-muted">{formatPrice(priceData.platformFee, priceData.currency)}</span>
        <span className="text-xs text-cab-subtle">GST</span>
        <span className="text-right text-xs text-cab-muted">{formatPrice(priceData.gst, priceData.currency)}</span>
        <span className="text-xs text-cab-subtle">Surge</span>
        <span className="text-right text-xs text-cab-muted">{priceData.surge.toFixed(1)}x</span>
      </div>

      <button
        type="button"
        onClick={handleBook}
        style={{ ...(bestDeal ? greenButtonStyle : secondaryButtonStyle), width: '100%', marginTop: '16px' }}
        onMouseEnter={bestDeal ? applyGreenHover : applySecondaryHover}
        onMouseLeave={bestDeal ? resetGreenHover : resetSecondaryHover}
      >
        {bestDeal ? 'Book — Best Price →' : `Book on ${priceData.platform} →`}
      </button>
    </article>
  );
}
