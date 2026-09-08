import { NextResponse } from 'next/server';

const PRICES = {
  domain_report: {
    IN: { currency: 'INR', amount: 4900, displayPrice: '₹49' },
    INTERNATIONAL: { currency: 'USD', amount: 100, displayPrice: '$1' },
  },
  ai_astrologer: {
    IN: { currency: 'INR', amount: 3900, displayPrice: '₹39' },
    INTERNATIONAL: { currency: 'USD', amount: 47, displayPrice: '$0.47' },
  },
};

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const product = searchParams.get('product') || 'domain_report';

  const country = (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-client-country') ||
    'IN'
  ).toUpperCase();

  const productPrices = PRICES[product] || PRICES.domain_report;
  const price = country === 'IN' ? productPrices.IN : productPrices.INTERNATIONAL;

  return NextResponse.json(price);
}