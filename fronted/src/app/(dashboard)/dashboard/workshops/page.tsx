
import DashBoardWorkshopView from "@/modules/dashboard/view/DashBoardWorkshopView";

import { loadWorkshopFilter } from "@/modules/workshop/searchParms";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function page({ searchParams }: PageProps) {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
  let { page = 1, limit = 10,location="all",type } = await loadWorkshopFilter(searchParams);
  
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.workshop.upcomingWorkshop.queryOptions({
      page,
      limit,
      location,
      type
    }),
  );

  return <HydrationBoundary state={dehydrate(queryClient)}>
    <DashBoardWorkshopView />;
  </HydrationBoundary>
}

export default page;
