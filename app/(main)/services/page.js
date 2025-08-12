import Footer from "../../components/Footer";
import PageBanner from "../../components/ui/PageBanner";
import ScrollToTop from "../../components/ui/ScrollToTop";
import ServiceCard from "../../components/ui/ServiceCard";
import { bannerImages, pageConfig, serviceCardsData } from "../../data";

export default function Services() {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title={pageConfig.services.title}
          description={pageConfig.services.description}
          backgroundImage={bannerImages.services}
        />

        {/* Services Grid Section */}
        <section className="services-grid py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="row g-4">
              {serviceCardsData.map((service, index) => (
                <div key={service.id} className="col-md-6 col-lg-4">
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    icon={service.icon}
                    href={service.href}
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
