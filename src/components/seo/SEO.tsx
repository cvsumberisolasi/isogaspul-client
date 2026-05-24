// ============================================
// SEO Component — ISOGASPUL RACING
// Meta tags + Structured Data
// ============================================

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  schema?: Record<string, unknown>;
  noindex?: boolean;
  keywords?: string;
}

const SITE_URL = 'https://isogaspul.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo-isogaspul.png`;
const SITE_NAME = 'Isogaspul Racing';
const DEFAULT_DESC = 'Importir glasswool, rockwool, ceramicwool, fibercloth HT 800, roving GRC untuk peredam suara dan knalpot racing. Harga kompetitif, pengiriman ke seluruh Indonesia.';
const DEFAULT_KEYWORDS = 'glasswool, rockwool, ceramicwool, fibercloth, roving grc, peredam suara, knalpot racing, insulasi, direct roving, roving gypsum, fiberglass, isogaspul';

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema,
  noindex = false,
  keywords = DEFAULT_KEYWORDS,
}: SEOProps) {
  const fullTitle = title.includes('Isogaspul') ? title : `${title} — Isogaspul Racing`;
  const desc = description || DEFAULT_DESC;
  const url = canonical || SITE_URL;
  const image = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
