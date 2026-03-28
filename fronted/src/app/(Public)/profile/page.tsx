export const dynamic = "force-dynamic";
import ProfileSkeleton from '@/component/ProfileSkeleton'
import ProfileView from '@/modules/home/view/ProfileView'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense fallback={<ProfileSkeleton/>}>
    <ProfileView/>

    </Suspense>
  )
}

export default page