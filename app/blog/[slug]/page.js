import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';
import { COMPANY_INFO } from '../../constants';

// This would typically come from a database or CMS
const blogPosts = {
  'a-campaign-that-connects': {
    title: 'A campaign that connects',
    description: 'In a world where standing still means falling behind, we knew it was time for a bold transformation..',
    content: 'At Studiova, we\'re always evolving, and our latest brand redesign is a bold step forward. This transformation reflects our commitment to innovation and growth, both in how we look and how we connect with you.',
    image: '/assets/images/backgrounds/blog-detail-img.jpg',
    bannerImage: '/assets/images/backgrounds/blog-detail-banner.jpg',
    publishedTime: '2024-01-15T10:00:00Z',
    modifiedTime: '2024-01-15T10:00:00Z',
    author: 'Decor\'s Digital Team',
    tags: ['branding', 'design', 'transformation'],
    fullContent: `
      Blogger outreach campaigns are strategic efforts by businesses to collaborate with influential bloggers, aiming to promote products, services, or content to a broader audience. This form of influencer marketing leverages the blogger's established credibility and reach within a specific niche.
      
      Key Steps to Launch a Successful Blogger Outreach Campaign:
      
      1. Define Your Goals:
      Clearly outline what you aim to achieve, such as increasing brand awareness, driving website traffic, or boosting product sales.
      
      2. Identify Relevant Bloggers:
      Research and compile a list of bloggers whose audience aligns with your target demographic. Utilize tools like BuzzSumo to discover key influencers in your industry.
      
      Engage Authentically:
      Prior to outreach, engage with the bloggers' content by commenting on posts or sharing their articles. This establishes a genuine connection and familiarity.
      
      Craft Personalized Outreach Messages: Develop tailored emails that acknowledge the blogger's work and propose a mutually beneficial collaboration. Avoid generic templates to increase response rates.
    `
  },
  'breaking-boundaries-brand-redesign': {
    title: 'An breaking boundaries our latest brand redesign',
    description: 'Exploring the transformative journey of our brand evolution and the strategic thinking behind our new identity.',
    content: 'Our brand redesign represents more than just a visual update—it\'s a reflection of our evolution as a company and our commitment to staying ahead of industry trends.',
    image: '/assets/images/backgrounds/blog-detail-img.jpg',
    bannerImage: '/assets/images/backgrounds/blog-detail-banner.jpg',
    publishedTime: '2024-01-10T10:00:00Z',
    modifiedTime: '2024-01-10T10:00:00Z',
    author: 'Decor\'s Digital Team',
    tags: ['branding', 'design', 'evolution'],
    fullContent: `
      Brand redesign is a strategic process that involves rethinking and updating a company's visual identity, messaging, and overall brand positioning. This comprehensive approach ensures that the brand remains relevant and competitive in an ever-changing market landscape.
      
      The Process of Brand Redesign:
      
      1. Research and Analysis:
      Understanding the current market position, competitor analysis, and identifying opportunities for improvement.
      
      2. Strategy Development:
      Creating a clear vision for the new brand identity and how it will differentiate from competitors.
      
      3. Design and Implementation:
      Developing the visual elements, messaging, and ensuring consistency across all touchpoints.
    `
  },
  'recognized-for-design': {
    title: 'Recognized for design',
    description: 'Celebrating our achievements in design excellence and the recognition we\'ve received from the industry.',
    content: 'Being recognized for our design work is a testament to our team\'s creativity, dedication, and commitment to delivering exceptional results for our clients.',
    image: '/assets/images/backgrounds/blog-detail-img.jpg',
    bannerImage: '/assets/images/backgrounds/blog-detail-banner.jpg',
    publishedTime: '2024-01-05T10:00:00Z',
    modifiedTime: '2024-01-05T10:00:00Z',
    author: 'Decor\'s Digital Team',
    tags: ['design', 'awards', 'recognition'],
    fullContent: `
      Design recognition is not just about awards—it's about creating meaningful experiences that resonate with users and drive business results. Our approach to design combines creativity with strategic thinking to deliver solutions that make a difference.
      
      What Makes Great Design:
      
      1. User-Centered Approach:
      Understanding user needs and creating solutions that address real problems.
      
      2. Innovation and Creativity:
      Pushing boundaries and exploring new possibilities while maintaining usability.
      
      3. Strategic Thinking:
      Aligning design decisions with business objectives and user goals.
    `
  },
  'modern-lens-perspectives': {
    title: 'The Modern Lens Perspectives on Culture & Trends',
    description: 'Exploring contemporary perspectives on culture, trends, and their impact on design and business.',
    content: 'Understanding cultural trends and their influence on design is crucial for creating relevant and impactful solutions that connect with today\'s audiences.',
    image: '/assets/images/backgrounds/blog-detail-img.jpg',
    bannerImage: '/assets/images/backgrounds/blog-detail-banner.jpg',
    publishedTime: '2024-01-01T10:00:00Z',
    modifiedTime: '2024-01-01T10:00:00Z',
    author: 'Decor\'s Digital Team',
    tags: ['culture', 'trends', 'design'],
    fullContent: `
      Culture and trends shape how we perceive and interact with the world around us. In design, understanding these influences helps us create solutions that are not only visually appealing but also culturally relevant and meaningful.
      
      Key Trends Shaping Design:
      
      1. Digital Transformation:
      The rapid adoption of digital technologies and their impact on user expectations.
      
      2. Sustainability:
      Growing awareness of environmental issues and the demand for sustainable design solutions.
      
      3. Personalization:
      The expectation for tailored experiences that meet individual needs and preferences.
    `
  }
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.tags, 'blog', 'digital agency', 'design', 'branding'],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://decorsdigital.com/blog/${slug}`,
      siteName: COMPANY_INFO.name,
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedTime,
      modifiedTime: post.modifiedTime,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `https://decorsdigital.com/blog/${slug}`,
    },
  };
}

