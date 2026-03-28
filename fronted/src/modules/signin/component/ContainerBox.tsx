"use client";
import Image from "next/image";
import React from "react";
import LoginForm from "./LoginForm";

function ContainerBox({children,image}:{children:React.ReactNode,image:string}) {
  return (
    <div className="rounded-2xl bg-[#FFFBF4]  w-full h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className=" flex w-full px-4 py-4 md:px-[2rem] md:py-[2rem]  relative overflow-hidden">
          <Image
            src={image}
            className=" object-cover max-h-128 h-full w-full rounded-3xl"
            height={100}
            sizes="100vw"
            quality={100}
            width={100}
            alt="workshop"
          />
        </div>
        <div className="w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ContainerBox;
