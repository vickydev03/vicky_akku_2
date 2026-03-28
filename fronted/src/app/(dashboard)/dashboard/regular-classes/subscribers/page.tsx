import { loadDashboardUserFilter } from "@/modules/dashboard/hooks/useDashboardClient";
import RegularClassesView from "@/modules/dashboard/view/RegularClassesView";
import SubscribersView from "@/modules/dashboard/view/SubscribersView";
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
  
let { page=1, limit=10,startDate,endDate,productId } = await loadRegularClassesFilter(searchParams);
  
const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
        trpc.regularClasses.getSubscribers.queryOptions({
          page,limit,startDate,endDate,productId
        }),
      );
    
  return <HydrationBoundary state={dehydrate(queryClient)} >
            <SubscribersView/>
        </HydrationBoundary> 

}

export default page;
