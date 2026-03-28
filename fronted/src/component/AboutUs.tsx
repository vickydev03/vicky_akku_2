// import React from "react";
// import Navbar from "./Navbar";
// import TheStory from "./TheStory";
// import Teaching from "./Teaching";
// import Experience from "./Experience";
// import Wrapper from "./Wrapper";
// import ExperienceSection from "./Experience";

// function AboutUs() {
//   return (
//     <div className="w-full h-full ">
//       <Wrapper classname="w-[85%] flex items-center flex-col mx-auto">

//       <TheStory />
//       <Teaching />
//       </Wrapper>
//       <ExperienceSection/>
//     </div>
//   );
// }

// export default AboutUs;

// AboutUs.tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "./Navbar";
import TheStory from "./TheStory";
import Teaching from "./Teaching";
import Wrapper from "./Wrapper";
import ExperienceSection from "./Experience";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 50, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
});

function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AboutUs() {
  return (
    <div className="w-full h-full overflow-hidden relative">

      {/* Subtle drifting background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #D4E5FF 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #FFD4D4 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 3 }}
        />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <Wrapper classname="w-[85%] flex items-center flex-col mx-auto">
          <ScrollReveal delay={0}>
            <TheStory />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Teaching />
          </ScrollReveal>
        </Wrapper>

        <ScrollReveal delay={0.05}>
          <ExperienceSection />
        </ScrollReveal>
      </div>

    </div>
  );
}

export default AboutUs;