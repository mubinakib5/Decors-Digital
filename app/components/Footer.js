import Link from 'next/link';
import { navigationData, contactData } from '../data';

export default function Footer() {
  return (
    <footer className="footer bg-dark py-5 py-lg-11 py-xl-12" role="contentinfo">
      <div className="container">
        <div className="row">
          <div className="col-xl-5 mb-8 mb-xl-0">
            <div className="d-flex flex-column gap-8 pe-xl-5">
              <h2 className="mb-0 text-white">Build something together?</h2>
              <div className="d-flex flex-column gap-2" role="group" aria-label="Contact information">
                <a
                  href={`mailto:${contactData.email}`}
                  className="link-hover hstack gap-3 text-white fs-5"
                  aria-label={`Send email to ${contactData.email}`}
                >
                  <iconify-icon
                    icon="lucide:arrow-up-right"
                    className="fs-7 text-primary"
                    aria-hidden="true"
                  ></iconify-icon>
                  {contactData.email}
                </a>
                <a
                  href={contactData.mapUrl}
                  target="_blank"
                  className="link-hover hstack gap-3 text-white fs-5"
                  rel="noopener noreferrer"
                  aria-label={`View our location: ${contactData.address}`}
                >
                  <iconify-icon
                    icon="lucide:map-pin"
                    className="fs-7 text-primary"
                    aria-hidden="true"
                  ></iconify-icon>
                  {contactData.address}
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-xl-2 mb-8 mb-xl-0">
            <nav aria-label="Footer navigation">
              <ul className="footer-menu list-unstyled mb-0 d-flex flex-column gap-2">
                {navigationData.footerMenu.map((item, index) => (
                  <li key={index}>
                    <Link className="link-hover fs-5 text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-md-4 col-xl-2 mb-8 mb-xl-0">
            <nav aria-label="Additional navigation">
              <ul className="footer-menu list-unstyled mb-0 d-flex flex-column gap-2">
                {navigationData.socialLinks.map((social, index) => (
                  <li key={index}>
                    <a 
                      className="link-hover fs-5 text-white" 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {social.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="col-md-4 col-xl-3 mb-8 mb-xl-0">
            <p className="mb-0 text-white text-opacity-70 text-md-end">
              © Decor's Digital copyright 2025
            </p>
          </div>
        </div>
      </div>
      <p className="mb-0 text-white text-opacity-70 text-md-center mt-10">
        Developed by Decor's Digital
      </p>
    </footer>
  );
}
