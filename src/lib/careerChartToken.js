import crypto from 'node:crypto';

const TOKEN_SECRET = process.env.CAREER_CHART_TOKEN_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'development-career-chart-secret');
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getTokenSecret() {
  if (!TOKEN_SECRET) throw new Error('Career chart token secret is not configured.');
  return TOKEN_SECRET;
}

function sign(payload) {
  return crypto.createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
}

export function createCareerChartToken(chart) {
  const payload = Buffer.from(JSON.stringify({ chart, createdAt: Date.now() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readCareerChartToken(token) {
  if (typeof token !== 'string') throw new Error('A chart token is required.');
  const [payload, signature] = token.split('.');
  if (!payload || !signature) throw new Error('Invalid chart token.');

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    throw new Error('Invalid chart token.');
  }

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (!decoded.chart || typeof decoded.chart !== 'object') throw new Error('Invalid chart token.');
  if (!Number.isFinite(decoded.createdAt) || Date.now() - decoded.createdAt > TOKEN_MAX_AGE_MS) {
    throw new Error('The chart session has expired. Please regenerate your chart.');
  }
  return decoded.chart;
}