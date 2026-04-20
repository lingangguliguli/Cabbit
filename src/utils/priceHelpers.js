// React concepts: pure utility functions shared by hooks, pages, and components

const DEG_TO_RAD = Math.PI / 180;

function hashDistance(source = '', destination = '') {
  const text = `${source}:${destination}`.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = Math.imul(31, hash) + text.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash % 3200) / 100;
  return Number((3 + normalized).toFixed(2));
}

export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (typeof lat1 === 'string' || typeof lng1 === 'string') {
    return hashDistance(lat1, lng1);
  }

  const coords = [lat1, lng1, lat2, lng2].map(Number);
  if (coords.some((value) => !Number.isFinite(value))) return 10;

  const [startLat, startLng, endLat, endLng] = coords;
  const earthRadiusKm = 6371;
  const dLat = (endLat - startLat) * DEG_TO_RAD;
  const dLng = (endLng - startLng) * DEG_TO_RAD;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(startLat * DEG_TO_RAD) *
      Math.cos(endLat * DEG_TO_RAD) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
}

export function findCheapest(prices = []) {
  if (!Array.isArray(prices) || prices.length === 0) return null;
  return prices.reduce((best, item) => (item.totalMin < best.totalMin ? item : best), prices[0]);
}

export function findCheapestByType(prices = []) {
  return prices.reduce((acc, price) => {
    const key = String(price.rideType || '').toLowerCase();
    if (!acc[key] || price.totalMin < acc[key].totalMin) acc[key] = price;
    return acc;
  }, {});
}

export function formatPrice(amount, currency = '₹') {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currency}0`;
  return `${currency}${Math.round(value)}`;
}

export function getSurgeLabel(surge) {
  const value = Number(surge);
  if (!Number.isFinite(value) || value <= 1) return '';
  if (value < 1.5) return `🔥 ${value.toFixed(1)}x surge`;
  return '🔥🔥 High surge';
}

export function getBookingUrl(platform, sourceLat, sourceLng, destLat, destLng) {
  const srcLat = Number(sourceLat);
  const srcLng = Number(sourceLng);
  const dstLat = Number(destLat);
  const dstLng = Number(destLng);
  const hasCoords = [srcLat, srcLng, dstLat, dstLng].every(Number.isFinite);

  if (platform === 'Uber') {
    return hasCoords
      ? `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${srcLat}&pickup[longitude]=${srcLng}&dropoff[latitude]=${dstLat}&dropoff[longitude]=${dstLng}`
      : 'https://m.uber.com/';
  }
  if (platform === 'Ola') {
    return hasCoords
      ? `https://book.olacabs.com/?lat=${srcLat}&lng=${srcLng}&drop_lat=${dstLat}&drop_lng=${dstLng}`
      : 'https://book.olacabs.com/';
  }
  if (platform === 'Rapido') {
    return 'https://www.rapido.bike/';
  }
  return '#';
}

export function getDeepLink(platform, sourceLabel = '', destLabel = '') {
  const src = encodeURIComponent(sourceLabel);
  const dest = encodeURIComponent(destLabel);
  if (platform === 'Uber') return `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${src}&dropoff[formatted_address]=${dest}`;
  if (platform === 'Ola') return `https://book.olacabs.com/?pickup=${src}&drop=${dest}`;
  if (platform === 'Rapido') return 'https://www.rapido.bike/';
  return '#';
}

export function timeAgo(timestamp) {
  if (!timestamp) return 'Recently';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getPlatformColor(platform) {
  if (platform === 'Uber') return { bg: '#000000', text: '#ffffff' };
  if (platform === 'Ola') return { bg: '#26b24b', text: '#ffffff' };
  if (platform === 'Rapido') return { bg: '#ffdd00', text: '#000000' };
  return { bg: '#161b27', text: '#f0f6fc' };
}
