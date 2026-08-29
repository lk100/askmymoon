import { NextResponse } from 'next/server';

const PRICES = {
  IN: { currency: 'INR', amount: 4900, displayPrice: '₹49' },
  INTERNATIONAL: { currency: 'USD', amount: 100, displayPrice: '$1' },
};

export function GET(request) {
  const country = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-client-country') ||
    'IN'
  ).toUpperCase();
  const price = country === 'IN' ? PRICES.IN : PRICES.INTERNATIONAL;

  return NextResponse.json(price);
}
