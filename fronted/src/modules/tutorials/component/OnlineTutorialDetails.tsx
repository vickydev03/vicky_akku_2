// "use client";

// import { getTutorial } from "@/trpc/type";
// import React from "react";
// import DOMPurify from "dompurify";
// import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";
// import { useRouter } from "next/navigation";

// function OnlineTutorialDetails({ data }: { data: getTutorial }) {
//   const trpc = useTRPC();
//   const { data: user } = useQuery(trpc.user.profile.queryOptions());
//   const router = useRouter();
//   const sanitizedDescription = DOMPurify?.sanitize(data.description);

//   const handleLearn = () => {
//     if (!user) {
//       router.push(`/signin`);
//       return;
//     }
//     router.push(`/online-tutorials/${data.id}/payment`);
//   };
//   return (
//     <div className="w-full h-full  py-3 lg:py-7">
//       <div className="  w-full flex flex-col items-center justify-center gap-2 md:gap-3 h-full    m-auto px-4">
//         <div className="title-place h-fit w-full">
//           <h3 className="text-4xl text-left font-passion-one uppercase  text-[#4B4740]">
//             {data.title}
//           </h3>
//         </div>
//         <div className="w-full h-fit">
//           <div
//             className="tutorial-desc flex flex-col gap-2 text-[#656565]"
//             dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
//           />
//         </div>

//         <div className="flex w-full  items-centers md:items-starts max-w-72 md:max-w-full mr-auto flex-col md:flex-row gap-6">
//           <div className="bg-[#F2E9F9] rounded-full text-lg px-4 md:px-3 md:pr-8 py-2 lg:py-3  w-full md:w-fit text-[#6B6B6B]  shadow-sm shadow-black/5">
//             <p>
//               Fees-
//               <span className="font-bold line-through">
//                 INR {Math.round(data.price) * 1.2}
//               </span>{" "}
//               <span className="font-bold">
//                 INR {Math.floor(data.price)}/-
//               </span>{" "}
//             </p>
//           </div>

//           <Button
//             onClick={handleLearn}
//             className="tracking-wider py-3 px-6 text-xs md:py-6 text-md md:px-10 cursor-pointer w-full md:w-fit font-open-sauce font-bold rounded-full bg-primary text-white"
//           >
//             Pay & Join Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OnlineTutorialDetails;


"use client";

import { getTutorial } from "@/trpc/type";
import React from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function OnlineTutorialDetails({ data }: { data: getTutorial }) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.profile.queryOptions());
  const router = useRouter();

  const sanitizedDescription = DOMPurify?.sanitize(data.description);

  const handleLearn = () => {
    if (!user) {
      router.push(`/signin`);
      return;
    }

    router.push(`/online-tutorials/${data.id}/payment`);
  };

  return (
    <div className="w-full h-full py-3 lg:py-7">
      <motion.div
        className="w-full flex flex-col items-center justify-center gap-2 md:gap-3 h-full m-auto px-4"
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
        {/* TITLE */}
        <motion.div
          className="title-place h-fit w-full"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-4xl text-left font-passion-one uppercase text-[#4B4740]">
            {data.title}
          </h3>
        </motion.div>

        {/* DESCRIPTION */}
        <motion.div
          className="w-full h-fit"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="tutorial-desc flex flex-col gap-2 text-[#656565]"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </motion.div>

        {/* PRICE + BUTTON */}
        <motion.div
          className="flex w-full items-centers md:items-starts max-w-72 md:max-w-full mr-auto flex-col md:flex-row gap-6"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#F2E9F9] rounded-full text-lg px-4 md:px-3 md:pr-8 py-2 lg:py-3 w-full md:w-fit text-[#6B6B6B] shadow-sm shadow-black/5">
            <p>
              Fees-
              <span className="font-bold line-through">
                INR {Math.round(data.price) * 1.2}
              </span>{" "}
              <span className="font-bold">
                INR {Math.floor(data.price)}/-
              </span>
            </p>
          </div>

          <Button
            onClick={handleLearn}
            className="tracking-wider py-3 px-6 text-xs md:py-6 text-md md:px-10 cursor-pointer w-full md:w-fit font-open-sauce font-bold rounded-full bg-primary text-white"
          >
            Pay & Join Now
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OnlineTutorialDetails;