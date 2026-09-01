export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/report/'],
    },
    sitemap: 'https://www.askmymoon.com/sitemap.xml',
  };
}
