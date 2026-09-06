
import crypto from 'node:crypto';

const CAREER_DATA_URL = 'https://taarak-astro.onrender.com/api/career-data';

function formatApiTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00 ${suffix}`;
}

export function getCareerChartFingerprint({ dob, time, lat, lon, timeZone }) {
  const input = JSON.stringify({ dob, time, lat: Number(lat), lon: Number(lon), timeZone });
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function fetchCareerChart({ name, dob, time, lat, lon, timeZone }) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!name?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dob) || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error('Valid name, date of birth, and time of birth are required.');
  }
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error('Valid birth place coordinates are required.');
  }

  if (!timeZone?.trim()) throw new Error('A valid birth timezone is required.');

  const response = await fetch(CAREER_DATA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date_input: dob,
      time_input: formatApiTime(time),
      latitude,
      longitude,
      time_zone: timeZone,
    }),
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || 'Unable to calculate the career chart.');
  if (!data || typeof data !== 'object') throw new Error('The career chart API returned an invalid response.');

  return {
    ...data,
    _chartFingerprint: getCareerChartFingerprint({ dob, time, lat: latitude, lon: longitude, timeZone }),
  };
}