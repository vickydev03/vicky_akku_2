"use client";
import Navbar from "@/component/Navbar";
import React from "react";
import ContainerBox from "../component/ContainerBox";
import Footer from "@/component/Footer";
import LoginForm from "../component/LoginForm";

function Signinview() {
  return (
    <div className="flex w-full  md:items-center h-full justify-center">
      <div className=" w-full  md:w-[70%] md:h-[70%] px-6 py-6">
        <h2 className=" text-2xl text-centers md:text-start md:text-4xl font-bold text-[#827B70] uppercase font-open-sauce ">
          we’re so happy to welcome you here!
        </h2>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Signinview;
