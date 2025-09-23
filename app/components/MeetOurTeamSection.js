import { teamData } from '../data';
import TeamCard from './ui/TeamCard';

export default function MeetOurTeamSection() {
  return (
    <section className="meet-our-team py-5 py-lg-11 py-xl-12">
      <div className="container">
        <div className="d-flex flex-column gap-5 gap-xl-11">
          <div className="row justify-content-center">
            <div className="col-auto">
              <div className="d-flex flex-column gap-6 text-center" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                <h2 className="mb-0">Meet our team</h2>
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
