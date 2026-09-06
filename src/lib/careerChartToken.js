import crypto from 'node:crypto';

const TOKEN_SECRET = process.env.CAREER_CHART_TOKEN_SECRET || 'development-career-chart-secret';

function sign(payload) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
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
  return decoded.chart;
}