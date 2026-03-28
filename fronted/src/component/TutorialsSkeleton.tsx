import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const TutorialsSkeleton = () => {
  return (
    <div className="relative bg-hero min-h-screen">
      {/* Navbar placeholder */}
      <div className="absolute z-53 w-full top-5">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-14 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="h-full py-28 overflow-hidden">
        <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">
          {/* Header Section */}
          <div className="space-y-4 md:space-y-6 w-full flex flex-col items-center">
            <Skeleton className="h-12 md:h-24 w-3/4 md:w-1/2 bg-[#977DAE]/20 rounded-lg" />
            <Skeleton className="h-6 md:h-8 w-2/3 md:w-1/3 bg-[#58555A]/10 rounded-md" />
          </div>

          {/* Tutorials Grid */}
          <div className="w-full h-full mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[30px] px-4 py-4 md:px-6 overflow-hidden">
                  <div className="flex flex-col gap-3">
                    {/* Thumbnail placeholder */}
                    <Skeleton className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 rounded-[30px] bg-gray-100" />
                    
                    {/* Title placeholder */}
                    <div className="w-full flex justify-center py-2">
                      <Skeleton className="h-8 md:h-10 w-3/4 bg-[#4B4740]/10 rounded-md" />
                    </div>

                    {/* Fee and Button placeholder */}
                    <div className="w-full flex flex-col md:flex-row items-center px-6 md:px-0 justify-center gap-3 mt-2">
                      <Skeleton className="h-10 w-full rounded-full bg-[#F2E9F9]/50" />
                      <Skeleton className="h-10 w-full md:w-28 rounded-full bg-black/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsSkeleton;
