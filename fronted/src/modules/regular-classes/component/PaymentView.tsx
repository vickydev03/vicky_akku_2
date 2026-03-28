// "use client";
// import Navbar from "@/component/Navbar";
// import ContainerBox from "@/modules/signin/component/ContainerBox";
// import ContainerPayment from "@/modules/signin/component/ContainerPayment";
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import React from "react";
// import PaymentDetails from "./PaymentDetails";
// // import PaymentDetails from "../component/PaymentDetails";

// function PaymentView({ id }: { id: string }) {
//   const trpc = useTRPC();

//   const { data } = useSuspenseQuery(
//     trpc.regularClasses.getClass.queryOptions({ id }),
//   );
  
//   return (
//     <div className="h-full min-h-screen bg-hero relative">
//       <div className=" absolute  z-53 w-full top-5">
//         <Navbar />
//       </div>

//       <div className="h-full  py-24">
//         <div className="w-[85%] flex items-center flex-col mx-auto">
//           <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
//             Pay To book your class
//           </h1>
//           <div className="w-full h-full">
//             <ContainerPayment
//               image={`${data.thumbnail}`}
//               children={<PaymentDetails data={data} />}
              
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PaymentView;


"use client";
import Navbar from "@/component/Navbar";
import ContainerPayment from "@/modules/signin/component/ContainerPayment";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import PaymentDetails from "./PaymentDetails";
import { motion } from "framer-motion";

function PaymentView({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.regularClasses.getClass.queryOptions({ id })
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
            Pay To book your class
          </motion.h1>

          {/* PAYMENT CONTAINER */}
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.96, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContainerPayment image={data.thumbnail}>
              <PaymentDetails data={data} />
            </ContainerPayment>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export default PaymentView;