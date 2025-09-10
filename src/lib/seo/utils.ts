/**
 * SEO Utilities for Tait Media Solutions
 * Handles meta tags, structured data, and SEO optimization
 */

export interface SEOMeta {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  twitter: string;
  defaultImage: string;
  logo: string;
  author: string;
  keywords: string;
  locale: string;
  type: string;
}

/**
 * Generate optimized page title with fallbacks
 */
export function generateTitle(pageMeta: SEOMeta | undefined, siteConfig: SiteConfig): string {
  if (!pageMeta?.title) {
    return siteConfig.title;
  }
  
  // Don't add site title if it's already included
  if (pageMeta.title.includes(siteConfig.title)) {
    return pageMeta.title;
  }
  
  return `${pageMeta.title} | ${siteConfig.title}`;
}

/**
 * Generate canonical URL with proper formatting
 */
export function generateCanonicalUrl(pathname: string, siteUrl: string): string {
  // Remove trailing slashes and ensure clean URLs
  const cleanPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  return `${siteUrl}${cleanPath}`;
}

/**
 * Generate structured data for Organization
 */
export function generateOrganizationSchema(siteConfig: SiteConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    foundingDate: '2024',
    industry: 'Digital Marketing',
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 37.7749,
        longitude: -122.4194
      },
      geoRadius: 1000
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO Services',
            description: 'Search Engine Optimization services to improve organic visibility'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Design',
            description: 'Custom website design and development services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing',
            description: 'Comprehensive digital marketing campaigns and strategy'
          }
        }
      ]
    },
    sameAs: [
      'https://twitter.com/TaitMediaSolutions',
      'https://linkedin.com/company/tait-media-solutions'
    ]
  };
}

/**
 * Generate structured data for Article/Blog posts
 */
export function generateArticleSchema(
  pageMeta: SEOMeta,
  siteConfig: SiteConfig,
  pathname: string
) {
  if (pageMeta.type !== 'article' || !pageMeta.publishedTime) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageMeta.title,
    description: pageMeta.description,
    image: pageMeta.image || siteConfig.defaultImage,
    author: {
      '@type': 'Organization',
      name: siteConfig.author,
      url: siteConfig.url
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.title,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logo}`
      }
    },
    datePublished: pageMeta.publishedTime,
    dateModified: pageMeta.modifiedTime || pageMeta.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': generateCanonicalUrl(pathname, siteConfig.url)
    }
  };
}

/**
 * Generate structured data for Service pages
 */
export function generateServiceSchema(
  pageMeta: SEOMeta,
  siteConfig: SiteConfig,
  pathname: string,
  serviceDetails?: {
    price?: string;
    priceRange?: string;
    duration?: string;
    category?: string;
  }
) {
  if (pageMeta.type !== 'service') {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pageMeta.title,
    description: pageMeta.description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.title,
      url: siteConfig.url
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: pageMeta.title,
      itemListElement: [
        {
          '@type': 'Offer',
          price: serviceDetails?.price,
          priceRange: serviceDetails?.priceRange,
          url: generateCanonicalUrl(pathname, siteConfig.url),
          category: serviceDetails?.category || 'Digital Marketing'
        }
      ]
    }
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  pathname: string,
  siteConfig: SiteConfig
): object | null {
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  if (pathSegments.length === 0) {
    return null; // No breadcrumbs for homepage
  }

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteConfig.url
    }
  ];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
      item: `${siteConfig.url}${currentPath}`
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };
}

/**
 * Extract keywords from content for meta keywords
 */
export function extractKeywords(content: string, baseKeywords: string[] = []): string {
  // This is a simple implementation - in production, you might want to use NLP libraries
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 
    'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had'
  ]);

  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  // Count word frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Get top words by frequency
  const topWords = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);

  return [...baseKeywords, ...topWords].join(', ');
}

/**
 * Validate and sanitize meta description
 */
export function sanitizeDescription(description: string): string {
  // Remove HTML tags and limit to 160 characters
  const cleaned = description.replace(/<[^>]*>/g, '').trim();
  
  if (cleaned.length <= 160) {
    return cleaned;
  }

  // Find the last complete sentence within 160 chars
  const truncated = cleaned.substring(0, 157);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > 100) {
    return truncated.substring(0, lastSentence + 1);
  }

  return truncated + '...';
}

/**
 * Generate sitemap data for a page
 */
export function generateSitemapEntry(
  pathname: string,
  siteConfig: SiteConfig,
  pageMeta?: SEOMeta,
  priority: number = 0.8,
  changefreq: 'daily' | 'weekly' | 'monthly' = 'weekly'
) {
  return {
    url: generateCanonicalUrl(pathname, siteConfig.url),
    lastmod: pageMeta?.modifiedTime || new Date().toISOString(),
    changefreq,
    priority
  };
}

/**
 * Calculate estimated reading time for content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generate social media sharing URLs
 */
export function generateSharingUrls(url: string, title: string, description: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
}