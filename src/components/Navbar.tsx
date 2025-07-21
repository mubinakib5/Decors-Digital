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

  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-full md:max-w-[60vw] px-2 sm:px-4 md:px-6 backdrop-blur-xl bg-white/30 border-b border-white/20 shadow-lg rounded-full flex justify-center items-center overflow-x-visible" style={{ marginTop: 40 }}>
      <div className="flex items-center justify-between w-full px-2 md:px-4 py-2">
        <button onClick={() => handleNavClick('hero')} className="flex items-center gap-2">
          <Image src="/DECOR'S DIGITAL.svg" alt="Decor's Digital Logo" width={48} height={48} className="w-12 h-12" />
        </button>
        <div className="hidden md:flex gap-6 items-center mx-auto">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`nav-link${activeSection === id ? ' text-red-600 font-bold' : ''}`}
            >
              {label}
            </button>
          ))}
          <button onClick={() => handleNavClick('footer')} className="ml-4 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">Book a Call</button>
        </div>
        <button className="md:hidden flex flex-col gap-1 mr-5" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? (
            <span className="w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </span>
          ) : (
            <>
              <span className="w-7 h-1 bg-black rounded-full" />
              <span className="w-7 h-1 bg-black rounded-full" />
              <span className="w-7 h-1 bg-black rounded-full" />
            </>
          )}
        </button>
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