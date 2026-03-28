import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const RegularClassesSkeleton = () => {
  return (
    <div className="h-full min-h-screen bg-hero relative">
      {/* Navbar placeholder */}
      <div className="absolute z-53 w-full top-5">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-14 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="h-full py-24">
        <div className="w-[85%] flex items-center flex-col mx-auto">
          {/* Page Heading */}
          <Skeleton className="h-12 md:h-24 w-3/4 md:w-1/2 bg-[#C77F90]/20 rounded-lg mb-8" />

          <div className="w-full h-full flex flex-col gap-6 mt-5">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl bg-[#FFFBF4] w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Image Section mimic */}
                  <div className="flex w-full px-4 py-4 md:px-[2rem] md:py-[2rem] relative overflow-hidden">
                    <Skeleton className="object-cover h-64 sm:h-80 md:h-full min-h-64 w-full rounded-3xl bg-gray-200" />
                  </div>

                  {/* Details Section mimic */}
                  <div className="w-full h-full py-3 lg:py-7 px-4 md:px-8 flex flex-col justify-center gap-4">
                    {/* Title and City */}
                    <div className="flex flex-wrap gap-2">
                       <Skeleton className="h-10 w-48 bg-[#4B4740]/10 rounded-md" />
                       <Skeleton className="h-10 w-32 bg-[#827B70]/10 rounded-md" />
                    </div>

                    {/* Description lines */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full bg-[#656565]/10 rounded" />
                      <Skeleton className="h-4 w-[95%] bg-[#656565]/10 rounded" />
                    </div>

                    {/* "Perfect for" section */}
                    <div className="space-y-2 mt-2">
                      <Skeleton className="h-4 w-24 bg-[#656565]/10 rounded" />
                      <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-8 w-24 rounded-full bg-gray-100 border border-gray-200" />
                        <Skeleton className="h-8 w-20 rounded-full bg-gray-100 border border-gray-200" />
                        <Skeleton className="h-8 w-28 rounded-full bg-gray-100 border border-gray-200" />
                      </div>
                    </div>

                    {/* Fee and Button Row */}
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                      <Skeleton className="h-12 w-full md:w-40 rounded-full bg-[#F2E9F9]/50" />
                      <Skeleton className="h-12 w-full md:w-36 rounded-full bg-black/10" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularClassesSkeleton;
