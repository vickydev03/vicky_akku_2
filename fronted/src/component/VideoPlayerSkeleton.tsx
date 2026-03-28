import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const VideoPlayerSkeleton = () => {
  return (
    <div className="bg-hero min-h-screen w-full relative overflow-hidden">
      {/* Navbar placeholder */}
      <div className="absolute z-50 w-full top-5">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-14 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="relative z-10 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-8">
          <Skeleton className="h-4 w-20 bg-white/20 mb-2 rounded" />
          <Skeleton className="h-10 md:h-16 w-3/4 md:w-1/2 bg-[#DAA3B0]/20 rounded-lg" />
          
          {/* progress strip placeholder */}
          <div className="mt-5 flex items-center gap-4 max-w-md">
            <Skeleton className="flex-1 h-[3px] bg-white/10 rounded-full" />
            <Skeleton className="h-4 w-24 bg-white/10 rounded" />
          </div>
        </div>

        {/* ── Player + sidebar grid mimic ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-0 rounded-2xl overflow-hidden border border-white/10 shadow-black/60 bg-black/55 backdrop-blur-3xl">
          
          {/* LEFT — player column skeleton */}
          <div className="flex flex-col">
            {/* 16:9 video placeholder */}
            <Skeleton className="relative w-full aspect-video bg-black/40 rounded-none" />

            {/* now-playing bar placeholder */}
            <div className="px-6 py-5 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-32 bg-white/10 rounded" />
                  <Skeleton className="h-6 w-3/4 bg-white/20 rounded" />
                </div>
                <Skeleton className="h-6 w-16 bg-[#DAA3B0]/20 rounded-full" />
              </div>
              
              {/* prev / next buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 bg-white/5 rounded-lg" />
                <Skeleton className="h-10 flex-1 bg-[#DAA3B0]/10 rounded-lg" />
              </div>
            </div>
          </div>

          {/* RIGHT — lesson list skeleton */}
          <div className="flex flex-col border-l border-white/10 bg-black/50">
            {/* sidebar header */}
            <div className="px-4 py-3.5 border-b border-white/5 flex justify-between items-center">
              <Skeleton className="h-3 w-16 bg-white/20 rounded" />
              <Skeleton className="h-5 w-8 bg-[#DAA3B0]/20 rounded-full" />
            </div>

            {/* lesson rows placeholders */}
            <div className="flex-1 space-y-px p-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-3 border-b border-white/5">
                  <Skeleton className="size-8 rounded-full bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/15 rounded" />
                    <Skeleton className="h-3 w-1/4 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* thumbnail footer placeholder */}
            <div className="p-3 border-t border-white/5">
              <Skeleton className="aspect-video w-full rounded-xl bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;
