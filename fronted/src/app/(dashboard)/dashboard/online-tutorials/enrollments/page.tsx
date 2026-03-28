import EnrollmentView from '@/modules/dashboard/view/EnrollmentView'
import { caller } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React, { Suspense } from 'react'

async function page() {
    const user = await caller.user.profile();
  
    console.log(user);
  
  if (!user || user.role !== "ADMIN") {
    redirect("/adminsignin");
  }
  
  return (
    <Suspense fallback={<div>loading...</div>}>

    <EnrollmentView/>
    </Suspense>
  )
}

export default page