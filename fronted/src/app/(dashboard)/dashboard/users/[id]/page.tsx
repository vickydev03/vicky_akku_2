import UserView from '@/modules/dashboard/view/UserView';
import { caller, getQueryClient, trpc } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react'

interface PageProps {
  params:{
    id:string
  }
}

async function page({params}:PageProps) {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
      const queryClient = getQueryClient();
      const {id}=await params
    //   console.log(id,"ajay")
      void queryClient.prefetchQuery(
        trpc.user.getUser.queryOptions({id}),
      );
    
  return (
    <UserView id={id}/>
  )
}

export default page