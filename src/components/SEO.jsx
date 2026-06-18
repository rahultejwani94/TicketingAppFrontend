"use client";

import { Helmet } from "react-helmet-async";

// Update this if the production domain ever changes — every absolute
// URL on the page (canonical, og:url, og:image, JSON-LD) is built from it.
const SITE_URL = "https://thenotebookconcert.in";
const SITE_NAME = "The Notebook Concert";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const toAbsoluteUrl = (path) => {
  if (!path) return DEFAULT_IMAGE;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

/**
 * Drop this near the top of any page to control that page's <title>,
 * meta description, canonical link, Open Graph / Twitter tags, and
 * optional JSON-LD structured data. Each route should render its own
 * <SEO /> with content specific to that page — Helmet merges these
 * into <head> and cleans up automatically on unmount.
 */
export default function SEO({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = `${SITE_URL}${path}`;
  const ogImage = toAbsoluteUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME, toAbsoluteUrl };
