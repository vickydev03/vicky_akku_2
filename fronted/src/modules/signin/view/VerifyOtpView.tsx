"use client";
import React from "react";
import VerifyOtpForm from "../component/VerifyOtpForm";

function VerifyOtpView({phone,name}:{phone:string,name:string}) {

  return (
    <div className="flex w-full  md:items-center h-full justify-center">
      <div className=" w-full   md:max-w-[70%] px-6 py-6 overflow-hidden">
        <h2 className=" text-2xl text-centers md:text-start md:text-3xl font-bold text-[#827B70] uppercase font-open-sauce ">
          we’re so happy to welcome you here!
        </h2>
        <div className="flex flex-col gap-4 mt-6 md:mt-10">
          <div className="rounded-full bg-[#F2E9F9]">
            <p className="px-4 capitalize py-2 font-open-sauce text-regular text-md md:text-lg font-medium">
              {name}
            </p>
          </div>
          <div className="rounded-full bg-[#F2E9F9]">
            <p className="px-4 py-2 flex gap-2 font-open-sauce text-regular text-md md:text-lg font-medium">
              {/* <span>+91</span> */}
              <span className=" tracking-wider">{phone}</span>
            </p>
          </div>
        </div>
        
        <div className="w-full">
          <VerifyOtpForm phone={phone} />
        </div>

      </div>
    </div>
  );
}

export default VerifyOtpView;
