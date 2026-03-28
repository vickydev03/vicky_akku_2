

export const dynamic = "force-dynamic";

import CreateTutorialsView from "@/modules/dashboard/view/CreateTutorialsView";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";



async function page() {

  const user = await caller.user.profile();

  console.log(user);

if (!user || user.role !== "ADMIN") {
  redirect("/adminsignin");
}

const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
        trpc.tutorials.getVideos.queryOptions()
      );
    
  return <HydrationBoundary state={dehydrate(queryClient)} >
            <CreateTutorialsView/>
        </HydrationBoundary> 

}

export default page;
