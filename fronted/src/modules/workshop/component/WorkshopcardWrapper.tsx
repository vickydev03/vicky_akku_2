import React from "react";
import Workshops from "./Workshops";
import { getWorkshop, getWorkshopType } from "@/trpc/type";

function WorkshopcardWrapper({workshops}:{workshops:getWorkshopType}) {

  return (
    <div className="rounded-2xl bg-[#FFFBF4] w-full h-full py-4">
      <div className="py-6 px-6 md:px-8 lg:px-12 flex flex-col gap-6">
        <h2 className="font-open-sans text-[#827B70] text-md  md:text-4xl uppercase text-center">
          Workshops across cities
        </h2>
        <Workshops data={workshops} />
      </div>
    </div>
  );
}

export default WorkshopcardWrapper;
