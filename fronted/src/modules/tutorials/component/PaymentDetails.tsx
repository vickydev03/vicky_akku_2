import { getTutorial } from '@/trpc/type'
import React from 'react'
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTRPC } from '@/trpc/client';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { usePayment } from '@/hooks/usePayment';

function PaymentDetails({tutorial}:{tutorial:getTutorial}) {
    const trpc=useTRPC()
    const { data: user } = useQuery(trpc.user.profile.queryOptions());

    // const handlePayment = () => {};

      const { startPayment, isLoading } = usePayment();
      
       
       const handlePayment = () => {
          startPayment(tutorial.id,"TUTORIAL")
        };  

    return (
        <div className="py-4 px-6   h-full lg:py-7">
          <div className="flex items-center  h-full justify-center">
            <div className="w-full  space-y-4">
              <div className="space-y-6 flex items-center md:items-start md:justify-normal justify-center flex-col">
                <h3 className="text-3xl md:text-5xl lg:text-4xl font-medium font-open-sauce uppercase text-[#827B70]">
                  Hi {user?.name}
                </h3>
                <p className="uppercase text-center md:text-left font-open-sauce font-bold text-2xl text-[#6B6B6B]">
                  Please proceed to book
                </p>
              </div>
    
              <div className="bg-[#F2E9F9] rounded-[10px] mx-auto md:mx-0 w-fit  py-6 px-4 font-open-sauce text-[#827B70]">
                <h3 className="uppercase font-extrabold">{tutorial.title}</h3>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className=" text-md rounded-sm  md:text-lg    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-md shadow-black/5">
                  <p className="inline-block font-bold uppercase ">One time purchase</p>
                </div>
                <div className="bg-[#F2E9F9] rounded-sm text-lg px-4 md:px-3 md:pr-8 py-2 w-fit text-[#6B6B6B] font-bold shadow-md shadow-black/5">
                  <span className="font-normal">Fees-</span> INR {tutorial.price}/-
                </div>
              </div>
    
              <div className="flex w-fit order-4 items-center md:items-start flex-col gap-6">
                <p className="text-[#827B70] text-center md:text-left text-sm md:text-lg flex items-center gap-2 font-semibold">
                  Intermediate level Choreography <br/>
                Learn from the comfort of your own house
                </p>
                <Button
                  onClick={handlePayment}
                  className="rounded-full cursor-pointer py-3 md:py-6 text-md px-10 md:max-w-56 max-w-full"
                  
      //             className="tracking-wider py-3 px-6 text-xs md:py-4 md:text-sm md:px-6-p0|?
      // }): cursor-pointer w-fit font-open-sauce font-semibold rounded-full bg-primary text-white"
                >
                  Make Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default PaymentDetails