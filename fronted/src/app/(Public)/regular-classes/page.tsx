import { loadRegularClassesFilter } from '@/modules/regular-classes/hooks/hook/useRegularClassesClient';
import RegularClassesView from '@/modules/regular-classes/view/RegularClassesView'
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { SearchParams } from 'nuqs/server';
import React, { Suspense } from 'react'
import RegularClassesSkeleton from '@/component/RegularClassesSkeleton';

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function page({searchParams}:PageProps) {

  const queryClient = getQueryClient();
    
    let { page, limit } = await loadRegularClassesFilter(searchParams);
    
    void queryClient.prefetchQuery(
      trpc.regularClasses.getAllClasses.queryOptions({
        page,limit
      }),
    );
    
  return (
    
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RegularClassesSkeleton/>}>
      <RegularClassesView/>

      </Suspense>
    </HydrationBoundary>

  )
}

export default page