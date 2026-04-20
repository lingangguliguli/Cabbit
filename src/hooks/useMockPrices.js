// React concepts: useMemo, useState, useEffect, useCallback

import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateOlaPrices, generateRapidoPrices } from '../services/mockData';

export default function useMockPrices(source, destination, distanceKm) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(() => {
    if (!source?.label || !destination?.label || !distanceKm) {
      setPrices([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    const ola = generateOlaPrices(distanceKm, source.label, destination.label);
    const rapido = generateRapidoPrices(distanceKm, source.label, destination.label);
    const nextPrices = [...ola, ...rapido].sort((a, b) => a.totalMin - b.totalMin);
    setPrices(nextPrices);
    setLoading(false);
    return nextPrices;
  }, [destination?.label, distanceKm, source?.label]);

  useEffect(() => {
    generate();
  }, [generate]);

  const memoizedPrices = useMemo(() => prices, [prices]);

  return { prices: memoizedPrices, loading, regenerate: generate };
}
