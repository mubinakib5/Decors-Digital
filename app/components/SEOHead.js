import Head from 'next/head';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  image = '/assets/images/logos/logo-dark.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}) => {
  const siteUrl = 'https://decorsdigital.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author || "Decor's Digital"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Decor's Digital" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@DecorsDigital" />
      <meta name="twitter:site" content="@DecorsDigital" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime} />
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* Structured Data for Articles */}
      {type === 'article' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": title,
              "description": description,
              "image": fullImageUrl,
              "author": {
                "@type": "Organization",
                "name": author || "Decor's Digital"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Decor's Digital",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/assets/images/logos/logo-dark.png`
                }
              },
              "datePublished": publishedTime,
              "dateModified": modifiedTime,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": fullUrl
              }
            }),
          }}
        />
      )}
    </Head>
  );
};

export default SEOHead;
