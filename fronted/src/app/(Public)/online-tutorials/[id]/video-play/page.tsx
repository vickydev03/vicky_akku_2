
export const dynamic = "force-dynamic"
import React, { Suspense } from 'react'
import VideoPlayerView from './VideoPlayerView'
import VideoPlayerSkeleton from "@/component/VideoPlayerSkeleton";

import { caller, getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from 'next/navigation';

interface PageProps {
  params:{
    id:string
  }
}


async function page({ params }: PageProps) {
  const queryClient = getQueryClient();
  const {id}=await params
  let u=await caller.user.profile()
  u?u:null

  if (!u) redirect("/")
    
  void queryClient.prefetchQuery(
    trpc.tutorials.playVideos.queryOptions({tutorialId:id,userId:u.id}),
  );


  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<VideoPlayerSkeleton/>}>
        <VideoPlayerView tutorialId={id} userId={u.id}/>
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
