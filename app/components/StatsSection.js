import Image from 'next/image';
import { statsData } from '../data';
import Button from './ui/Button';

export default function StatsSection() {
  return (
    <section className="stats-facts py-5 py-lg-11 py-xl-12 position-relative overflow-hidden">
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
                01
              </span>
              <hr className="border-line" />
              <span className="badge text-bg-dark">Stats & facts</span>
            </div>
          </div>
          <div className="col-xl-8 col-xxl-7">
            <div className="d-flex flex-column gap-9">
              <div className="row">
                <div className="col-xxl-8">
                  <div
                    className="d-flex flex-column gap-6"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <h2 className="mb-0">
                      High quality digital solutions you can trust.
                    </h2>
                    <p className="fs-5 mb-0">
                      When selecting an advertising agency, it's essential to
                      consider its reputation, experience, and the specific
                      needs of your project.
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                {statsData.map((stat, index) => (
                  <div key={stat.id} className="col-md-6 col-lg-4 mb-7 mb-lg-0">
                    <div
                      className="d-flex flex-column gap-6 pt-9 border-top"
                      data-aos="fade-up"
                      data-aos-delay={(index + 2) * 100}
                      data-aos-duration="1000"
                    >
                      <h2 className="mb-0 fs-14">
                        <span className="count" data-target={stat.target}>{stat.number}</span>
                      </h2>
                      <p className="mb-0">{stat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                href="/about-us"
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-duration="1000"
              >
                <span className="btn-text">Who we are</span>
                <iconify-icon
                  icon="lucide:arrow-up-right"
                  className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                ></iconify-icon>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="position-absolute bottom-0 start-0"
        data-aos="zoom-in"
        data-aos-delay="100"
        data-aos-duration="1000"
      >
        <Image
          src="/assets/images/backgrounds/stats-facts-bg.svg"
          alt=""
          width={400}
          height={300}
          className="img-fluid"
        />
      </div>
    </section>
  );
}
