import TutorialsView from '@/modules/workshop/view/TutorialsView'
import { getQueryClient, trpc } from '@/trpc/server';
import React, { Suspense } from 'react'
import { SearchParams } from "nuqs/server";
import { loadTutorialsFilter } from '@/modules/tutorials/hook/useTutorialsClient';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import TutorialsSkeleton from '@/component/TutorialsSkeleton';

interface PageProps {
  searchParams: Promise<SearchParams>;
}


async function page({searchParams}:PageProps) {
  const queryClient = getQueryClient();
  let { page=1, limit=1 } = await loadTutorialsFilter(searchParams);

  void queryClient.prefetchQuery(
      trpc.tutorials.getTutorials.queryOptions({
        page,
        limit,
      }),
    );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<TutorialsSkeleton/>}>
        <TutorialsView />
      </Suspense>
    </HydrationBoundary>
  )
}

export default page