import { projectsData } from '../data';
import ProjectCard from './ui/ProjectCard';

export default function FeaturedProjectsSection() {
  return (
    <section className="featured-projects py-5 py-lg-11 py-xl-12 bg-light-gray">
      <div className="d-flex flex-column gap-5 gap-xl-11">
        <div className="container">
          <div className="row gap-7 gap-xl-0">
            <div className="col-xl-4 col-xxl-4">
              <div
                className="d-flex align-items-center gap-7 py-2"
                data-aos="fade-right"
                data-aos-delay="100"
                data-aos-duration="1000"
              >
                <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">
                  02
                </span>
                <hr className="border-line" />
                <span className="badge text-bg-dark">Portfolio</span>
              </div>
            </div>
            <div className="col-xl-8 col-xxl-7">
              <div className="row">
                <div className="col-xxl-8">
                  <div
                    className="d-flex flex-column gap-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <h2 className="mb-0">Featured projects</h2>
                    <p className="fs-5 mb-0">
                      A glimpse into our creativity—exploring innovative designs, successful collaborations, and transformative digital experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="featured-projects-slider px-3">
          <div className="owl-carousel owl-theme">
            {projectsData.map((project, index) => (
              <div key={project.id} className="item">
                <ProjectCard
                  title={project.title}
                  image={project.image}
                  tags={project.tags}
                  href={project.href}
                  delay={(index + 1) * 100}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
