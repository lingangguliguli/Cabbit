// React concepts: useState, useEffect, useCallback, useMemo

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateUberPrices } from '../services/uberApi';

export default function useUberPrices(source, destination, distanceKm) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(() => {
    if (!source?.label || !destination?.label || !distanceKm) {
      setPrices([]);
      setLoading(false);
      setError(null);
      return [];
    }

    setLoading(true);
    setError(null);
    try {
      const nextPrices = generateUberPrices(distanceKm, source.label, destination.label);
      setPrices(nextPrices);
      return nextPrices;
    } catch {
      setPrices([]);
      setError('Could not generate Uber prices.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [destination?.label, distanceKm, source?.label]);

  useEffect(() => {
    generate();
  }, [generate]);

  const memoizedPrices = useMemo(() => prices, [prices]);

  return { prices: memoizedPrices, loading, error, regenerate: generate };
}
