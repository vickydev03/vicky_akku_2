import { loadDashboardUserFilter } from "@/modules/dashboard/hooks/useDashboardClient";
import RegularClassesView from "@/modules/dashboard/view/RegularClassesView";
import UsersView from "@/modules/dashboard/view/UsersView";
import { loadRegularClassesFilter } from "@/modules/regular-classes/hooks/hook/useRegularClassesClient";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";
import React from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}


async function page({searchParams}:PageProps) {

    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
let { page=1, limit=10,startDate,endDate } = await loadRegularClassesFilter(searchParams);
  
const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
        trpc.regularClasses.getAllClasses.queryOptions({
          page,limit,startDate,endDate
        }),
      );
    
  return <HydrationBoundary state={dehydrate(queryClient)} >
            <RegularClassesView/>
        </HydrationBoundary> 

}

export default page;
