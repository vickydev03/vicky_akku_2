// import TutorialView from "@/modules/tutorials/view/TutorialView";
import TutorialViewDashboard from "@/modules/dashboard/view/TutorialView";
import TutorialView from "@/modules/dashboard/view/TutorialView";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

interface PageProps {
  params:{
    id:string
  }
}


async function page({ params }: PageProps) {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
  const queryClient = getQueryClient();
  const {id}=await params
  console.log(id,"ajay")
  void queryClient.prefetchQuery(
    trpc.tutorials.getTutorialAdmin.queryOptions({id}),
  );
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <TutorialViewDashboard id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
