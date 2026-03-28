import TutorialSkeleton from '@/component/TutorialSkeleton';
import PaymentView from '@/modules/tutorials/view/PaymentView'
import React, { Suspense } from 'react'


type Props = {
  params: {
    id: string;
  };
};

async function page({params}:Props) {
    const {id}=await params; 
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TutorialSkeleton/>}>
        <PaymentView id={id}/>
      </Suspense>
    // </HydrationBoundary>
  )
}

export default page