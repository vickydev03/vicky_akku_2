import { Button } from "@/components/ui/button";
import { getWorkshopCard } from "@/trpc/type";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { circOut, motion } from "framer-motion";

interface workshopType {
  id: string;
  thumbnail: string;
  price: number;
  title: string;
  place: string;
  description: string;
  date: string;
}
function WorkshopCard({ workshop }: { workshop: getWorkshopCard }) {
  const formattedDate =
    format(workshop.eventDate, "do MMM").toUpperCase() + " -";
    
  return (
    <motion.div initial="hidden"
                variants={{
      hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
      show: {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const},
      },
    }}
                style={{ perspective: 1000 }}
                
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -8 }} className="w-full">
      <div className="card flex flex-col gap-4">
        <div className=" relative rounded-3xl  overflow-hidden">
          <Image
            className=" object-cover max-h-56 md:max-h-64 w-full h-full object-[40%_35%]"
            src={workshop.thumbnail}
            alt={workshop.title}
            quality={100}
            sizes="100vw"
            height={100}
            width={100}
          />
        </div>
        <div className="card flex flex-col items-center md:items-start gap-3">
          <div className="title-place">
            <h3 className="text-4xl font-passion-one uppercase  text-[#4B4740]">
              {workshop.title}
            </h3>
            <p className="text-4xl font-passion-one text-center md:text-left uppercase text-[#827B70]">
              {workshop?.location?.city || "Dubai"}
            </p>
          </div>
          <div className="max-w-84">
            <div
              className="text-regular text-sm line-clamp-2"
              dangerouslySetInnerHTML={{ __html: workshop.description }}
            />
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="flex w-full items-center">
              <span className="text-md text-[#827B70] font-medium">
                {formattedDate}
              </span>
              <h4 className="text-[#827B70] md:text-left text-center text-lg font-semibold">
                {workshop.price}/-
              </h4>
            </div>

            <div className="w-full">
              <Button className=" w-full md:w-fit  rounded-full bg-transparent border-[1px] border-[#656565] duration-500 text-regular transition-colors cursor-pointer hover:text-white">
                <Link href={`/workshop/${workshop.id}`}>Book</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkshopCard;
