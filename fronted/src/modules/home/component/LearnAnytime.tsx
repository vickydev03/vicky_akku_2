// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React from "react";
// import Link from "next/link";

// function LearnAnytime() {
//   return (
//     <div className="mt-136 md:mt-10 w-full h-106 ">
//       <div className="w-[90%] bg-[#EDE7EF] mx-auto  rounded-2xl">
//         <div className="grid grid-cols-1 md:grid-cols-2 ">
//           <div className="w-full p-10  order-2 md:order-1 items-center md:items-start justifya-center flex flex-col gap-4 md:gap-8">
//             <div className="flex flex-col">
//               <h2 className="text-4xl md:text-6xl text-[#535353] text-center md:text-start font-passion-one uppercase max-w-md ">
//                 Learn anytime anywhere
//               </h2>
//               <p className="text-[#464646] capitalize text-md md:text-2xl font-semibold text-center md:text-start">
//                 Explore online tutorials
//               </p>
//             </div>
//             <div className="max-w-xs flex flex-col gap-4 ">
//               <p className="font-opensauce-one text-regular text-xs md:text-md leading-5 text-center md:text-start mx-auto">
//                 Can’t attend in person? Our online tutorials bring the
//                 Vicky–Akku experience to you step-by-step, expressive, and easy
//                 to follow.
//               </p>
//               <div className="flex items-center justify-center md:justify-start ">
//                 <Button className="bg-primary uppercase w-fit cursor-pointer  rounded-full px-4">
//               <Link href={"/online-tutorials"}>
//                   Subscribe
// </Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="order-1 md:order-2">
//             <div className=" relative   p-6 flex items-center justify-center  w-fulal">
//               <Image
//                 className="w-full rounded-3xl h-56 md:h-84 lg:h-106  object-top object-cover"
//                 src={"/image/learn.jpg"}
//                 alt="details"
//                 quality={75}
//                 sizes="100vw"
//                 height={100}
//                 width={100}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LearnAnytime;


"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

function LearnAnytime() {
  return (
    <motion.div
      className="mt-136 md:mt-10 w-full h-106"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="w-[90%] bg-[#EDE7EF] mx-auto rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* TEXT SECTION */}
          <motion.div
            className="w-full p-10 order-2 md:order-1 items-center md:items-start flex flex-col gap-4 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            <div className="flex flex-col">

              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl text-[#535353] text-center md:text-start font-passion-one uppercase max-w-md"
              >
                Learn anytime anywhere
              </motion.h2>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5 }}
                className="text-[#464646] capitalize text-md md:text-2xl font-semibold text-center md:text-start"
              >
                Explore online tutorials
              </motion.p>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
              className="max-w-xs flex flex-col gap-4"
            >
              <p className="font-opensauce-one text-regular text-xs md:text-md leading-5 text-center md:text-start mx-auto">
                Can’t attend in person? Our online tutorials bring the
                Vicky–Akku experience to you step-by-step, expressive, and easy
                to follow.
              </p>

              <div className="flex items-center justify-center md:justify-start">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
                  <Button className="bg-primary uppercase w-fit cursor-pointer rounded-full px-4">
                    <Link href={"/online-tutorials"}>Subscribe</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* IMAGE SECTION */}
          <motion.div
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="relative p-6 flex items-center justify-center">
              <Image
                className="w-full rounded-3xl h-56 md:h-84 lg:h-106 object-top object-cover transition-transform duration-700 hover:scale-[1.04]"
                src={"/image/learn.jpg"}
                alt="details"
                quality={75}
                sizes="100vw"
                height={100}
                width={100}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default LearnAnytime;