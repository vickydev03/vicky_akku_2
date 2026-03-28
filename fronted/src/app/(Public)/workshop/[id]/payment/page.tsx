import Navbar from '@/component/Navbar';
import ContainerBox from '@/modules/signin/component/ContainerBox';
import PaymentView from '@/modules/workshop/view/PaymentView';
import { useTRPC } from '@/trpc/client';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary, useSuspenseQuery } from '@tanstack/react-query';
import React from 'react'

type Props = {
  params: {
    id: string;
  };
};
async function page({params}:Props) {
  const {id}=await params
   const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
      trpc.tutorials.getTutorial.queryOptions({id}),
    );
  
  return (
    
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PaymentView id={id}/>
        </HydrationBoundary>
        
  )
}

export default page