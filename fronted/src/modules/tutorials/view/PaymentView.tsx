"use client";
import Navbar from "@/component/Navbar";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import ContainerPayment from "@/modules/signin/component/ContainerPayment";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import PaymentDetails from "../component/PaymentDetails";
import { usePayment } from "@/hooks/usePayment";

function PaymentView({ id }: { id: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.tutorials.getTutorial.queryOptions({ id }),
  );
  return (
    <div className="h-full min-h-screen bg-hero relative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>

      <div className="h-full  py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
            Pay To book your class
          </h1>
          <div className="w-full h-full">
            <ContainerPayment
              image={`${data.thumbnail}`}
              children={<PaymentDetails tutorial={data} />}
              
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentView;
