// React concepts: pure utility module, seeded randomness, mock data generation

import { generateUberPrices } from './uberApi';

const BASE_RATES = {
  bike: { perKm: 9, min: 25, max: 15 },
  auto: { perKm: 13, min: 40, max: 18 },
  mini: { perKm: 16, min: 60, max: 22 },
  sedan: { perKm: 20, min: 90, max: 28 },
  suv: { perKm: 25, min: 120, max: 35 },
  premium: { perKm: 32, min: 180, max: 45 },
  electric: { perKm: 14, min: 55, max: 20 },
};

const OLA_RIDES = [
  { id: 'ola-auto', rideType: 'Auto', displayName: 'Ola Auto', rate: 'auto', feeMin: 5, feeMax: 12, multiplier: 0.93 },
  { id: 'ola-mini', rideType: 'Mini', displayName: 'Ola Mini', rate: 'mini', feeMin: 5, feeMax: 12, multiplier: 0.92 },
  { id: 'ola-prime-sedan', rideType: 'Sedan', displayName: 'Ola Prime Sedan', rate: 'sedan', feeMin: 6, feeMax: 14, multiplier: 0.9 },
  { id: 'ola-prime-suv', rideType: 'SUV', displayName: 'Ola Prime SUV', rate: 'suv', feeMin: 8, feeMax: 16, multiplier: 0.91 },
  { id: 'ola-bike', rideType: 'Bike', displayName: 'Ola Bike', rate: 'bike', feeMin: 3, feeMax: 8, multiplier: 0.9 },
  { id: 'ola-electric', rideType: 'Electric', displayName: 'Ola Electric', rate: 'electric', feeMin: 4, feeMax: 10, multiplier: 0.9 },
];

const RAPIDO_RIDES = [
  { id: 'rapido-bike', rideType: 'Bike', displayName: 'Rapido Bike', rate: 'bike', feeMin: 3, feeMax: 8, multiplier: 0.78 },
  { id: 'rapido-auto', rideType: 'Auto', displayName: 'Rapido Auto', rate: 'auto', feeMin: 3, feeMax: 8, multiplier: 0.82 },
  { id: 'rapido-cab', rideType: 'Mini', displayName: 'Rapido Cab', rate: 'mini', feeMin: 4, feeMax: 9, multiplier: 0.86 },
];

