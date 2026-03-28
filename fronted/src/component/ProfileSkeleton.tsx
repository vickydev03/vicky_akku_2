import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="h-full min-h-screen bg-hero relative">
      {/* Navbar placeholder */}
      <div className="absolute z-53 w-full top-5">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-14 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="md:w-[90%] rounded-2xl mx-auto">
        <div className="pt-24 md:pt-32 pb-24 px-4 max-w-7xl mx-auto">

          {/* ── Profile Card ── */}
          <div className="bg-[#FFFBF4] py-6 rounded-[30px] lg:min-h-96 mb-12">
            <div className="w-full h-full flex flex-col lg:flex-row items-center gap-6 lg:gap-12 px-4 lg:px-12">

              {/* Avatar Section */}
              <div className="flex items-center justify-between w-full lg:w-fit p-3">
                <Skeleton className="rounded-full size-28 sm:size-36 md:size-48 lg:size-72 shrink-0 bg-[#e8ddd0]" />

                {/* Mobile status badge */}
                <div className="flex justify-center md:hidden items-center ml-4">
                  <Skeleton className="h-8 w-20 rounded-full bg-[#F2E9F9]" />
                </div>
              </div>

              {/* User Info Section */}
              <div className="w-full space-y-4 text-left">
                {/* Name */}
                <Skeleton className="h-8 sm:h-10 w-[200px] sm:w-[260px] rounded-lg bg-[#e8ddd0]" />

                {/* Phone */}
                <Skeleton className="h-5 sm:h-6 w-[160px] sm:w-[200px] rounded-md bg-[#ece4d9]" />

                {/* Class Info + Desktop badge */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <Skeleton className="h-5 sm:h-6 w-[220px] sm:w-[280px] rounded-md bg-[#ece4d9]" />
                  <Skeleton className="hidden md:block h-8 w-24 rounded-full bg-[#F2E9F9]" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-2">
                  {/* Workshop Booked stat */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 md:size-16 rounded-xl md:rounded-3xl bg-[#977DAE]/30" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3 md:h-4 w-16 rounded bg-[#ece4d9]" />
                      <Skeleton className="h-3 md:h-4 w-12 rounded bg-[#ece4d9]" />
                    </div>
                  </div>

                  {/* Purchased Tutorials stat */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 md:size-16 rounded-xl md:rounded-3xl bg-[#977DAE]/30" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3 md:h-4 w-16 rounded bg-[#ece4d9]" />
                      <Skeleton className="h-3 md:h-4 w-14 rounded bg-[#ece4d9]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── My Booking Section ── */}
          <div className="w-full">
            {/* Section title */}
            <Skeleton className="h-8 md:h-12 w-[200px] md:w-[280px] rounded-lg mb-6 bg-[#DAA3B0]/30" />

            {/* Tab pills */}
            <div className="flex items-center gap-3 mb-8 py-4 overflow-hidden">
              <Skeleton className="h-10 w-[110px] rounded-full bg-[#977DAE]/25" />
              <Skeleton className="h-10 w-[140px] rounded-full border-2 border-[#CFCFCF]/40 bg-[#FFFBF4]" />
              <Skeleton className="h-10 w-[140px] rounded-full border-2 border-[#CFCFCF]/40 bg-[#FFFBF4]" />
            </div>

            {/* Booking cards — 2 placeholder cards */}
            <div className="grid grid-cols-1 gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="bg-[#FFFBF4] w-full flex flex-col md:flex-row gap-5 rounded-[30px] p-4 border border-black/5"
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0">
                    <Skeleton className="w-full md:w-64 h-48 md:h-40 rounded-[25px] bg-[#e8ddd0]" />
                  </div>

                  {/* Card details */}
                  <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
                    <div className="flex flex-col gap-3">
                      {/* Title */}
                      <Skeleton className="h-6 md:h-7 w-[220px] md:w-[300px] rounded-lg bg-[#ece4d9]" />

                      {/* Date badge */}
                      <Skeleton className="h-9 w-[240px] rounded-full bg-[#F2E9F9]" />

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-5 rounded bg-[#ece4d9]" />
                        <Skeleton className="h-4 w-[180px] rounded bg-[#ece4d9]" />
                      </div>
                    </div>

                    {/* Paid badge */}
                    <div className="md:self-start">
                      <Skeleton className="h-9 w-24 rounded-full bg-[#977DAE]/25" />
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
}
