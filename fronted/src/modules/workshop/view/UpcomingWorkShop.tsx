"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import WorkshopContainer from "../component/WorkshopContainer";
import ClassDetails from "@/modules/home/component/ClassDetails";
import { useWorkshopFilters } from "../useWorkshop";

function UpcomingWorkShop() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.user.profile.queryOptions());
  const [filters,setFilters]=useWorkshopFilters()
  const { data: workshops } = useSuspenseQuery(
    trpc.workshop.upcomingWorkshop.queryOptions({...filters}),
  );
  
  
  const { data: locations } = useSuspenseQuery(
    trpc.workshop.getAllLocation.queryOptions(),
  );

  console.log(locations,"hii i am from the client");

  let isUserExist = user ? true : false;

  return (
    <div className=" min-h-screen relative bg-hero">
      <div className=" absolute  z-53 w-full top-5">
        <Navbar isUserExist={isUserExist} locations={locations}/>
      </div>
      <WorkshopContainer workshops={workshops} locations={locations} />
      <ClassDetails className="w-full mx-auto hidden md:block" />
    </div>
  );
}

export default UpcomingWorkShop;
