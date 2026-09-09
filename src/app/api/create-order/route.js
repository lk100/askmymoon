import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const ALLOWED_PRICES = {
  domain_report: { INR: 4900, USD: 100 },
  ai_astrologer: { INR: 3900, USD: 49 },
  ai_astrologer_bundle_5: { INR: 12100, USD: 149 }, // 5 questions for ₹121 / $1.49
};

function getCountry(request) {
  return (
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('x-client-country') ||
    'IN'
  ).toUpperCase();
}

export async function POST(request) {
  try {
    const { amount, currency, product } = await request.json();
    const country = getCountry(request);
    const expectedCurrency = country === 'IN' ? 'INR' : 'USD';

    const productPrices = ALLOWED_PRICES[product];

    if (
      !productPrices ||
      !Number.isInteger(amount) ||
      amount < 100 ||
      !Object.hasOwn(productPrices, currency) ||
      currency !== expectedCurrency ||
      amount !== productPrices[expectedCurrency]
    ) {
      return NextResponse.json({ error: 'Invalid payment amount or currency.' }, { status: 400 });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay is not configured.' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID.trim(),
      key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
    });
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `${product}_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    const status = error?.statusCode === 401 || error?.statusCode === 403 ? 401 : 500;
    return NextResponse.json(
      {
        error: status === 401
          ? 'Razorpay authentication failed. Use a matching active Test Mode key ID and secret, then restart the server.'
          : 'Unable to create Razorpay order.',
      },
      { status }
    );
  }
}