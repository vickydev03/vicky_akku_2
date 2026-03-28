import { getWorkshopId } from "@/trpc/type";
import React from "react";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Image from "next/image"
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation"

function WorkshopDetails({ workshop }: { workshop: getWorkshopId }) {
  const sanitizedDescription = DOMPurify?.sanitize(workshop.description);
  const formattedDate = format(
    workshop.eventDate,
    "do MMM yyyy | h b",
  ).toUpperCase();
  if (!workshop) return <p className="bg-red-400 h-36reg">lol</p>;

  const trpc=useTRPC()
  const {data:user}=useQuery(trpc.user.profile.queryOptions())
  
  console.log(user,"test")
  
  const router=useRouter()
  
  const handleBook=()=>{
    if (!user){
      router.push(`/signin`)
      return
    }
    router.push(`/workshop/${workshop.id}/payment`)
  }
  return (
    <div className="py-3 flex items-center justify-center  lg:py-7">
      <div className="w-full h-full grid grid-cols-1 gap-2   m-auto space-y-3 px-4">
        <div className="title-place flex-wrap order-1">
          <h3 className="text-4xl text-center md:text-left font-passion-one uppercase  text-[#4B4740]">
            {workshop.title}
          </h3>
          <p className="text-4xl font-passion-one  uppercase text-center md:text-left text-[#827B70]">
            {workshop?.location&&workshop?.location.place} - {workshop?.location&&workshop?.location?.city}
          </p>
        </div>
        <div className="w-full h-full order-3 md:order-2 ">
          <div
            className="workshop-desc flex flex-col gap-2 text-[#656565]"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        <div className="flex order-2 md:order-3 flex-col justify-center md:justify-normal items-center md:flex-row gap-3">
          <div className=" text-md rounded-sm  md:text-lg    lg:text-xl px-3 py-2 bg-[#F2E9F9] text-[#6B6B6B] w-fit flex items-center gap-3 shadow-lg shadow-black/5">
            <span className="inline-block font-normal">Date-</span>
            <h3 className="inline-block font-bold ">{formattedDate}</h3>
          </div>
          <div className="bg-[#F2E9F9] rounded-sm text-lg px-4 md:px-3 md:pr-8 py-2 w-fit text-[#6B6B6B] font-bold shadow-xl shadow-black/5">
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
            <span>{workshop?.location&&workshop.location.address}</span>
          </p>
          <Button
            onClick={handleBook}
            className="tracking-wider py-3 px-6 text-xs md:py-6 text-md md:px-10 cursor-pointer w-fit font-open-sauce font-bold rounded-full bg-primary text-white"
          >
            Pay & Book
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkshopDetails;
