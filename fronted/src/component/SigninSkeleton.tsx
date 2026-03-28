import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SigninSkeleton = () => {
  return (
    <div className="flex w-full md:items-center h-full justify-center min-h-[70vh]">
      <div className="w-full md:w-[70%] md:h-[70%] px-6 py-6">
        {/* Heading Skeleton */}
        <Skeleton className="h-10 md:h-14 w-3/4 md:w-1/2 mb-8 bg-[#827B70]/20 rounded-lg" />

        <div className="w-full md:max-w-[80%] mt-5 flex flex-col gap-6">
          {/* Name Field Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32 bg-[#A6A6A6]/20 rounded-md" />
            <Skeleton className="h-14 w-full rounded-full bg-[#A6A6A6]/10" />
          </div>

          {/* Contact Field Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24 bg-[#A6A6A6]/20 rounded-md" />
            <div className="w-full bg-white/5 border border-[#A6A6A6]/20 rounded-full py-2 flex gap-3 px-3 items-center h-[56px]">
               <Skeleton className="h-8 w-16 rounded-full bg-[#A6A6A6]/20" />
               <Skeleton className="h-6 flex-1 bg-[#A6A6A6]/10 rounded-md" />
            </div>
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-14 w-full md:w-56 rounded-full bg-[#827B70]/30 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default SigninSkeleton;
