"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import TutorialsContainer from "../component/TutorialsContainer";
import { useTutorialFilters } from "@/modules/tutorials/hook/useTutorials";

function TutorialsView() {
  const trpc = useTRPC();
  const [filters,setFilters]=useTutorialFilters()
  const { data } = useSuspenseQuery(trpc.tutorials.getTutorials.queryOptions({...filters}));
  
  return <div className=" relative bg-hero min-h-screen">
    <div className=" absolute  z-53 w-full top-5">
            <Navbar/>
          </div>
          <TutorialsContainer data={data}/>
  </div>;
}

export default TutorialsView;
