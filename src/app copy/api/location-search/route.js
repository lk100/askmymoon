import { NextResponse } from 'next/server';

const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_RESULTS = 5;
const cache = new Map();

function normalizeQuery(value) {
  return String(value || '').trim().toLowerCase();
}

function sanitizeSuggestions(items) {
  if (!Array.isArray(items)) return [];

  return items.slice(0, MAX_RESULTS).map((item) => ({
    place_id: item.place_id,
    display_name: item.display_name,
    lat: item.lat,
    lon: item.lon,
  }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.trim();

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const normalizedQuery = normalizeQuery(query);
  const cached = cache.get(normalizedQuery);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  try {
    const upstreamUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${MAX_RESULTS}&addressdetails=1`;

    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'User-Agent': 'AskMyMoon/1.0 (+https://askmymoon.com)',
      },
      next: {
        revalidate: 600,
      },
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await upstreamResponse.json();
    const suggestions = sanitizeSuggestions(data);

    cache.set(normalizedQuery, {
      timestamp: now,
      data: suggestions,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Location search proxy failed:', error);
    return NextResponse.json([], { status: 200 });
  }
}
