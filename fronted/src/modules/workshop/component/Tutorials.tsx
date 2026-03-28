// import { Button } from "@/components/ui/button";
// import { getTutorials } from "@/trpc/type";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React from "react";

// function Tutorials({ tutorials }: { tutorials: getTutorials }) {
//   const router=useRouter()
//   const handleClick=(id:string)=>{
//     router.push(`/online-tutorials/${id}`)
//   }
//   return (
//     <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {/* card */}

//       {tutorials.tutorials.map((e) => (
//         <div key={e.id} className="bg-white rounded-[30px] px-4 py-4 md:px-6 overflow-hidden">
//           <div className="flex flex-col gap-3">
//             {/* <div className="w-full"> */}
//             <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-[30px] overflow-hidden lg:h-96">
//               <div className=" absolute z-50 w-full h-full bg-black/5 flex items-center justify-center">
//                 <div role="button" onClick={()=>handleClick(e.id)} className=" bg-black/60 hover:bg-white/60 group transition-all duration-500 cursor-pointer rounded-full size-18 flex items-center justify-center">
//                   <svg
//                     width="30"
//                     height="30"
//                     viewBox="0 0 49 60"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M45.9637 25.4161C49.0235 27.3845 49.0235 31.8577 45.9638 33.8261L7.7052 58.4391C4.37773 60.5797 -2.95356e-06 58.1907 -2.78061e-06 54.2341L-6.28876e-07 5.0081C-4.55928e-07 1.05151 4.37773 -1.33756 7.7052 0.803115L45.9637 25.4161Z"
//                       className="fill-[#F2E9F9] group-hover:fill-black/90 transition-all duration-500"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <Image
//                 src={e.thumbnail}
//                 alt={e.title}
//                 fill
//                 className="object-cover object-center"
//                 quality={70}
//                 sizes="(max-width: 640px) 100vw,
//                                         (max-width: 1024px) 100vw,
//                                         100vw"
//               />
//             </div>
//             <div className="w-full">
//               <h2 className="text-[#4B4740] uppercase text-center text-xl font-passion-one md:text-3xl">
//                 {e.title}
//               </h2>
//               <div className="w-full flex flex-col md:flex-row items-center px-6 md:px-0 justify-center gap-3 mt-2">
//                 <div className="bg-[#F2E9F9] w-full py-2 rounded-full px-6">
//                   <p className="text-[#6B6B6B] text-normal text-center">
//                     Fees-<strong>INR {Math.floor(e.price * 1.2)}</strong>
//                     <strong> INR {e.price}/-</strong>
//                   </p>
//                 </div>
//                 <Button onClick={()=>handleClick(e.id)} className="rounded-full py-1 w-full md:w-fit cursor-pointer">
//                   Buy Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Tutorials;


"use client";

import { Button } from "@/components/ui/button";
import { getTutorials } from "@/trpc/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

function Tutorials({ tutorials }: { tutorials: getTutorials }) {
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/online-tutorials/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tutorials.tutorials.map((e, index) => (
        <TutorialCard
          key={e.id}
          tutorial={e}
          index={index}
          onClick={() => handleClick(e.id)}
        />
      ))}
    </div>
  );
}

function TutorialCard({
  tutorial: e,
  index,
  onClick,
}: {
  tutorial: getTutorials["tutorials"][number];
  index: number;
  onClick: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.96, filter: "blur(6px)" }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : {}
      }
      transition={{
        duration: 0.75,
        delay: (index % 3) * 0.12, // stagger per column
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      className="bg-white rounded-[30px] px-4 py-4 md:px-6 overflow-hidden"
    >
      <div className="flex flex-col gap-3">

        {/* Thumbnail */}
        <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-[30px] overflow-hidden lg:h-96">

          {/* Play button overlay */}
          <div className="absolute z-50 w-full h-full bg-black/5 flex items-center justify-center">
            <motion.div
              role="button"
              onClick={onClick}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/60 hover:bg-white/60 group transition-all duration-500 cursor-pointer rounded-full size-18 flex items-center justify-center"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 49 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M45.9637 25.4161C49.0235 27.3845 49.0235 31.8577 45.9638 33.8261L7.7052 58.4391C4.37773 60.5797 -2.95356e-06 58.1907 -2.78061e-06 54.2341L-6.28876e-07 5.0081C-4.55928e-07 1.05151 4.37773 -1.33756 7.7052 0.803115L45.9637 25.4161Z"
                  className="fill-[#F2E9F9] group-hover:fill-black/90 transition-all duration-500"
                />
              </svg>
            </motion.div>
          </div>

          {/* Image with subtle zoom on card hover */}
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={e.thumbnail}
              alt={e.title}
              fill
              className="object-cover object-center"
              quality={70}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
          </motion.div>
        </div>

        {/* Card footer */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: (index % 3) * 0.12 + 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h2 className="text-[#4B4740] uppercase text-center text-xl font-passion-one md:text-3xl">
            {e.title}
          </h2>
          <div className="w-full flex flex-col md:flex-row items-center px-6 md:px-0 justify-center gap-3 mt-2">
            <div className="bg-[#F2E9F9] w-full py-2 rounded-full px-6">
              <p className="text-[#6B6B6B] text-normal text-center">
                Fees-<strong>INR {Math.floor(e.price * 1.2)}</strong>
                <strong> INR {e.price}/-</strong>
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-fit"
            >
              <Button
                onClick={onClick}
                className="rounded-full py-1 w-full cursor-pointer"
              >
                Buy Now
              </Button>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Tutorials;