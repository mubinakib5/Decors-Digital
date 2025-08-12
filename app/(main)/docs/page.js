import { docsData, pageConfig, bannerImages } from '../../data';
import PageBanner from '../../components/ui/PageBanner';
import DocCard from '../../components/ui/DocCard';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ui/ScrollToTop';

export default function Docs() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title={pageConfig.docs.title}
          description={pageConfig.docs.description}
          backgroundImage={bannerImages.docs}
        />

        {/* Docs Section */}
        <section className="docs py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="row g-4">
              {docsData.map((doc, index) => (
                <div key={doc.id} className="col-md-6 col-lg-4">
                  <DocCard
                    title={doc.title}
                    description={doc.description}
                    icon={doc.icon}
                    href={doc.href}
                    delay={(index + 1) * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ScrollToTop />
    </>
  );
}
