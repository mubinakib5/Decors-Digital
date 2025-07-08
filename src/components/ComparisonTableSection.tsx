"use client";
import { FiBriefcase, FiCheck, FiPenTool, FiSmile, FiUser, FiUsers, FiX } from 'react-icons/fi';

const columns = ["Speed", "Flexibility", "Quality", "Scalability", "Affordability"];
const rows = [
  {
    name: "Decor's Digital",
    icon: <div className="bg-[#FF4B3E] p-3 rounded-xl"><FiSmile className="text-3xl text-white" /></div>,
    desc: "Expert-driven & committed to higher quality. Get effective results & full support without hiring in-house employees.",
    values: [true, true, true, true, true],
    highlight: true,
  },
  {
    name: "In House Team",
    icon: <div className="bg-[#1e293b] p-3 rounded-xl"><FiUsers className="text-3xl text-white" /></div>,
    desc: "A full-time designer may ensure brand consistency, but there&apos;s a risk of limited expertise even though you pay regularly.",
    values: [false, false, true, false, false],
    highlight: false,
  },
  {
    name: "Creative Agencies",
    icon: <div className="bg-[#1e293b] p-3 rounded-xl"><FiPenTool className="text-3xl text-white" /></div>,
    desc: "Agencies offer structured processes but mostly with high costs, long timelines, and less flexibility for your projects.",
    values: [false, false, true, true, false],
    highlight: false,
  },
  {
    name: "Freelancers",
    icon: <div className="bg-[#1e293b] p-3 rounded-xl"><FiUser className="text-3xl text-white" /></div>,
    desc: "Freelancers may provide affordable design services but they mostly lack consistency, reliability, and collaboration",
    values: [false, true, false, false, true],
    highlight: false,
  },
  {
    name: "Self-Service Tools",
    icon: <div className="bg-[#1e293b] p-3 rounded-xl"><FiBriefcase className="text-3xl text-white" /></div>,
    desc: "DIY tools like website builders are budget-friendly, but you can&apos;t expect strategic thinking & originality",
    values: [false, true, true, true, false],
    highlight: false,
  },
];

export default function ComparisonTableSection() {
  return (
    <section className="relative w-full py-24 bg-brand-black text-white flex flex-col items-center">
      <span className="inline-block px-5 py-1.5 rounded-full border border-[#FF4B3E] text-[#FF4B3E] font-medium text-sm mb-6 bg-transparent">Why Choose Us</span>
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
        {"Decor's Digital's Alternative?"}<br />
        <span className="italic font-serif">Think</span> One More Time!
      </h2>
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-6 gap-0 text-lg font-semibold mb-6 px-2">
          <div className="text-left">Platform</div>
          {columns.map(col => (
            <div key={col} className="text-center">{col}</div>
          ))}
        </div>
        <div className="space-y-8">
          {rows.map(row => (
            <div
              key={row.name}
              className={`grid grid-cols-6 items-center px-6 py-8 rounded-3xl ${row.highlight ? "bg-gradient-to-r from-[#FF4B3E]/90 to-[#FF4B3E]/60 border-2 border-[#FF4B3E] shadow-2xl" : "border-b border-white/10"}`}
              style={row.highlight ? { boxShadow: '0 4px 32px 0 #FF4B3E33, 0 1.5px 0 0 #FF4B3E' } : {}}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 w-full">
                <div className="mb-2 md:mb-0 flex-shrink-0 flex items-center justify-center">{row.icon}</div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="font-bold text-lg mb-1">{row.name}</div>
                  <div className="text-sm text-white/80 max-w-xs">{row.desc}</div>
                </div>
              </div>
              {row.values.map((v, j) => (
                <div key={j} className="flex justify-center">
                  {v ? <FiCheck className="text-2xl text-white" /> : <FiX className="text-2xl text-red-500" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 