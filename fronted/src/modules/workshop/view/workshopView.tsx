// "use client";
// import Navbar from "@/component/Navbar";
// import ContainerBox from "@/modules/signin/component/ContainerBox";
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { data } from "motion/react-client";
// import React from "react";
// import WorkshopDetails from "../component/workshopDetails";

// function WorkshopView({ id }: { id: string }) {
//   const trpc = useTRPC();
//   const { data: workshop } = useSuspenseQuery(
//     trpc.workshop.getWorkshop.queryOptions({ id }),
//   );
  
//   console.log(data, 55);
//   return (
//     <div className="h-full min-h-screen bg-hero reative">
//       <div className=" absolute  z-53 w-full top-5">
//         <Navbar />
//       </div>
      
//       <div className="h-full  py-24">
//         <div className="w-[85%] flex items-center flex-col mx-auto">
//           <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
//             {workshop.title}
//           </h1>
//           <div className="w-full h-full">
//             <ContainerBox
//               image={`${workshop.thumbnail}`}
//               children={<WorkshopDetails workshop={workshop} />}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WorkshopView;


"use client";

import Navbar from "@/component/Navbar";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import WorkshopDetails from "../component/workshopDetails";
import { motion } from "framer-motion";

function WorkshopView({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data: workshop } = useSuspenseQuery(
    trpc.workshop.getWorkshop.queryOptions({ id })
  );

  return (
    <div className="h-full min-h-screen bg-hero relative">

      {/* NAVBAR */}
      <motion.div
        className="absolute z-50 w-full top-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
      </motion.div>

      <div className="h-full py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto gap-10">

          {/* TITLE */}
          <motion.h1
            className="font-passion-one font-bold text-center text-[#C77F90] text-4xl lg:text-8xl uppercase"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {workshop.title}
          </motion.h1>

          {/* DETAILS CONTAINER */}
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContainerBox
              image={workshop.thumbnail}
            >
              <WorkshopDetails workshop={workshop} />
            </ContainerBox>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default WorkshopView;