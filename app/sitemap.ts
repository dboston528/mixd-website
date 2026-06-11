import { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: Array<{ path: string; priority: number }> = [
    { path: '', priority: 1 },
    { path: '/weddings', priority: 0.9 },
    { path: '/private-events', priority: 0.9 },
    { path: '/schools', priority: 0.9 },
    { path: '/mitzvahs', priority: 0.9 },
    { path: '/pricing', priority: 0.8 },
    { path: '/contact', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/brochure', priority: 0.5 },
    { path: '/services', priority: 0.4 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority,
  }));
}
