import { getClasses, getTutorial } from "@/trpc/type";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { usePayment } from "@/hooks/usePayment";

function PaymentDetails({ data }: { data: getClasses }) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.profile.queryOptions());

    const { startPayment, isLoading } = usePayment();
  
  const handlePayment = () => {
    startPayment(data.id, "CLASS");
    
  };

  const startDate = format(data.startDate, "do MMM yyyy").toUpperCase();

  const endDate = format(data.endDate, "do MMM yyyy").toUpperCase();
  return (
    <div className="py-4 px-6   h-full lg:py-7">
      <div className="flex items-center  h-full justify-center">
        <div className="w-full  space-y-4">
          <div className="space-y-6 flex items-center md:items-start md:justify-normal justify-center flex-col">
            <h3 className="text-3xl md:text-5xl lg:text-4xl font-medium font-open-sauce uppercase text-[#827B70]">
              Hi {user?.name}
            </h3>
            <p className="uppercase text-center md:text-left font-open-sauce font-bold text-xl text-[#6B6B6B]">
              Please proceed to book
            </p>
          </div>

          <div className="bg-[#F2E9F9] rounded-[10px] mx-auto md:mx-0 w-fit  py-4 px-3 font-open-sauce text-[#827B70]">
            <h3 className="uppercase text-center font-extrabold">
              {data.title} ,{" "}
              <span className="uppercase text-center font-extrabold md:text-left text-[#827B70]">
                {data?.City}
              </span>{" "}
            </h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className=" text-sm rounded-sm  md:text-md    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-md shadow-black/5">
              <p className="inline-block text-center uppercase ">
                Date -{" "}
                <span className="font-bold">
                  {startDate}-{endDate}
                </span>
              </p>
            </div>
            <div className="bg-[#F2E9F9]  rounded-sm text-lg px-4 md:px-3 md:pr-8 py-2 w-fit text-[#6B6B6B] font-bold shadow-md shadow-black/5">
              <span className="font-normal ">Fees-</span> INR {data.price}/-
            </div>
          </div>

          <div className="flex w-fit order-4 items-center md:items-start flex-col gap-6">
            <p className="text-[#827B70] text-center md:text-left text-sm md:text-lg flex items-center gap-2 font-semibold">
              Regular Dance Classes <br />
              Build strong foundations and grow with every session
            </p>
            <Button
            disabled={isLoading}
              onClick={handlePayment}
              className="rounded-full cursor-pointer py-3 md:py-6 text-md px-10 md:max-w-56 max-w-full"
      //         "tracking-wider py-3 px-6 text-xs md:py-4 md:text-sm md:px-6-p0|?
      // }): cursor-pointer w-fit font-open-sauce font-semibold rounded-full bg-primary text-white"
            >
              Make Payment
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetails;
