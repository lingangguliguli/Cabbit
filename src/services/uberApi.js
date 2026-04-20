// Mock Uber price generator. No HTTP requests or env vars.

function seededRandom(seed) {
  let state = Math.abs(Math.floor(seed)) || 1;
  return function next() {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function makeSeed(distanceKm, sourceName = '', destName = '') {
  const text = `${distanceKm}:${sourceName}:${destName}`.toLowerCase();
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const UBER_RIDES = [
  { id: 'uber-auto', rideType: 'Auto', displayName: 'UberAuto', perKm: 14, min: 50, feeMin: 10, feeMax: 15 },
  { id: 'uber-go', rideType: 'Mini', displayName: 'UberGo', perKm: 17, min: 70, feeMin: 10, feeMax: 15 },
  { id: 'uber-x', rideType: 'Sedan', displayName: 'UberX', perKm: 22, min: 100, feeMin: 12, feeMax: 18 },
  { id: 'uber-xl', rideType: 'SUV', displayName: 'UberXL', perKm: 28, min: 140, feeMin: 15, feeMax: 20 },
  { id: 'uber-premier', rideType: 'Premium', displayName: 'UberPremier', perKm: 35, min: 200, feeMin: 18, feeMax: 25 },
];

function createPrice(platform, ride, distanceKm, rand, index) {
  const surgeRaw = rand() < 0.72 ? 1 + rand() * 0.35 : 1.35 + rand() * 0.85;
  const surge = Math.round(surgeRaw * 10) / 10;
  const baseFare = Math.max(ride.perKm * distanceKm, ride.min);
  const subtotal = baseFare * surge;
  const platformFee = Math.round(ride.feeMin + rand() * (ride.feeMax - ride.feeMin));
  const gst = Math.round(subtotal * 0.05);
  const totalMin = Math.round(subtotal + platformFee + gst);
  const totalMax = Math.max(totalMin + 5, Math.round(totalMin * (1.06 + rand() * 0.1)));
  const eta = Math.round(3 + rand() * 11);

  return {
    id: `${ride.id}-${index}`,
    platform,
    rideType: ride.rideType,
    displayName: ride.displayName,
    minFare: totalMin,
    maxFare: totalMax,
    surge,
    surgeActive: surge > 1.1,
    eta: `${eta} min`,
    platformFee,
    baseFare: Math.round(baseFare),
    gst,
    totalMin,
    totalMax,
    currency: '₹',
    isMock: true,
  };
}

export function generateUberPrices(distanceKm = 10, sourceName = '', destName = '') {
  const safeDistance = Number.isFinite(Number(distanceKm)) && Number(distanceKm) > 0 ? Number(distanceKm) : 10;
  const rand = seededRandom(makeSeed(safeDistance, sourceName, destName) + 1000);
  return UBER_RIDES.map((ride, index) => createPrice('Uber', ride, safeDistance, rand, index));
}
