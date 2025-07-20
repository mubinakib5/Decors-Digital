"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

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
      <section className="relative min-h-screen overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/DD_Hero.png"
            alt="Decor's Digital Hero"
            fill
            className="object-cover"
            priority
          />
        </div>

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
              className="w-auto h-auto max-w-md md:max-w-lg lg:max-w-xl"
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
      <section
        ref={secondSectionRef}
        className="relative w-full min-h-screen flex items-center justify-center"
      >
        <Image
          src="/DD_MV@3x.png"
          alt="Mission & Vision Background"
          fill
          className="object-cover object-center z-0"
          priority={false}
        />
        {/* Flex container for perfect centering */}
        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0">
          {/* Left pop-up image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.3 }}
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
          viewport={{ once: true, amount: 0.3 }}
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
      <section className="relative w-full min-h-screen">
        <Image
          src="/DD_History_Section@3x.png"
          alt="History Section Background"
          fill
          className="object-cover object-center z-0"
          priority={false}
        />
        <div className="relative z-10 w-full flex flex-col items-start justify-start px-4 pt-0 mt-0">
          {/* Top Fade-in Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.3 }}
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
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_3@3x.png"
                alt="Decor's Digital History 3"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>
            {/* 4: from right */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_4@3x.png"
                alt="Decor's Digital History 4"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>
            {/* 5: from left */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_5@3x.png"
                alt="Decor's Digital History 5"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>
            {/* 6: from right */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1 }}
              className="w-full flex justify-center"
            >
              <Image
                src="/DD_History_6@3x.png"
                alt="Decor's Digital History 6"
                width={300}
                height={100}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fourth Section with DD_Statement.png as background */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <Image
          src="/DD_Statement.png"
          alt="Statement Section Background"
          fill
          className="object-cover object-center z-0"
          priority={false}
        />
        {/* Statement Image with Fade-in Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 2 }}
          className="z-10 text-center"
        >
          <Image
            src="/DD_Statement_Image.png"
            alt="Decor's Digital Statement"
            width={1200}
            height={800}
            className="w-auto h-auto max-w-[600px] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1200px] 2xl:max-w-[1400px]"
            priority={false}
          />
        </motion.div>
      </section>

      {/* Fifth Section with DD_Services.png as background */}
      <section className="relative w-full min-h-screen">
        <Image
          src="/DD_Services.png"
          alt="Services Section Background"
          fill
          className="object-cover object-center z-0"
          priority={false}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Services Images with Fade-in Animation */}
          <div className="w-full flex flex-col items-center justify-center gap-0 min-h-screen">
            {/* DD_Services_2.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_2.png"
                alt="Decor's Digital Services 2"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_3.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_3.png"
                alt="Decor's Digital Services 3"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_4.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_4.png"
                alt="Decor's Digital Services 4"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>

            {/* DD_Services_5.png */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-center"
            >
              <Image
                src="/DD_Services_5.png"
                alt="Decor's Digital Services 5"
                width={600}
                height={200}
                className="w-auto h-auto max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px]"
                priority={false}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main >
  );
}