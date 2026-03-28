import TutorialView from "@/modules/tutorials/view/TutorialView";
import { loadWorkshopFilter } from "@/modules/workshop/searchParms";
import TutorialsView from "@/modules/workshop/view/TutorialsView";
import UpcomingWorkShop from "@/modules/workshop/view/UpcomingWorkShop";
import WorkshopView from "@/modules/workshop/view/workshopView";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import React, { Suspense } from "react";
import TutorialSkeleton from "@/component/TutorialSkeleton";

interface PageProps {
  params:{
    id:string
  }
}


async function page({ params }: PageProps) {
  const queryClient = getQueryClient();
  const {id}=await params
  console.log(id,"ajay")
  void queryClient.prefetchQuery(
    trpc.tutorials.getTutorial.queryOptions({id}),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TutorialSkeleton/>}>
        <TutorialView id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
