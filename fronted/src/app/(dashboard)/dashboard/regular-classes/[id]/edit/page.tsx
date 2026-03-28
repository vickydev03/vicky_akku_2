import RegularClassesEditView from '@/modules/dashboard/view/RegularClassesEditView'
import { caller } from '@/trpc/server';
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
  
    const {id}=await params
  return (
    <RegularClassesEditView id={id}/>
  )
}

export default page