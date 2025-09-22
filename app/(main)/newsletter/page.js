import { Metadata } from 'next'
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ui/ScrollToTop";

export const metadata = {
  title: 'Newsletter - Decor\'s Digital',
  description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
  keywords: 'newsletter subscription, digital marketing insights, marketing trends, exclusive content, newsletter archive',
  openGraph: {
    title: 'Newsletter - Decor\'s Digital',
    description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
    type: 'website',
    url: 'https://www.thedecorbd.com/newsletter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter - Decor\'s Digital',
    description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
  },
  alternates: {
    canonical: 'https://www.thedecorbd.com/newsletter',
  },
}

const pastEditions = [
  {
    title: "The Future of Digital Marketing in 2024",
    date: "January 15, 2024",
    description: "Exploring emerging trends, AI integration, and what businesses need to know to stay ahead.",
    topics: ["AI Marketing", "Automation", "Personalization", "Data Privacy"]
  },
  {
    title: "Social Media Strategy Masterclass",
    date: "December 20, 2023",
    description: "Deep dive into platform-specific strategies and content creation best practices.",
    topics: ["Content Strategy", "Platform Optimization", "Engagement", "Analytics"]
  },
  {
    title: "E-commerce Growth Hacks",
    date: "November 28, 2023",
    description: "Proven strategies to boost online sales and improve customer retention.",
    topics: ["Conversion Optimization", "Customer Journey", "Retention", "UX Design"]
  },
  {
    title: "Brand Building in the Digital Age",
    date: "October 30, 2023",
    description: "How to create a strong brand presence across digital channels.",
    topics: ["Brand Identity", "Digital Presence", "Storytelling", "Community Building"]
  },
  {
    title: "SEO Trends and Algorithm Updates",
    date: "September 25, 2023",
    description: "Latest search engine updates and how to adapt your SEO strategy.",
    topics: ["Algorithm Updates", "Technical SEO", "Content Optimization", "Local SEO"]
  },
  {
    title: "Paid Advertising ROI Optimization",
    date: "August 18, 2023",
    description: "Maximizing returns on your advertising spend across all platforms.",
    topics: ["ROI Optimization", "Campaign Management", "Audience Targeting", "Budget Allocation"]
  }
]

export default function Newsletter() {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Hero Section */}
        <section className="bg-deep-charcoal text-white py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Newsletter</h1>
              <p className="text-xl text-gray-300 mb-8">
                Stay ahead with the latest digital marketing insights, trends, and exclusive content delivered to your inbox
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-20 bg-soft-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-deep-charcoal mb-4">Subscribe to Our Newsletter</h2>
                  <p className="text-lg text-gray-600">
                    Get exclusive insights, industry trends, and actionable tips delivered straight to your inbox every month.
                  </p>
                </div>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-deep-charcoal mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-deep-charcoal mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-deep-charcoal mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-deep-charcoal mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 border border-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-deep-charcoal mb-3">
                      What topics interest you most? (Select all that apply)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {["Digital Marketing", "SEO & SEM", "Social Media", "Content Strategy", "E-commerce", "Brand Strategy"].map((topic) => (
                        <label key={topic} className="flex items-center">
                          <input
                            type="checkbox"
                            name="interests"
                            value={topic}
                            className="w-4 h-4 text-primary border-light-gray rounded focus:ring-primary"
                          />
                          <span className="ml-2 text-sm text-gray-600">{topic}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="w-4 h-4 text-primary border-light-gray rounded focus:ring-primary mt-1"
                    />
                    <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
                      I agree to receive marketing communications from Decor's Digital. You can unsubscribe at any time. *
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full btn btn-primary py-4 text-lg font-medium"
                  >
                    Subscribe Now
                  </button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Join 5,000+ marketing professionals who trust our insights
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Archive Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-deep-charcoal mb-4">Newsletter Archive</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Catch up on our previous editions packed with valuable insights and actionable strategies
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEditions.map((edition, index) => (
                <div key={index} className="bg-soft-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="mb-4">
                    <span className="text-sm text-primary font-medium">{edition.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-3">{edition.title}</h3>
                  <p className="text-gray-600 mb-4">{edition.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-deep-charcoal mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {edition.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-light-gray text-xs font-medium text-deep-charcoal rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="btn btn-secondary w-full hover:bg-primary hover:text-white transition-colors">
                    Read Edition
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-light-gray">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-deep-charcoal mb-4">Why Subscribe?</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-3">Exclusive Insights</h3>
                  <p className="text-gray-600">Get access to industry data and trends not available anywhere else</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-3">Actionable Tips</h3>
                  <p className="text-gray-600">Practical strategies you can implement immediately in your business</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">⏰</span>
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-3">Stay Ahead</h3>
                  <p className="text-gray-600">Be the first to know about emerging trends and opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ScrollToTop />
    </>
  );
}