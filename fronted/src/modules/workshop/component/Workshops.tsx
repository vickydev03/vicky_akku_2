// import React from "react";
// import WorkshopCard from "./WorkshopCard";
// import { getWorkshopType } from "@/trpc/type";

// export type Workshop = {
//   id: string;
//   thumbnail: string;
//   title: string;
//   place: string;
//   description: string;
//   date: string;
//   price: number;
// };

// function Workshops({ data }: { data: getWorkshopType }) {
  
//   return (
//     <div className="w-full h-full ">
//       <div className="grid  gap-6  grid-cols-1 md:grid-cols-3">
//         {data.map((e, i) => (
//           <WorkshopCard key={i} workshop={e} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Workshops;

"use client";

import React from "react";
import WorkshopCard from "./WorkshopCard";
import { getWorkshopType } from "@/trpc/type";
import { motion } from "framer-motion";

export type Workshop = {
  id: string;
  thumbnail: string;
  title: string;
  place: string;
  description: string;
  date: string;
  price: number;
};

function Workshops({ data }: { data: getWorkshopType }) {
  return (
    <motion.div
      className="w-full h-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {data.map((e, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <WorkshopCard workshop={e} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Workshops;