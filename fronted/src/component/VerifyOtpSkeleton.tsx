import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const VerifyOtpSkeleton = () => {
  return (
    <div className="flex w-full md:items-center h-full justify-center min-h-[70vh]">
      <div className="w-full md:max-w-[70%] px-6 py-6 overflow-hidden">
        {/* Heading Skeleton */}
        <Skeleton className="h-10 md:h-12 w-3/4 md:w-1/2 mb-8 bg-[#827B70]/20 rounded-lg" />

        <div className="flex flex-col gap-4 mt-6 md:mt-10">
          {/* Name Badge Skeleton */}
          <Skeleton className="h-10 w-full md:w-1/3 rounded-full bg-[#F2E9F9]/50" />
          {/* Phone Badge Skeleton */}
          <Skeleton className="h-10 w-full md:w-1/4 rounded-full bg-[#F2E9F9]/50" />
        </div>

        <div className="w-full mt-10 flex flex-col gap-6">
          {/* "Enter OTP" sub-heading */}
          <Skeleton className="h-6 w-32 bg-[#A6A6A6]/20 rounded-md" />

          {/* OTP Slots Skeleton */}
          <div className="flex gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="size-10 md:size-12 rounded-lg bg-white/20 border border-[#A6A6A6]/10" />
            ))}
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-14 w-full md:w-56 rounded-full bg-[#827B70]/30 mt-4" />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpSkeleton;
