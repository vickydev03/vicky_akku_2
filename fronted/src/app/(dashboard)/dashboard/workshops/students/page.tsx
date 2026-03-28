import { loadDashboardUserFilter } from '@/modules/dashboard/hooks/useDashboardClient';
import StudentsView from '@/modules/dashboard/view/StudentsView'
import { caller, getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { SearchParams } from 'nuqs/server';
import React from 'react'


interface PageProps {
  searchParams: Promise<SearchParams>;
}


async function page({searchParams}:PageProps) {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
    let { page=1, limit=10 ,productId} = await loadDashboardUserFilter(searchParams);
      
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.workshop.getStudents.queryOptions({page,limit,productId}))
          
  return (
     <HydrationBoundary state={dehydrate(queryClient)} >
         <StudentsView/>
     </HydrationBoundary>
  )
}

export default page