"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Home() {
  const secondSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToSecond = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen w-screen min-w-0 overflow-hidden bg-[#e8dede] bg-[url('/DD_Hero.png')] bg-cover bg-center bg-no-repeat">
        {/* Hero Content - Centered Logo with Swing Animation */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-center"
          >
            <Image
              src="/DD_Hero_Logo@3x.png"
              alt="Decor's Digital Logo"
              width={400}
              height={400}
              className="w-auto h-auto max-w-md md:max-w-lg lg:max-w-xl hero-logo-responsive"
              priority
            />
          </motion.div>
          {/* Down Arrow Button */}
          <button
            onClick={handleScrollToSecond}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg transition-colors z-20"
            aria-label="Scroll to next section"
          >
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Second Section with DD_MV@3x.png as background */}
      <section id="about"
        ref={secondSectionRef}
        className="relative min-h-screen w-screen min-w-0 flex items-center justify-center bg-[#e8dede] bg-[url('/DD_MV@3x.png')] bg-cover bg-center bg-no-repeat"
      >
        {/* Flex container for perfect centering */}
        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
          {/* Left pop-up image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: "spring",
              stiffness: 120,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="lg:absolute lg:left-0 lg:top-1/8 lg:-translate-y-1/2 lg:ml-2 lg:ml-8 z-20 flex items-center order-1 lg:order-none"
          >
            <Image
              src="/DD_MV_Left@3x.png"
              alt="Decor's Digital Left Accent"
              width={440}
              height={800}
              className="w-auto h-auto max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[380px] 2xl:max-w-[440px]"
              priority={false}
            />
          </motion.div>
          {/* Centre Swinging Image */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="text-center order-2 lg:order-none"
          >
            <Image
              src="/DD_MV_Centre@3x.png"
              alt="Decor's Digital Centre Accent"
              width={800}
              height={800}
              className="w-auto h-auto max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[800px]"
              priority={false}
            />
          </motion.div>
          {/* Right pop-up image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              type: "spring",
              stiffness: 120,
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="lg:absolute lg:right-0 lg:top-1/8 lg:-translate-y-1/2 lg:mr-2 lg:mr-8 z-20 flex items-center order-3 lg:order-none"
          >
            <Image
              src="/DD_MV_Right@3x.png"
              alt="Decor's Digital Right Accent"
              width={440}
              height={800}
              className="w-auto h-auto max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[380px] 2xl:max-w-[440px]"
              priority={false}
            />
          </motion.div>
        </div>
        {/* Bottom Centered Fade-in Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 2 }}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 z-20 pointer-events-none"
        >
          <Image
            src="/DD_MV_Bottom@3x.png"
            alt="Decor's Digital Bottom Accent"
            width={600}
            height={200}
            className="w-full max-w-xl h-auto"
            priority={false}
          />
        </motion.div>
      </section>

      {/* Third Section with DD_History_Section@3x.png as background */}
      <section id="history" className="relative min-h-screen w-screen min-w-0 bg-[#e8dede] bg-[url('/DD_History_Section@3x.png')] bg-cover bg-center bg-no-repeat">
        <div className="relative z-10 w-full flex flex-col items-start justify-start px-4 pt-0 mt-0">
          {/* Top Fade-in Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 2 }}
            className="w-full flex justify-center mt-[100px]"
          >
            <Image
              src="/DD_History_1@3x.png"
              alt="Decor's Digital History Top"
              width={600}
              height={200}
              className="w-auto h-auto max-w-[160px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px] xl:max-w-[500px] 2xl:max-w-[600px]"
              priority={false}
            />
          </motion.div>
          {/* History Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center w-full max-w-6xl mx-auto mt-0 pt-0 relative z-30"
          >
            <p className="text-black text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed font-normal mt-0 pt-0">
              Decor&apos;s Digital is a marketing agency born from its parent company, The Decor, established in 2018. In March 2023, Decor&apos;s Digital was launched as a sister concern to bring fresh, innovative solutions to the table. Starting with a focus on social media marketing, the agency quickly evolved into a full-service marketing partner by early 2024, ready to play every move with purpose.
            </p>
          </motion.div>
          {/* Swinging Image Below Text */}
          <motion.div
            initial={{ rotate: -8, scale: 0.9, opacity: 0 }}
            whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              rotate: { duration: 1.2, ease: "easeOut" },
              scale: { duration: 0.8 },
              opacity: { duration: 0.8 }
            }}
            className="w-full flex justify-center mt-2"
          >
            <Image
              src="/DD_History_2@3x.png"
              alt="Decor's Digital History Swing"
              width={300}
              height={100}
              className="w-auto h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px]"
              priority={false}
            />
          </motion.div>
          {/* Alternating Fade-in Images */}
          <div className="w-full flex flex-col items-center gap-4 mt-4">
            {/* 3: from left */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_3@3x.png"
                alt="Decor's Digital History 3"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] history-image-responsive"
                priority={false}
              />
            </motion.div>
            {/* 4: from right */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_4@3x.png"
                alt="Decor's Digital History 4"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] history-image-responsive"
                priority={false}
              />
            </motion.div>
            {/* 5: from left */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_5@3x.png"
                alt="Decor's Digital History 5"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] history-image-responsive"
                priority={false}
              />
            </motion.div>
            {/* 6: from right */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_6@3x.png"
                alt="Decor's Digital History 6"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] history-image-responsive"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fourth Section with DD_Statement.png as background */}
      <section className="relative min-h-screen w-screen min-w-0 flex items-center justify-center bg-[#e8dede] bg-[url('/DD_Statement.png')] bg-cover bg-center bg-no-repeat">
        {/* Statement Image with Fade-in Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 2 }}
          className="z-10 text-center"
        >
          <Image
            src="/DD_Statement_Image.png"
            alt="Decor's Digital Statement"
            width={1200}
            height={800}
            className="w-auto h-auto max-w-[600px] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1200px] 2xl:max-w-[1400px] statement-image-responsive"
            priority={false}
          />
        </motion.div>
      </section>

      {/* Fifth Section with DD_Services.png as background */}
      <section id="services" className="relative min-h-screen w-screen min-w-0 bg-[#e8dede] bg-[url('/DD_Services.png')] bg-cover bg-center bg-no-repeat">
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Services Images with Fade-in Animation */}
          <div className="w-full flex flex-col items-center justify-center gap-0 min-h-screen">
            {/* DD_Services_2.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_2.png"
                alt="Decor's Digital Services 2"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] services-image-responsive"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_3.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_3.png"
                alt="Decor's Digital Services 3"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] services-image-responsive"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_4.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_4.png"
                alt="Decor's Digital Services 4"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] services-image-responsive"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_5.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_5.png"
                alt="Decor's Digital Services 5"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] services-image-responsive"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects"
        className="relative min-h-screen w-screen min-w-0 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[#e8dede] bg-[url('/DD_Projects@3x.png')]"
      >
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-16">
          {/* Add your projects content here */}
          {/* Fade-in animated project image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="w-full flex justify-center"
          >
            <Image
              src="/DD_Projects_1@3x.png"
              alt="Decor's Digital Project Showcase"
              width={900}
              height={600}
              className="w-auto h-auto max-w-[320px] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px]"
              priority={false}
            />
          </motion.div>
          {/* Placeholder for future project cards or gallery */}
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />
      </section>

      {/* Clients Section */}
      <section id="clients"
        className="relative min-h-screen w-screen min-w-0 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[#e8dede] bg-[url('/DD_Clients.png')]"
      >
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-16">

          {/* Fade-in animated client images */}
          <div className="w-full flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center"
            >
              <Image
                src="/DD_Clients_1.png"
                alt="Decor's Digital Client 1"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
                priority={false}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <Image
                src="/DD_Clients_2.png"
                alt="Decor's Digital Client 2"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />
      </section>

      {/* Milestones Section */}
      <section id="milestones"
        className="relative min-h-screen w-screen min-w-0 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[#e8dede] bg-[url('/DD_Milestones.png')]"
      >
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center py-16">
          {/* Fade-in animated milestone images */}
          <div className="w-full flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center"
            >
              <Image
                src="/DD_Milestones_1.png"
                alt="Decor's Digital Milestone 1"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
                priority={false}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <Image
                src="/DD_Milestones_2.png"
                alt="Decor's Digital Milestone 2"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />
      </section>

      {/* Team Section */}
      <section id="team"
        className="relative min-h-screen w-screen min-w-0 flex items-center justify-start bg-cover bg-center bg-no-repeat bg-[#e8dede] bg-[url('/DD_Team.png')]"
      >
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 2.5 }}
            className="w-full flex justify-center mt-0 pt-0"
          >
            <Image
              src="/DD_Team_1.png"
              alt="Decor's Digital Team"
              width={900}
              height={600}
              className="w-auto h-auto max-w-[320px] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px]"
              priority={false}
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-black/30 z-0" />
      </section>

      {/* Footer Section */}
      <footer id="footer"
        className="relative min-h-[220px] w-screen min-w-0 flex items-end justify-end bg-cover bg-center bg-no-repeat bg-[#e8dede] bg-[url('/DD_Footer.png')]"
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 w-full flex flex-row justify-end items-center px-4 md:px-12 py-8">
          <div className="flex flex-col items-end text-right gap-4 max-w-lg">
            <div className="text-white text-base md:text-lg font-medium">
              +880 1958-029671 <br />
              info@thedecorbd.com<br />
              www.thedecorbd.com/decorsdigital<br />
              Southland Center (4th floor), Agrabad, Chattogram - 4100
            </div>
            <div className="flex flex-row gap-4 mt-2">
              <a href="https://www.instagram.com/decorsdigital/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-400 text-2xl"><FaInstagram /></a>
              <a href="https://www.facebook.com/decorsdigital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 text-2xl"><FaFacebookF /></a>
              <a href="https://www.linkedin.com/company/decorsdigital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 text-2xl"><FaLinkedinIn /></a>
              <a href="https://www.youtube.com/@DecorsDigital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 text-2xl"><FaYoutube /></a>
              <a href="https://www.tiktok.com/@decorsdigital" target="_blank" rel="noopener noreferrer" className="text-white hover:text-black text-2xl"><FaTiktok /></a>
            </div>
          </div>
        </div>
      </footer>
    </main >
  );
}