import { useTRPC } from "@/trpc/client";
import { getWorkshop, getWorkshopId } from "@/trpc/type";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/hooks/usePayment";

function PaymentDetails({ workshop }: { workshop: getWorkshopId }) {
  const trpc = useTRPC();
  // const createOrder = trpc.order.create.mutationOptions();
  // const verifyOrder = trpc.order.verify.mutationOptions();

  const { startPayment, isLoading } = usePayment();

  const handlePayment = () => {
    startPayment(workshop.id, "WORKSHOP");
  };
  const { data: user } = useQuery(trpc.user.profile.queryOptions());
  const formattedDate = format(
    workshop.eventDate,
    "do MMM yyyy , h b",
  ).toUpperCase();
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
            <h3 className="uppercase font-extrabold">{workshop.title}</h3>
            <p className="font-extrabold">
              {workshop.location && workshop.location.city}-
              {workshop.location && workshop.location.place}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className=" text-md rounded-sm  md:text-lg    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-md shadow-black/5">
              <span className="inline-block font-normal">Date-</span>
              <h3 className="inline-block font-bold ">{formattedDate}</h3>
            </div>
            <div className="bg-[#F2E9F9] rounded-sm text-lg px-4 md:px-3 md:pr-8 py-2 w-fit text-[#6B6B6B] font-bold shadow-md shadow-black/5">
              <span className="font-normal">Fees-</span> INR {workshop.price}/-
            </div>
          </div>

          <div className="flex w-fit order-4 items-center md:items-start flex-col gap-6">
            <p className="text-[#827B70] text-sm md:text-lg flex items-center gap-2 font-semibold">
              <span>
                <Image
                  src={"/image/svg/address.svg"}
                  alt="address"
                  height={60}
                  width={60}
                />
              </span>
              <span>{workshop.location && workshop.location.address}</span>
            </p>
            <Button
              disabled={isLoading}
              onClick={handlePayment}
              className="rounded-full cursor-pointer py-3 md:py-6 text-md px-10 md:max-w-56 max-w-full"
              
              // "tracking-wider py-3 px-6 text-xs md:py-6  md:px-6 cursor-pointer w-fit font-open-sauce md:text-md font-semibold rounded-full bg-primary text-white "
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
