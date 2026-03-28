import TutorialEditView from '@/modules/dashboard/view/TutorialEditView'
import { caller } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react'

interface PageProps{
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
    
    const {id}=await params
  return (
   <TutorialEditView id={id}/>
  )
}

export default page