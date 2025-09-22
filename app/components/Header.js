"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CALENDLY_URL } from "../constants";
import { contactData, navigationData } from "../data";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Bootstrap dropdowns
    if (typeof window !== "undefined" && window.bootstrap) {
      const dropdownElementList = document.querySelectorAll(
        '[data-bs-toggle="dropdown"]'
      );
      const dropdownList = [...dropdownElementList].map(
        (dropdownToggleEl) => new window.bootstrap.Dropdown(dropdownToggleEl)
      );
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBookCall = () => {
    // Open Calendly in a new window/tab
    window.open(CALENDLY_URL, "_blank");
  };

  return (
    <header
      className="header border-top border-primary position-fixed start-0 top-0 w-100"
      role="banner"
    >
      <div className="container">
        <div className="header-wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link
              href="/"
              className="logo-white"
              aria-label="Decor's Digital - Home"
            >
              <Image
                src="/assets/images/logos/logo-white.png"
                alt="Decor's Digital Logo"
                width={60}
                height={20}
                className="img-fluid"
              />
            </Link>
            <Link
              href="/"
              className="logo-dark"
              aria-label="Decor's Digital - Home"
            >
              <Image
                src="/assets/images/logos/logo-dark.png"
                alt="Decor's Digital Logo"
                width={60}
                height={20}
                className="img-fluid"
              />
            </Link>
          </div>
          <div className="d-flex align-items-center gap-4">
            <nav
              className="btn-group"
              role="navigation"
              aria-label="Main navigation"
            >
              <button
                className="btn btn-secondary toggle-menu round-45 p-2 d-flex align-items-center justify-content-center rounded-circle"
                type="button"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                aria-label="Toggle navigation menu"
                onClick={toggleDropdown}
                style={{
                  backgroundColor: '#FF6B6B',
                  border: 'none',
                  width: '45px',
                  height: '45px'
                }}
              >
                <iconify-icon
                  icon="solar:hamburger-menu-line-duotone"
                  className="menu-icon fs-8 text-white"
                  aria-hidden="true"
                ></iconify-icon>
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end p-4 ${
                  isDropdownOpen ? "show" : ""
                }`}
                role="menu"
                aria-labelledby="navigation-toggle"
                style={{
                  position: "absolute",
                  top: "100%",
                  right: "0",
                  maxHeight: "calc(100vh - 120px)",
                  overflowY: "auto",
                  width: "320px",
                  zIndex: 1050,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              >
                <div className="d-flex flex-column gap-6">
                  <div className="hstack justify-content-between border-bottom pb-6">
                    <p className="mb-0 fs-5 text-dark">Menu</p>
                    <button
                      type="button"
                      className="btn-close opacity-75"
                      aria-label="Close navigation menu"
                      onClick={() => setIsDropdownOpen(false)}
                    ></button>
                  </div>
                  <div className="d-flex flex-column gap-3">
                    <ul
                      className="header-menu list-unstyled mb-0 d-flex flex-column gap-2"
                      role="menubar"
                    >
                      {navigationData.mainMenu.map((item, index) => {
                        // Improved active state logic
                        const isActive = 
                          pathname === item.href || 
                          (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <li key={index} className="header-item" role="none">
                            <Link
                              href={item.href}
                              className={`header-link hstack gap-2 fs-7 fw-bold d-block px-3 py-2 rounded ${
                                isActive
                                  ? "bg-primary text-white"
                                  : "text-dark hover-bg-secondary hover-text-primary"
                              }`}
                              role="menuitem"
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="hstack gap-3">
                      <button
                        className="btn btn-primary fs-6 px-3 py-2 w-100 hstack justify-content-center"
                        aria-label="Book a consultation call"
                        onClick={() => {
                          handleBookCall();
                          setIsDropdownOpen(false);
                        }}
                      >
                        <iconify-icon
                          icon="lucide:calendar"
                          className="fs-6 me-2"
                          aria-hidden="true"
                        ></iconify-icon>
                        Book a Call
                      </button>
                    </div>
                  </div>
                  <div
                    className="d-flex flex-column gap-1"
                    role="group"
                    aria-label="Contact information"
                  >
                    <a
                      className="text-dark text-opacity-70"
                      href={`tel:${contactData.phone}`}
                      aria-label={`Call us at ${contactData.phone}`}
                    >
                      {contactData.phone}
                    </a>
                    <a
                      className="text-dark fw-bold"
                      href={`mailto:${contactData.email}`}
                      aria-label={`Email us at ${contactData.email}`}
                    >
                      {contactData.email}
                    </a>
                  </div>
                </div>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
