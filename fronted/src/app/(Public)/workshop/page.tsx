import { loadWorkshopFilter } from "@/modules/workshop/searchParms";
import UpcomingWorkShop from "@/modules/workshop/view/UpcomingWorkShop";
import UpcomingWorkShopSkeleton from "@/component/UpcomingWorkShopSkeleton";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function page({ searchParams }: PageProps) {
  let { page, limit, location } = await loadWorkshopFilter(searchParams);
  const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
    trpc.workshop.upcomingWorkshop.queryOptions({
      page,
      limit,
      location,
    }),
  );
  void queryClient.prefetchQuery(trpc.workshop.getAllLocation.queryOptions());
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<UpcomingWorkShopSkeleton/>}>
      <UpcomingWorkShop />
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
