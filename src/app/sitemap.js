import { blogPosts } from '@/data/blogPosts';

export default function sitemap() {
  const siteUrl = 'https://www.askmymoon.com';
  const staticRoutes = [
    '',
    '/about',
    '/blogs',
    '/checkout',
    '/consultation',
    '/privacy',
    '/terms',
  ];

  const blogRoutes = blogPosts.map((post) => `/blogs/${post.slug}`);

  return [...staticRoutes, ...blogRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/blogs' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/blogs' ? 0.8 : 0.7,
  }));
}
