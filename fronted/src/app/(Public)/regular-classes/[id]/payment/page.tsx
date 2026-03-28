// import PaymentView from '@/modules/tutorials/view/PaymentView'
import PaymentView from '@/modules/regular-classes/component/PaymentView';
import React, { Suspense } from 'react'
import PaymentSkeleton from '@/component/PaymentSkeleton';


type Props = {
  params: {
    id: string;
  };
};

async function page({params}:Props) {
    const {id}=await params; 
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PaymentSkeleton/>}>
        <PaymentView id={id}/>
      </Suspense>
    // </HydrationBoundary>
  )
}

export default page