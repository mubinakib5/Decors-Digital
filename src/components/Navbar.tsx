"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const sections = [
    { id: "about", label: "About us" },
    { id: "history", label: "History" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "clients", label: "Clients" },
    { id: "milestones", label: "Milestones" },
    { id: "team", label: "Team" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top) };
      });
      const visible = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(visible.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onBookCallClick = () => {
    handleNavClick('footer');
  };

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-full md:max-w-[60vw] px-2 sm:px-4 md:px-6 backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg rounded-full flex items-center overflow-x-visible" style={{ marginTop: 40 }}>
      <div className="flex items-center justify-between w-full px-2 md:px-4 py-2">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <button onClick={() => handleNavClick('hero')} className="flex items-center gap-2">
            <Image src="/DECOR'S DIGITAL.svg" alt="Decor's Digital Logo" width={48} height={48} className="w-12 h-12" />
          </button>
        </div>
        {/* Center: Menu */}
        <div className="flex-1 flex justify-center items-center gap-6">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-base font-medium transition-colors duration-200 px-2 md:px-3 lg:px-4 ${activeSection === item.id ? 'text-red-600 font-bold' : 'text-black hover:text-red-500'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* Right: CTA */}
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={onBookCallClick}
            className="ml-2 md:ml-4 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold shadow-md hover:from-red-500 hover:to-pink-500 transition-colors duration-200"
          >
            Book a Call
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 w-full bg-white/80 backdrop-blur-xl shadow-lg flex flex-col items-start px-4 py-4 gap-4 z-50 animate-fade-in">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`nav-link w-full text-left${activeSection === id ? ' text-red-600 font-bold' : ''}`}
            >
              {label}
            </button>
          ))}
          <button onClick={() => handleNavClick('footer')} className="w-4/5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow-lg mt-2 text-base mx-auto block">Book a Call</button>
        </div>
      )}
      <style jsx>{`
        .nav-link {
          @apply px-3 py-2 rounded-lg text-black font-medium hover:bg-white/60 hover:backdrop-blur-md transition;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
}

export default Navbar; 