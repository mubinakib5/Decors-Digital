import { teamData } from '../data';
import TeamCard from './ui/TeamCard';

export default function MeetOurTeamSection() {
  return (
    <section className="meet-our-team py-5 py-lg-11 py-xl-12">
      <div className="container">
        <div className="d-flex flex-column gap-5 gap-xl-11">
          <div className="row gap-7 gap-xl-0">
            <div className="col-xl-4 col-xxl-4">
              <div className="d-flex align-items-center gap-7 py-2" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
                <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">06</span>
                <hr className="border-line bg-white" />
                <span className="badge text-bg-dark">The team</span>
              </div>
            </div>
            <div className="col-xl-8 col-xxl-7">
              <div className="row">
                <div className="col-xxl-8">
                  <div className="d-flex flex-column gap-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                    <h2 className="mb-0">Meet our team</h2>
                    <p className="fs-5 mb-0 text-opacity-70">
                      Our team is committed to redefining digital experiences through innovative web solutions while fostering a diverse and collaborative environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            {teamData.map((member, index) => (
              <div key={member.id} className="col-md-6 col-xl-3 mb-7 mb-xl-0">
                <TeamCard
                  name={member.name}
                  position={member.position}
                  image={member.image}
                  socialLinks={member.socialLinks}
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
