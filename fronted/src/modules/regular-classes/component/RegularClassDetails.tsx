import { getClasses } from "@/trpc/type";
import React from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function RegularClassDetails({ data }: { data: getClasses }) {
  const router=useRouter()
  const handleBook = () => {
    router.push(`/regular-classes/${data.id}/payment`)
  };
  
  const sanitizedDescription = DOMPurify?.sanitize(data.description);
  return (
    <div className="py-3 flex w-full h-full items-center justify-center   lg:py-7">
      <div className="w-full space-y-3 md:space-y-6   m-auto px-4">
        <div className="title-place flex-wrap order-1">
          <h3 className="text-4xl    md:text-left font-passion-one uppercase  text-[#4B4740]">
            {data.title} -{" "}
            <span className="text-4xl font-passion-one  uppercase text-center md:text-left text-[#827B70]">
              {data?.City}
            </span>
          </h3>
        </div>
        <div className="w-full h-full order-3 md:order-2 ">
          <div
            className="workshop-desc flex flex-col gap-2 text-[#656565]"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        </div>

        <div className="w-full space-y-2">
          <h3 className="uppercase font-bold text-sm lg:text-lg text-[#656565]">
            Perfect for:
          </h3>
          <ul className="flex flex-wrap gap-4">
            {data.perfectFor.map((e) => (
              <li key={e.id} className="border px-2 md:px-4 py-2 text-[#656565] font-semibold border-black rounded-full text-sm md:text-md">
                <span className=" ">{e.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full max-w-[200px] md:max-w-full mt-6  items-center md:items-start flex-col md:flex-row gap-4 md:gap-6">
          <div className="bg-[#F2E9F9] rounded-full  text-xs lg:text-lg px-4 md:px-3 md:pr-8 w-full text-center py-2 md:w-fit text-[#6B6B6B] font-bold shadow-sm shadow-black/5">
            <span className="font-normal">Fees-</span> INR {data.price}/-
          </div>

          <Button
            onClick={handleBook}
            className="tracking-wider w-full py-3 px-6 text-xs! md:text-md! md:py-6 text-md md:px-10 cursor-pointer md:w-fit font-open-sauce font-bold rounded-full bg-primary text-white"
          >
            Pay & Book
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegularClassDetails;
