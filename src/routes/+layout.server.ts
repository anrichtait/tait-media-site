import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
  return {
    site: {
      title: 'Tait Media Solutions',
      description: 'Award-winning digital marketing agency delivering high-performance campaigns with Awwwards-level design. SEO, PPC, and creative solutions that drive results.',
      url: 'https://taitmedia.com',
      twitter: '@TaitMediaSolutions',
      defaultImage: '/og/default.jpg',
      logo: '/logo.png',
      favicon: '/favicon.ico',
      author: 'Tait Media Solutions',
      keywords: 'digital marketing, SEO, PPC, web design, creative agency, performance marketing, awwwards',
      lang: 'en',
      locale: 'en_US',
      type: 'website',
      themeColor: '#1e40af', // Red Bull Racing inspired blue
      brandColors: {
        primary: '#1e40af',   // RB Racing Blue
        secondary: '#dc2626', // RB Racing Red
        accent: '#fbbf24',    // RB Racing Yellow
        dark: '#0f172a',      // Dark blue
        light: '#f8fafc'      // Light blue-gray
      }
    },
    currentUrl: url.pathname,
    timestamp: new Date().toISOString()
  };
};
