// export const dynamic = "force-dynamic";
import HeroSkeleton from '@/component/HeroLoader';
import HomeView from '@/modules/home/view/HomeView'
import {  getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React, { Suspense } from 'react'

async function page() {

  // let u=await caller.user.profile()
  // u?u:null
  const queryClient = getQueryClient();
    

    void queryClient.prefetchQuery(trpc.workshop.upcomingWorkshop.queryOptions({
          page:1,
          limit:3,
          location:"all"
        }),);
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)} >
    {/* <div> */}
      <Suspense fallback={<HeroSkeleton/>}>
        <HomeView/>
      </Suspense>
      
    {/* </div> */}
    </HydrationBoundary>
  )
}

export default page