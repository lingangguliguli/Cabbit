// React concepts: Context API, useState, useCallback, useMemo

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { calculateDistance } from '../utils/priceHelpers';

const SearchContext = createContext(null);

const EMPTY_LOCATION = { label: '', lat: null, lng: null };

function normalizeLocation(location) {
  return {
    label: location?.label || '',
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,
  };
}

export function SearchProvider({ children }) {
  const [source, setSourceState] = useState(EMPTY_LOCATION);
  const [destination, setDestinationState] = useState(EMPTY_LOCATION);

  const setSource = useCallback((location) => {
    setSourceState(normalizeLocation(location));
  }, []);

  const setDestination = useCallback((location) => {
    setDestinationState(normalizeLocation(location));
  }, []);

  const swapLocations = useCallback(() => {
    setSourceState((currentSource) => {
      setDestinationState(currentSource);
      return destination;
    });
  }, [destination]);

  const clearSearch = useCallback(() => {
    setSourceState(EMPTY_LOCATION);
    setDestinationState(EMPTY_LOCATION);
  }, []);

  const hasValidSearch = useMemo(
    () => Boolean(source.label?.trim() && destination.label?.trim()),
    [destination.label, source.label],
  );

  const distance = useMemo(() => {
    if (!hasValidSearch) return null;
    if (
      Number.isFinite(Number(source.lat)) &&
      Number.isFinite(Number(source.lng)) &&
      Number.isFinite(Number(destination.lat)) &&
      Number.isFinite(Number(destination.lng))
    ) {
      return calculateDistance(source.lat, source.lng, destination.lat, destination.lng);
    }
    return calculateDistance(source.label, destination.label);
  }, [destination, hasValidSearch, source]);

  const value = useMemo(
    () => ({
      source,
      destination,
      setSource,
      setDestination,
      swapLocations,
      clearSearch,
      hasValidSearch,
      distance,
    }),
    [clearSearch, destination, distance, hasValidSearch, setDestination, setSource, source, swapLocations],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used inside SearchProvider');
  return context;
}
