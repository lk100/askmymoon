import tzlookup from 'tz-lookup';

export function getBirthTimeZone(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('A valid birthplace latitude and longitude are required.');
  }

  return tzlookup(lat, lon);
}