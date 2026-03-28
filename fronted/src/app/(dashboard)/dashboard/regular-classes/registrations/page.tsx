import CreateClassView from "@/modules/dashboard/view/RegisterationViewClass";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
  return <CreateClassView />;
}

export default page;
