import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const PaymentSkeleton = () => {
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
          {/* Main Heading */}
          <Skeleton className="h-12 md:h-24 w-3/4 md:w-1/2 bg-[#C77F90]/20 rounded-lg mb-8" />

          {/* ContainerPayment Mimic */}
          <div className="rounded-2xl bg-[#FFFBF4] w-full h-full min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Image Section (hidden on mobile, flex on lg) */}
              <div className="hidden lg:flex w-full px-4 py-4 md:px-[2rem] md:py-[2rem] relative overflow-hidden">
                <Skeleton className="object-cover h-full w-full rounded-3xl bg-gray-200" />
              </div>

              {/* Details Section */}
              <div className="w-full h-full py-4 px-6 lg:py-7 flex flex-col justify-center gap-6">
                <div className="space-y-4 flex flex-col items-center md:items-start">
                  {/* "Hi [user]" */}
                  <Skeleton className="h-10 md:h-14 w-48 bg-[#827B70]/10 rounded-md" />
                  {/* "Please proceed..." */}
                  <Skeleton className="h-6 w-56 bg-[#6B6B6B]/10 rounded-md" />
                </div>

                {/* Class Title Box */}
                <Skeleton className="h-14 w-full md:w-fit px-12 rounded-[10px] bg-[#F2E9F9]/50" />

                {/* Date and Fee Row */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Skeleton className="h-10 w-full md:w-64 rounded-sm bg-[#F2E9F9]/40" />
                  <Skeleton className="h-10 w-full md:w-40 rounded-sm bg-[#F2E9F9]/40" />
                </div>

                {/* Footer text and Button */}
                <div className="space-y-4 mt-2">
                   <div className="space-y-1">
                      <Skeleton className="h-4 w-48 bg-[#827B70]/10 rounded" />
                      <Skeleton className="h-4 w-64 bg-[#827B70]/10 rounded" />
                   </div>
                   <Skeleton className="h-12 w-full md:w-44 rounded-full bg-black/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSkeleton;
