import { Skeleton } from "@/components/ui/skeleton";

export default function WorkshopViewSkeleton() {
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

          {/* ── Page Title ── */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-10 lg:h-20 w-[280px] lg:w-[520px] rounded-xl bg-[#C77F90]/20" />
          </div>

          {/* ── ContainerBox skeleton ── */}
          <div className="w-full h-full">
            <div className="rounded-2xl bg-[#FFFBF4] w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">

                {/* Left — Image */}
                <div className="flex w-full px-4 py-4 md:px-[2rem] md:py-[2rem] relative overflow-hidden">
                  <Skeleton className="w-full h-72 md:h-full md:max-h-128 rounded-3xl bg-[#e8ddd0]" />
                </div>

                {/* Right — Workshop Details */}
                <div className="w-full h-full">
                  <div className="py-3 flex items-center justify-center lg:py-7">
                    <div className="w-full h-full grid grid-cols-1 gap-2 m-auto space-y-3 px-4">

                      {/* Title + Location */}
                      <div className="flex flex-col items-center md:items-start gap-2">
                        <Skeleton className="h-9 w-[70%] rounded-lg bg-[#d5cec4]" />
                        <Skeleton className="h-9 w-[55%] rounded-lg bg-[#e0d8ce]" />
                      </div>

                      {/* Description lines */}
                      <div className="w-full space-y-2">
                        <Skeleton className="h-3.5 w-full rounded bg-[#ece4d9]" />
                        <Skeleton className="h-3.5 w-[95%] rounded bg-[#ece4d9]" />
                        <Skeleton className="h-3.5 w-full rounded bg-[#ece4d9]" />
                        <Skeleton className="h-3.5 w-[85%] rounded bg-[#ece4d9]" />
                        <Skeleton className="h-3.5 w-[60%] rounded bg-[#ece4d9]" />
                      </div>

                      {/* Date & Fees badges */}
                      <div className="flex flex-col justify-center md:justify-normal items-center md:flex-row gap-3">
                        <Skeleton className="h-10 w-[240px] md:w-[280px] rounded-sm bg-[#F2E9F9]" />
                        <Skeleton className="h-10 w-[160px] md:w-[200px] rounded-sm bg-[#F2E9F9]" />
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-10 md:size-14 rounded bg-[#e0d8ce]" />
                        <Skeleton className="h-4 md:h-5 w-[200px] md:w-[300px] rounded bg-[#ece4d9]" />
                      </div>

                      {/* Pay & Book button */}
                      <Skeleton className="h-10 md:h-12 w-[130px] md:w-[160px] rounded-full bg-[#977DAE]/25" />

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
