"use client";
import Navbar from "@/component/Navbar";
import ContainerBox from "@/modules/signin/component/ContainerBox";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full min-h-screen bg-hero relative">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>
      <div className="h-full  py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          <h1 className="font-passion-one font-bold text-center  text-[#C77F90] text-4xl  lg:text-8xl uppercase">
            login to book your class
          </h1>
          <div className="w-full h-full">
            <ContainerBox image="/image/workshop1.webp" children={children} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
