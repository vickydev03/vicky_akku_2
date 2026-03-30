// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import React from "react";


// function ClassDetails({className="w-full mt-48 mx-auto hidden md:block"}:{className?:string}) {
//   return (
//     <div className={className}>
//       <div className="w-[90%] bg-[#F4F1ED] rounded-2xl mx-auto">
//         <div className="grid grid-cols-15">
//           <div className=" relative col-span-7  p-6 flex items-center justify-center  w-fulal">
//             <Image
//               className="w-full rounded-3xl h-84  object-bottom object-cover"
//               src={"/image/contect_details.jpg"}
//               alt="details"
//               quality={75}
//               sizes="100vw"
//               height={100}
//               width={100}
//             />
//           </div>
//           <div className="col-span-8 p-6 flex items-center gap-4 pla-4">
//             <h3 className="font-passion-one max-w-64 text-primary md:4xl lg:text-6xl uppercase">
//               Regular Dance classes
//             </h3>
//             <div className="max-w-84 flex flex-col gap-4">
//               <p className="text-md text-regular leading-6">
//                 From beginners to experienced dancers, our regular batches focus
//                 on technique, expression, and confidence. Learn in a space
//                 that’s warm, welcoming, and full of energy.
//               </p>
//               <Button className="bg-primary w-fit uppercase px-4 py-2 cursor-pointer rounded-full">

//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ClassDetails;

"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
function ClassDetails({
  className = "w-full mt-48 mx-auto hidden md:block",
}: {
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="w-[90%] bg-[#F4F1ED] rounded-2xl mx-auto overflow-hidden">
        <div className="grid grid-cols-15">

          {/* IMAGE */}
          <motion.div
            className="relative col-span-7 p-6 flex items-center justify-center"
            initial={{ opacity: 0, x: -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              className="w-full rounded-3xl h-84 object-bottom object-cover transition-transform duration-700 hover:scale-[1.03]"
              src={"/image/contect_details.jpg"}
              alt="details"
              quality={75}
              sizes="100vw"
              height={100}
              width={100}
            />
          </motion.div>

          {/* TEXT SIDE */}
          <motion.div
            className="col-span-8 p-6 flex items-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {/* TITLE */}
            <motion.h3
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="font-passion-one max-w-64 text-primary md:text-4xl lg:text-6xl uppercase"
            >
              Regular Dance classes
            </motion.h3>

            {/* CONTENT */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="max-w-84 flex flex-col gap-4"
            >
              <p className="text-md text-regular leading-6">
                From beginners to experienced dancers, our regular batches focus
                on technique, expression, and confidence. Learn in a space
                that’s warm, welcoming, and full of energy.
              </p>

              <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }}>
                <Button className="bg-primary w-fit uppercase px-4 py-2 cursor-pointer rounded-full">
                  <Link href={"/regular-classes"}>             view details </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default ClassDetails;