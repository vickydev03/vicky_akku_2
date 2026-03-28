// import { Button } from "@/components/ui/button";
// import Workshops from "@/modules/workshop/component/Workshops";
// import { getWorkshopType } from "@/trpc/type";
// import React from "react";

// function UpcomingWorkshop({workshops}:{workshops:getWorkshopType}) {
  
//   return (
//     <div className=" w-full ">
//       <div className="w-[90%] space-y-4 px-6 md:px-12 py-8 md:w-[90%] rounded-3xl bg-[#FFFBF4]  mx-auto">
//         <div className=" flex gap-4 flex-col md:flex-row justify-center items-center md:justify-between ">
//           <div className=" font-p flex md:block items-center gap-2 justify-center flex-col">
//             <h3 className=" uppercase text-center md:text-start  font-passion-one text-secondary-color text-4xl">
//               upcoming Workshops
//             </h3>
//             <p className=" max-w-42 md:max-w-full text-center md:text-start capitalize text-[#777873] font-semibold text-2xl  md:text-sm tracking-wide">
//               Workshop across city
//             </p>
//           </div>

//           <div>
//             <Button className=" border bg-transparent text-black  rounded-full  font-open-sauce border-[#736E4E]">
//               View more
//             </Button>
//           </div>
//         </div>
//         <section className="">
//           <Workshops data={workshops} />
//         </section>
//       </div>
//     </div>
//   );
// }

// export default UpcomingWorkshop;


"use client";

import { Button } from "@/components/ui/button";
import Workshops from "@/modules/workshop/component/Workshops";
import { getWorkshopType } from "@/trpc/type";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function UpcomingWorkshop({ workshops }: { workshops: getWorkshopType }) {
  const router=useRouter()
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="w-[90%] space-y-4 px-6 md:px-12 py-8 md:w-[90%] rounded-3xl bg-[#FFFBF4] mx-auto">
        
        <div className="flex gap-4 flex-col md:flex-row justify-center items-center md:justify-between">

          <motion.div
            className="font-p flex md:block items-center gap-2 justify-center flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="uppercase text-center md:text-start font-passion-one text-secondary-color text-4xl">
              upcoming Workshops
            </h3>

            <p className="max-w-42 md:max-w-full text-center md:text-start capitalize text-[#777873] font-semibold text-2xl md:text-sm tracking-wide">
              Workshop across city
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button onClick={()=>router.push("/workshop")} className="border bg-transparent text-black rounded-full font-open-sauce border-[#736E4E] hover:bg-[#736E4E] hover:text-white transition">
              View more
            </Button>
          </motion.div>

        </div>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Workshops data={workshops} />
          </motion.div>
        </motion.section>

      </div>
    </motion.div>
  );
}

export default UpcomingWorkshop;