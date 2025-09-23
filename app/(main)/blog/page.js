import { Metadata } from 'next'
import Footer from "../../components/Footer";
import PageBanner from "../../components/ui/PageBanner";
import BlogCard from "../../components/ui/BlogCard";
import AosInit from "../../components/AosInit";
import { bannerImages, blogData, pageConfig } from "../../data";

export default function Blog() {
  return (
    <>
      <AosInit />

      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title={pageConfig.blog.title}
          description={pageConfig.blog.description}
          backgroundImage={bannerImages.blog}
        />

        {/* Blog Section */}
        <section className="blog-section py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="row">
              {blogData.map((post, index) => (
                <div key={post.id} className="col-lg-6 mb-7">
                  <BlogCard
                    title={post.title}
                    date={post.date}
                    image={post.image}
                    slug={post.slug}
                    delay={(index + 1) * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
