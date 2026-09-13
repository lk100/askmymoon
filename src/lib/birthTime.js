import tzlookup from 'tz-lookup';

export function getBirthTimeZone(latitude, longitude) {
  // Return null early if the user hasn't selected a location yet
  if (latitude === null || longitude === null || latitude === undefined || longitude === undefined) {
    return null; 
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  try {
    return tzlookup(lat, lon);
  } catch (error) {
    console.warn('tzlookup boundary miss, falling back to UTC:', error);
    return 'UTC';
  }
}