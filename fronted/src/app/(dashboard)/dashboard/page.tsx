export const dynamic = "force-dynamic";

import React from "react";
import DashboardView from "@/modules/dashboard/view/DashBoardView";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  
  const user = await caller.user.profile();

  console.log(user);

  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
  return (
    <div className="w-full px-6 max-w-7xl mx-auto">
      <DashboardView />
    </div>
  );
}