"use client";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <main className="max-w-6xl mx-auto py-20 px-4">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-20 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-white mb-6">
          Our Services
        </h1>
        <p className="text-lg md:text-2xl text-brand-silver max-w-2xl mx-auto">
          We offer a full suite of creative, digital, and branding solutions to help your business grow and stand out.
        </p>
      </motion.section>

      {/* Services Cards */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Digital Marketing",
              desc: "Innovative campaigns and strategies to grow your business online.",
              icon: "💡",
            },
            {
              title: "Branding",
              desc: "Building memorable brands with creative identity and storytelling.",
              icon: "🎨",
            },
            {
              title: "Web Design",
              desc: "Pixel-perfect, responsive websites with modern aesthetics and UX.",
              icon: "🌐",
            },
            {
              title: "Creative Strategy",
              desc: "Strategic thinking and creative direction for impactful results.",
              icon: "🚀",
            },
          ].map((service) => (
            <motion.div
              key={service.title}
              whileHover={{ scale: 1.05 }}
              className="bg-brand-charcoal/80 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl border border-brand-charcoal group cursor-pointer hover:border-brand-redAccent transition-colors"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
              <div className="text-xl font-semibold text-brand-white mb-2">{service.title}</div>
              <div className="text-brand-silver">{service.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Process/Approach Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-8 text-center">
          Our Approach
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {[
            {
              step: "Discover",
              desc: "We start by understanding your goals, audience, and challenges.",
              icon: "🔍",
            },
            {
              step: "Design",
              desc: "We craft creative solutions and visual concepts tailored to your brand.",
              icon: "✏️",
            },
            {
              step: "Develop",
              desc: "We build, test, and refine digital experiences for performance and impact.",
              icon: "🛠️",
            },
            {
              step: "Deliver",
              desc: "We launch, support, and help you grow with ongoing partnership.",
              icon: "🚚",
            },
          ].map((p) => (
            <motion.div
              key={p.step}
              whileHover={{ scale: 1.05 }}
              className="bg-brand-black/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg border border-brand-charcoal group min-w-[180px]"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.icon}</div>
              <div className="text-lg font-semibold text-brand-white mb-1">{p.step}</div>
              <div className="text-brand-silver text-sm">{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
} 