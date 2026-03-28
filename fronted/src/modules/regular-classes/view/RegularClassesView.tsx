// "use client";
// import Navbar from "@/component/Navbar";
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import React from "react";
// import { useRegularClassesFilters } from "../hooks/hook/useRegularClasses";
// import ContainerBox from "@/modules/signin/component/ContainerBox";
// import RegularClassDetails from "../component/RegularClassDetails";
// import { GraduationCap } from "lucide-react";

// function RegularClassesView() {
//   const [filters, setFilters] = useRegularClassesFilters();

//   const trpc = useTRPC();
//   const { data } = useSuspenseQuery(
//     trpc.regularClasses.getAllClasses.queryOptions({ ...filters }),
//   );

//   console.log(data, 789);

//   return (
//     <div className="h-full min-h-screen bg-hero relative">
//       <div className=" absolute  z-53 w-full top-5">
//         <Navbar />
//       </div>

//       <div className="h-full  py-24">
//         <div className="w-[85%] flex items-center flex-col mx-auto">
//           <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
//             Regular Classes
//           </h1>
//           <div className="w-full h-full flex flex-col gap-6 mt-5">
//             {data.pagination.currentPage ? (
//               <div className="bg-[#FFFBF4] h-92 w-full rounded-[30px] flex flex-col items-center justify-center text-center gap-3">
//                 <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
//                   <GraduationCap className="w-6 h-6 text-gray-500" />
//                 </div>

//                 <div>
//                   <p className="text-lg font-medium text-gray-800">
//                     No Regular Classes Yet
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Regular classes will appear here when available.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {" "}
//                 {data.classes.map((e) => (
//                   <>
//                     <ContainerBox
//                       image={`${e.thumbnail}`}
//                       children={<RegularClassDetails data={e} />}
//                     />
//                   </>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegularClassesView;


"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useRegularClassesFilters } from "../hooks/hook/useRegularClasses";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import RegularClassDetails from "../component/RegularClassDetails";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

function RegularClassesView() {
  const [filters] = useRegularClassesFilters();

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.regularClasses.getAllClasses.queryOptions({ ...filters })
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
        <div className="w-[85%] flex items-center flex-col mx-auto gap-8">

          {/* TITLE */}
          <motion.h1
            className="font-passion-one font-bold text-center text-[#C77F90] text-4xl lg:text-8xl uppercase"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Regular Classes
          </motion.h1>

          <div className="w-full h-full flex flex-col gap-6">

            {data.pagination.totalCount==0 ? (

              /* EMPTY STATE */
              <motion.div
                className="bg-[#FFFBF4] h-92 w-full rounded-[30px] flex flex-col items-center justify-center text-center gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm">
                  <GraduationCap className="w-6 h-6 text-gray-500" />
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-800">
                    No Regular Classes Yet
                  </p>
                  <p className="text-sm text-gray-500">
                    Regular classes will appear here when available.
                  </p>
                </div>
              </motion.div>

            ) : (

              <motion.div
                className="flex flex-col gap-6 w-full"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
              >
                {data.classes.map((e) => (
                  <motion.div
                    key={e.id}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      show: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <ContainerBox image={e.thumbnail}>
                      <RegularClassDetails data={e} />
                    </ContainerBox>
                  </motion.div>
                ))}
              </motion.div>

            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegularClassesView;