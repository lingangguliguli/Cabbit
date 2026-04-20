// React concepts: useRef, useEffect, controlled components, useCallback, Context API

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

const DEFAULT_SOURCE = { lat: 12.9716, lng: 77.5946 };
const DEFAULT_DESTINATION = { lat: 12.9352, lng: 77.6245 };

const containerStyle = {
  background: '#0d1117',
  border: '1px solid #1e2535',
  borderRadius: '16px',
  padding: '16px',
  width: '100%',
  maxWidth: '768px',
  margin: '0 auto',
  boxShadow: '0 0 30px rgba(59,130,246,0.18)',
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  color: '#484f58',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '6px',
  paddingLeft: '2px',
  lineHeight: 1,
};

const dotBaseStyle = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
  zIndex: 2,
};

const clearButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#484f58',
  fontSize: '14px',
  lineHeight: 1,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  zIndex: 2,
  padding: 0,
};

const greenButtonStyle = {
  background: 'linear-gradient(135deg, #16a34a, #22c55e)',
  border: 'none',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '11px 24px',
  minHeight: '42px',
  height: '46px',
  fontSize: '14px',
  fontWeight: '700',
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  letterSpacing: '0.02em',
  boxShadow: '0 0 20px rgba(34,197,94,0.35)',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,
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

function placeToLocation(place, fallbackLabel, fallbackCoords) {
  const geometry = place?.geometry?.location;
  return {
    label: place?.formatted_address || place?.name || fallbackLabel,
    lat: geometry?.lat ? geometry.lat() : fallbackCoords.lat,
    lng: geometry?.lng ? geometry.lng() : fallbackCoords.lng,
  };
}

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const fromAutocompleteRef = useRef(null);
  const toAutocompleteRef = useRef(null);
  const { source, destination, setSource, setDestination, swapLocations } = useSearch();
  const [error, setError] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const hasGooglePlaces = Boolean(typeof window !== 'undefined' && window.google?.maps?.places?.Autocomplete);

  useEffect(() => {
    if (!hasGooglePlaces || !fromInputRef.current || !toInputRef.current) return undefined;

    const options = {
      componentRestrictions: { country: 'in' },
      types: ['geocode', 'establishment'],
    };

    fromAutocompleteRef.current = new window.google.maps.places.Autocomplete(fromInputRef.current, options);
    toAutocompleteRef.current = new window.google.maps.places.Autocomplete(toInputRef.current, options);

    const fromListener = fromAutocompleteRef.current.addListener('place_changed', () => {
      const place = fromAutocompleteRef.current.getPlace();
      setSource(placeToLocation(place, fromInputRef.current.value, DEFAULT_SOURCE));
    });
    const toListener = toAutocompleteRef.current.addListener('place_changed', () => {
      const place = toAutocompleteRef.current.getPlace();
      setDestination(placeToLocation(place, toInputRef.current.value, DEFAULT_DESTINATION));
    });

    return () => {
      window.google.maps.event.removeListener(fromListener);
      window.google.maps.event.removeListener(toListener);
    };
  }, [hasGooglePlaces, setDestination, setSource]);

  const handleSourceChange = useCallback(
    (event) => {
      setSource({ label: event.target.value, ...DEFAULT_SOURCE });
      setError('');
    },
    [setSource],
  );

  const handleDestinationChange = useCallback(
    (event) => {
      setDestination({ label: event.target.value, ...DEFAULT_DESTINATION });
      setError('');
    },
    [setDestination],
  );

  const handleCompare = useCallback(
    (event) => {
      event.preventDefault();
      const from = source.label.trim();
      const to = destination.label.trim();
      if (!from || !to) {
        setError('Enter both pick-up and drop-off locations.');
        return;
      }
      if (from.toLowerCase() === to.toLowerCase()) {
        setError('Pick-up and drop-off cannot be the same.');
        return;
      }
      setError('');
      setIsComparing(true);
      window.setTimeout(() => {
        setIsComparing(false);
        navigate('/compare');
      }, 180);
    },
    [destination.label, navigate, source.label],
  );

  const handleSwap = useCallback(() => {
    swapLocations();
    setError('');
  }, [swapLocations]);

  return (
    <div className={`w-full max-w-3xl mx-auto ${compact ? '' : 'mt-8'}`}>
      <style>
        {`
          @media (max-width: 640px) {
            .searchbar-row {
              flex-direction: column !important;
              align-items: stretch !important;
            }
            .searchbar-compare-button {
              width: 100% !important;
            }
          }
        `}
      </style>
      <form onSubmit={handleCompare} style={containerStyle}>
        <div className="searchbar-row" style={rowStyle}>
          <div style={{ width: '100%', flex: 1 }}>
            <label style={labelStyle}>From</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ ...dotBaseStyle, backgroundColor: '#10b981' }} />
              <input
                ref={fromInputRef}
                value={source.label}
                onChange={handleSourceChange}
                style={{ paddingLeft: '36px', paddingRight: '36px' }}
                className="input-field"
                placeholder="Pick-up location"
                autoComplete="off"
              />
              {source.label && (
                <button
                  type="button"
                  onClick={() => setSource({ label: '', lat: null, lng: null })}
                  style={clearButtonStyle}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#8b949e';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#484f58';
                  }}
                  aria-label="Clear pick-up"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cab-border bg-cab-elevated text-sm text-cab-muted transition-all duration-300 hover:rotate-180 hover:border-cab-blue hover:text-cab-blue"
            aria-label="Swap locations"
          >
            ⇅
          </button>

          <div style={{ width: '100%', flex: 1 }}>
            <label style={labelStyle}>To</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ ...dotBaseStyle, backgroundColor: '#f59e0b' }} />
              <input
                ref={toInputRef}
                value={destination.label}
                onChange={handleDestinationChange}
                style={{ paddingLeft: '36px', paddingRight: destination.label ? '36px' : '12px' }}
                className="input-field"
                placeholder="Drop-off location"
                autoComplete="off"
              />
              {destination.label && (
                <button
                  type="button"
                  onClick={() => setDestination({ label: '', lat: null, lng: null })}
                  style={clearButtonStyle}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#8b949e';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#484f58';
                  }}
                  aria-label="Clear drop-off"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isComparing}
            style={greenButtonStyle}
            className="searchbar-compare-button"
            onMouseEnter={applyGreenHover}
            onMouseLeave={resetGreenHover}
          >
            {isComparing ? 'Comparing...' : 'Compare →'}
          </button>
        </div>

        {error && <p className="mt-3 px-1 text-xs font-medium text-cab-danger">{error}</p>}
      </form>
    </div>
  );
}
