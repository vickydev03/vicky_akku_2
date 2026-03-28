// import Image from "next/image";
// import React from "react";
// import { useWorkshopFilters } from "../useWorkshop";
// import { getTutorials } from "@/trpc/type";
// import Tutorials from "./Tutorials";

// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { useTutorialFilters } from "@/modules/tutorials/hook/useTutorials";
// import { Video } from "lucide-react";
// import { motion } from "motion/react";

// function TutorialsContainer({ data }: { data: getTutorials }) {
//   const [filters, setFilters] = useTutorialFilters();

//   const totalPages = data.pagination.totalPages;
//   const currentPages = data.pagination.currentPage;
//   console.log(filters.limit > data.pagination.totalCount, "ajaj");
//   return (
//     <div className="h-full  py-28 overflow-hiddena">
//       <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">
//         {/* <div className="space-y-4 md:space-y-6">
//           <h1 className="font-passion-one font-bold text-center  text-[#977DAE] text-4xl  lg:text-8xl uppercase">
//             vicky-akku online tutorials
//           </h1>
//           <p className="text-[#58555A] text-xs md:text-2xl text-center">
//             Your favourite choreographies, taught like you’re in the room with
//             us. 
//           </p>
//         </div> */}
//          <motion.div
//       className="space-y-4 md:space-y-6"
//       initial="hidden"
//       animate="visible"
//       variants={{
//         hidden: {},
//         visible: {
//           transition: {
//             staggerChildren: 0.15,
//           },
//         },
//       }}
//     >
//       <motion.h1
//         className="font-passion-one font-bold text-center text-[#977DAE] text-4xl lg:text-8xl uppercase"
//         variants={{
//           hidden: { opacity: 0, y: 40 },
//           visible: { opacity: 1, y: 0 },
//         }}
//         transition={{ duration: 0.7 }}
//       >
//         vicky-akku online tutorials
//       </motion.h1>

//       <motion.p
//         className="text-[#58555A] text-xs md:text-2xl text-center"
//         variants={{
//           hidden: { opacity: 0, y: 25 },
//           visible: { opacity: 1, y: 0 },
//         }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//       >
//         Your favourite choreographies, taught like you’re in the room with us.
//       </motion.p>
//     </motion.div>
//         {
//           data.pagination.totalCount==0 ? <div className="bg-[#FFFBF4] h-64 w-full rounded-[30px] flex flex-col items-center justify-center text-center gap-3">
      
//       <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
//         <Video className="w-6 h-6 text-gray-500" />
//       </div>

//       <div>
//         <p className="text-lg font-medium text-gray-800">
//           No Online Tutorials Yet
//         </p>
//         <p className="text-sm text-gray-500">
//           Online tutorials will appear here when available.
//         </p>
//       </div>

//     </div>: <div className="w-full h-full">
//           {/* <WorkshopcardWrapper workshops={workshops.workshops} /> */}
//           <Tutorials tutorials={data} />

//           {filters.limit < data.pagination.totalCount && (
//             <div className="w-full mt-10">
//               <Pagination>
//                 <PaginationContent>
//                   <PaginationItem>
//                     <PaginationPrevious href="#" />
//                   </PaginationItem>

//                   {Array.from({ length: totalPages }).map((_, i) => (
//                     <PaginationItem key={i} className="">
//                       <PaginationLink onClick={()=>setFilters({page:i+1})} className={`${filters.page ==i+1 && "bg-white/50"} cursor-pointer transition-all duration-300 ease-in-out`}>
//                         {i + 1}
//                       </PaginationLink>
//                     </PaginationItem>
//                   ))}
//                   <PaginationItem>
//                     <PaginationNext href="#" />
//                   </PaginationItem>
//                 </PaginationContent>
//               </Pagination>
//             </div>
//           )}
//         </div>
//         }
//       </div>
//     </div>
//   );
// }

// export default TutorialsContainer;


import Image from "next/image";
import React from "react";
import { getTutorials } from "@/trpc/type";
import Tutorials from "./Tutorials";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useTutorialFilters } from "@/modules/tutorials/hook/useTutorials";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

function TutorialsContainer({ data }: { data: getTutorials }) {
  const [filters, setFilters] = useTutorialFilters();

  const totalPages = data.pagination.totalPages;

  return (
    <div className="h-full py-28">
      <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">
        
        {/* Animated Title Section */}
        <motion.div
          className="space-y-4 md:space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h1
            className="font-passion-one font-bold text-center text-[#977DAE] text-4xl lg:text-8xl uppercase"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            vicky-akku online tutorials
          </motion.h1>

          <motion.p
            className="text-[#58555A] text-xs md:text-2xl text-center"
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            Your favourite choreographies, taught like you’re in the room with
            us.
          </motion.p>
        </motion.div>

        {data.pagination.totalCount === 0 ? (
          <div className="bg-[#FFFBF4] h-64 w-full rounded-[30px] flex flex-col items-center justify-center text-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
              <Video className="w-6 h-6 text-gray-500" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-800">
                No Online Tutorials Yet
              </p>
              <p className="text-sm text-gray-500">
                Online tutorials will appear here when available.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <Tutorials tutorials={data} />

            {filters.limit < data.pagination.totalCount && (
              <div className="w-full mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          onClick={() => setFilters({ page: i + 1 })}
                          className={`${
                            filters.page === i + 1 && "bg-white/50"
                          } cursor-pointer transition-all duration-300`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialsContainer;