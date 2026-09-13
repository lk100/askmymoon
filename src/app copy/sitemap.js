import { blogPosts } from '@/data/blogPosts';
import { ASTROLOGER_CATEGORY_LIST } from '@/lib/astrologerCategories';

export default function sitemap() {
  const siteUrl = 'https://www.askmymoon.com';

  const staticRoutes = [
    '',
    '/about',
    '/blogs',
    '/checkout',
    '/consultation',
    '/astrologers',
    '/numerology',
    '/privacy',
    '/terms',
  ];

  // Pull every category's route dynamically instead of hardcoding one, so
  // this sitemap stays correct if categories are ever added/removed.
  const astrologerCategoryRoutes = ASTROLOGER_CATEGORY_LIST.map((cat) => cat.href);

  const blogRoutes = blogPosts.map((post) => `/blogs/${post.slug}`);

  const allRoutes = [...staticRoutes, ...astrologerCategoryRoutes, ...blogRoutes];

  return allRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/blogs' ? 'weekly' : 'monthly',
    priority:
      route === ''
        ? 1
        : route === '/blogs'
        ? 0.8
        : route.startsWith('/astrologers/')
        ? 0.8 // category pages are high-intent landing pages — worth a bump
        : 0.7,
  }));
}