function seededRandom(seed) {
  let state = Math.abs(Math.floor(seed)) || 1;
  return function next() {
    state = (state * 48271) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function makeSeed(distanceKm, sourceName = '', destName = '', salt = '') {
  const text = `${distanceKm}:${sourceName}:${destName}:${salt}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = Math.imul(31, hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 42;
}

function createPlatformPrice(platform, ride, distanceKm, rand, index) {
  const rate = BASE_RATES[ride.rate];
  const surgeRaw = rand() < 0.7 ? 1 + rand() * 0.32 : 1.32 + rand() * 0.88;
  const surge = Math.round(Math.min(2.2, surgeRaw) * 10) / 10;
  const baseFare = Math.max(rate.perKm * distanceKm * ride.multiplier, rate.min);
  const subtotal = baseFare * surge;
  const platformFee = Math.round(ride.feeMin + rand() * (ride.feeMax - ride.feeMin));
  const gst = Math.round(subtotal * 0.05);
  const totalMin = Math.round(subtotal + platformFee + gst);
  const spread = Math.round(totalMin * (0.06 + rand() * 0.11));
  const eta = Math.round(2 + rand() * 12);

  return {
    id: `${ride.id}-${index}`,
    platform,
    rideType: ride.rideType,
    displayName: ride.displayName,
    minFare: totalMin,
    maxFare: totalMin + Math.max(5, spread),
    surge,
    surgeActive: surge > 1.1,
    eta: `${eta} min`,
    platformFee,
    baseFare: Math.round(baseFare),
    gst,
    totalMin,
    totalMax: totalMin + Math.max(5, spread),
    currency: '₹',
    isMock: true,
  };
}

export function generateOlaPrices(distanceKm = 10, sourceName = '', destName = '') {
  const safeDistance = Number.isFinite(Number(distanceKm)) && Number(distanceKm) > 0 ? Number(distanceKm) : 10;
  const rand = seededRandom(makeSeed(safeDistance, sourceName, destName, 'ola'));
  return OLA_RIDES.map((ride, index) => createPlatformPrice('Ola', ride, safeDistance, rand, index));
}

export function generateRapidoPrices(distanceKm = 10, sourceName = '', destName = '') {
  const safeDistance = Number.isFinite(Number(distanceKm)) && Number(distanceKm) > 0 ? Number(distanceKm) : 10;
  const rand = seededRandom(makeSeed(safeDistance, sourceName, destName, 'rapido'));
  return RAPIDO_RIDES.map((ride, index) => createPlatformPrice('Rapido', ride, safeDistance, rand, index));
}

export function generateAllPrices(distanceKm = 10, sourceName = '', destName = '') {
  const safeDistance = Number.isFinite(Number(distanceKm)) && Number(distanceKm) > 0 ? Number(distanceKm) : 10;
  return [
    ...generateUberPrices(safeDistance, sourceName, destName),
    ...generateOlaPrices(safeDistance, sourceName, destName),
    ...generateRapidoPrices(safeDistance, sourceName, destName),
  ]
    .map((price) => ({ ...price, isMock: true }))
    .sort((a, b) => a.totalMin - b.totalMin);
}

export function generateMockPrices(distanceKm = 10, sourceName = '', destName = '') {
  return generateAllPrices(distanceKm, sourceName, destName);
}

export const MOCK_CITIES = [
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Indore', lat: 22.7196, lng: 75.8577 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { name: 'Gurugram', lat: 28.4595, lng: 77.0266 },
  { name: 'Noida', lat: 28.5355, lng: 77.391 },
  { name: 'Surat', lat: 21.1702, lng: 72.8311 },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
];

export const MOCK_ROUTES = [
  { source: 'Koramangala', destination: 'Whitefield', sourceLat: 12.9352, sourceLng: 77.6245, destLat: 12.9698, destLng: 77.75 },
  { source: 'Indiranagar', destination: 'Electronic City', sourceLat: 12.9784, sourceLng: 77.6408, destLat: 12.8452, destLng: 77.6602 },
  { source: 'HSR Layout', destination: 'Hebbal', sourceLat: 12.9116, sourceLng: 77.6474, destLat: 13.0358, destLng: 77.597 },
  { source: 'Marathahalli', destination: 'Jayanagar', sourceLat: 12.9569, sourceLng: 77.7011, destLat: 12.925, destLng: 77.5938 },
  { source: 'BTM Layout', destination: 'Rajajinagar', sourceLat: 12.9166, sourceLng: 77.6101, destLat: 12.9915, destLng: 77.555 },
  { source: 'MG Road', destination: 'Airport', sourceLat: 12.9756, sourceLng: 77.6068, destLat: 13.1986, destLng: 77.7066 },
  { source: 'Bellandur', destination: 'Manyata Tech Park', sourceLat: 12.9255, sourceLng: 77.6765, destLat: 13.0507, destLng: 77.6229 },
  { source: 'Domlur', destination: 'Yelahanka', sourceLat: 12.9608, sourceLng: 77.6387, destLat: 13.1007, destLng: 77.5963 },
  { source: 'JP Nagar', destination: 'Malleshwaram', sourceLat: 12.9063, sourceLng: 77.5857, destLat: 13.0031, destLng: 77.5643 },
  { source: 'Sarjapur Road', destination: 'KR Puram', sourceLat: 12.9081, sourceLng: 77.6815, destLat: 13.0075, destLng: 77.6959 },
  { source: 'Banashankari', destination: 'Ulsoor', sourceLat: 12.9255, sourceLng: 77.5468, destLat: 12.9817, destLng: 77.6286 },
  { source: 'Silk Board', destination: 'Brookefield', sourceLat: 12.9177, sourceLng: 77.6238, destLat: 12.9663, destLng: 77.7169 },
  { source: 'Kalyan Nagar', destination: 'Cubbon Park', sourceLat: 13.0221, sourceLng: 77.6408, destLat: 12.9763, destLng: 77.5929 },
  { source: 'Basavanagudi', destination: 'Bagmane Tech Park', sourceLat: 12.9406, sourceLng: 77.5738, destLat: 12.9783, destLng: 77.6619 },
  { source: 'Bannerghatta Road', destination: 'Tin Factory', sourceLat: 12.8938, sourceLng: 77.5981, destLat: 13.0004, destLng: 77.6691 },
  { source: 'Hoodi', destination: 'Church Street', sourceLat: 12.9922, sourceLng: 77.7159, destLat: 12.975, destLng: 77.6046 },
  { source: 'Vijayanagar', destination: 'Indiranagar', sourceLat: 12.9719, sourceLng: 77.5459, destLat: 12.9784, destLng: 77.6408 },
  { source: 'RT Nagar', destination: 'Brigade Road', sourceLat: 13.0223, sourceLng: 77.5949, destLat: 12.9702, destLng: 77.6099 },
  { source: 'Kengeri', destination: 'Majestic', sourceLat: 12.9177, sourceLng: 77.4838, destLat: 12.9767, destLng: 77.5713 },
  { source: 'Frazer Town', destination: 'HSR Layout', sourceLat: 12.9989, sourceLng: 77.6147, destLat: 12.9116, destLng: 77.6474 },
  { source: 'Jakkur', destination: 'Koramangala', sourceLat: 13.0785, sourceLng: 77.6069, destLat: 12.9352, destLng: 77.6245 },
  { source: 'Sadashivanagar', destination: 'Whitefield', sourceLat: 13.0068, sourceLng: 77.5813, destLat: 12.9698, destLng: 77.75 },
  { source: 'Hennur', destination: 'Jayanagar', sourceLat: 13.035, sourceLng: 77.6433, destLat: 12.925, destLng: 77.5938 },
  { source: 'Nagarbhavi', destination: 'Marathahalli', sourceLat: 12.9719, sourceLng: 77.5128, destLat: 12.9569, destLng: 77.7011 },
  { source: 'Lalbagh', destination: 'Orion Mall', sourceLat: 12.9507, sourceLng: 77.5848, destLat: 13.0113, destLng: 77.5548 },
  { source: 'Varthur', destination: 'MG Road', sourceLat: 12.9389, sourceLng: 77.7412, destLat: 12.9756, destLng: 77.6068 },
  { source: 'Peenya', destination: 'Electronic City', sourceLat: 13.0329, sourceLng: 77.5273, destLat: 12.8452, destLng: 77.6602 },
  { source: 'Cooke Town', destination: 'BTM Layout', sourceLat: 13.0036, sourceLng: 77.6242, destLat: 12.9166, destLng: 77.6101 },
  { source: 'Kadubeesanahalli', destination: 'Hebbal', sourceLat: 12.9376, sourceLng: 77.6973, destLat: 13.0358, destLng: 77.597 },
  { source: 'Richmond Town', destination: 'Yeshwanthpur', sourceLat: 12.9652, sourceLng: 77.6042, destLat: 13.025, destLng: 77.534 },
];