export default function BlogDetail({ params }) {
  const { slug } = params;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="container py-5">
        <h1>Blog post not found</h1>
        <Link href="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://decorsdigital.com${post.image}`,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": COMPANY_INFO.name,
      "logo": {
        "@type": "ImageObject",
        "url": "https://decorsdigital.com/assets/images/logos/logo-dark.png"
      }
    },
    "datePublished": post.publishedTime,
    "dateModified": post.modifiedTime,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://decorsdigital.com/blog/${slug}`
    },
    "keywords": post.tags.join(', '),
    "articleSection": "Blog"
  };

  return (
    <>
      <AosInit />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Page Wrapper */}
      <main className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: `url('${post.bannerImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '60vh'
          }}
        >
          <div className="container">
            <div className="d-flex flex-column gap-4 pb-5 pb-xl-10 position-relative z-1">
              <div className="row align-items-center">
                <div className="col-xl-4">
                  <div
                    className="d-flex align-items-center gap-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <Image
                      src="/assets/images/svgs/primary-leaf.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="img-fluid animate-spin"
                    />
                    <p className="mb-0 text-white fs-5 text-opacity-70">
                      {post.description}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="d-flex align-items-end gap-3"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <h1 className="mb-0 fs-15 text-white lh-1">
                  {post.title}
                </h1>
                <a
                  href="javascript:void(0)"
                  className="p-1 ps-7 bg-primary rounded-pill"
                >
                  <span className="bg-white round-52 rounded-circle d-flex align-items-center justify-content-center">
                    <iconify-icon
                      icon="lucide:arrow-up-right"
                      className="fs-8 text-dark"
                    ></iconify-icon>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Detail Section */}
        <article className="blog-detail py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="d-flex flex-column gap-7 gap-xl-11">
              <div className="row gap-4 gap-lg-0">
                <div className="col-lg-4">
                  <h2
                    className="fs-13 mb-0"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    Scroll to read
                  </h2>
                </div>
                <div className="col-lg-8">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <p className="fs-5 mb-0">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="blog-detail-img"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="1000"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="img-fluid"
                />
              </div>
              <div className="row justify-content-end">
                <div className="col-lg-8">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    data-aos-duration="1000"
                  >
                    <div dangerouslySetInnerHTML={{ 
                      __html: post.fullContent.split('\n').map((paragraph, index) => {
                        if (paragraph.trim().startsWith('1.') || paragraph.trim().startsWith('2.') || paragraph.trim().startsWith('3.')) {
                          return `<h4>${paragraph.trim()}</h4>`;
                        } else if (paragraph.trim().startsWith('Key') || paragraph.trim().startsWith('What') || paragraph.trim().startsWith('The') || paragraph.trim().startsWith('Brand') || paragraph.trim().startsWith('Design') || paragraph.trim().startsWith('Culture') || paragraph.trim().startsWith('Key')) {
                          return `<p class="fs-5 mb-6"><strong>${paragraph.trim()}</strong></p>`;
                        } else if (paragraph.trim()) {
                          return `<p class="fs-5 mb-6">${paragraph.trim()}</p>`;
                        }
                        return '';
                      }).join('')
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2">
        <button
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0"
          id="scrollToTopBtn"
          aria-label="Scroll to top"
        >
          <iconify-icon
            icon="lucide:arrow-up"
            className="fs-7 text-dark"
          ></iconify-icon>
        </button>
      </div>
    </>
  );
}
