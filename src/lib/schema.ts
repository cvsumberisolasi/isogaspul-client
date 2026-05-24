// ============================================
// JSON-LD Structured Data — ISOGASPUL
// ============================================

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://isogaspul.com';

/** Organization schema — for homepage */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Isogaspul Racing',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-isogaspul.png`,
    description: 'Importir glasswool, rockwool, ceramicwool, fibercloth HT 800, roving GRC untuk peredam suara dan knalpot racing.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sholeh Iskandar No. 43, Kayumanis',
      addressLocality: 'Bogor',
      addressRegion: 'Jawa Barat',
      postalCode: '16169',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+6281394373007',
      contactType: 'sales',
      availableLanguage: ['Indonesian'],
    },
    sameAs: ['https://wa.me/6281394373007'],
  };
}

/** Product schema — for product detail page */
export function productSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  url: string;
  availability?: string;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'IDR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: product.url,
    },
  };
}

/** FAQ schema — for product or blog pages */
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Article/BlogPosting schema */
export function articleSchema(article: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'Tim Isogaspul',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Isogaspul Racing',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-isogaspul.png`,
      },
    },
  };
}

/** WebSite schema with SearchAction */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Isogaspul Racing',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/produk?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** LocalBusiness schema */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CV. Sumber Isolasi — Isogaspul Racing',
    image: `${SITE_URL}/logo-isogaspul.png`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+6281394373007',
    email: 'cvsumberisolasi@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sholeh Iskandar No. 43, Kayumanis',
      addressLocality: 'Bogor',
      addressRegion: 'Jawa Barat',
      postalCode: '16169',
      addressCountry: 'ID',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.5896,
      longitude: 106.7918,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    priceRange: 'Rp 85.000 - Rp 350.000',
  };
}
