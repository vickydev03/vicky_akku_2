"use client";
import Navbar from "@/component/Navbar";
import React from "react";
import ProfileContainer from "../component/ProfileContainer";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
function ProfileView() {

  return (
    <div className="h-full min-h-screen bg-hero relative">

      <div className=" absolute  z-53 w-full top-5">
        <Navbar />
      </div>
      
      <div className="md:w-[90%] rounded-2xl mx-auto">
        <ProfileContainer />
      </div>

      
    </div>
  );
}

export default ProfileView;
