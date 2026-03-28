import WorkshopView from "@/modules/dashboard/view/WorkshopView";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
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
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <WorkshopView id={id} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
