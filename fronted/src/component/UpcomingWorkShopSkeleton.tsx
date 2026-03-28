import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingWorkShopSkeleton() {
  return (
    <div className="min-h-screen relative bg-hero">
      {/* Navbar placeholder */}
      <div className="absolute z-53 w-full top-5">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-14 w-full rounded-full bg-white/10" />
        </div>
      </div>

      <div className="h-full py-28 overflow-hidden">
        <div className="w-[85%] flex items-center gap-4 md:gap-12 flex-col mx-auto">

          {/* ── Page Title ── */}
          <div className="flex justify-center">
            <Skeleton className="h-10 lg:h-20 w-[300px] lg:w-[600px] rounded-xl bg-[#C77F90]/20" />
          </div>

          {/* ── Location Filter Cards ── */}
          <div className="flex items-center flex-nowrap justify-center gap-1 md:gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[#FFFBF4] min-w-24 min-h-18 md:w-35.5 md:h-28.5 relative"
                style={{ border: "3px solid #D2D2D2" }}
              >
                <div className="flex flex-col rounded-2xl w-full h-full items-center px-4 py-2">
                  <Skeleton className={`h-4 md:h-6 w-12 md:w-20 rounded-md ${item === 1 ? "bg-[#977DAE]/30" : "bg-[#e8ddd0]"}`} />
                  <Skeleton className="max-w-18 md:max-w-24 w-14 md:w-20 h-10 md:h-16 rounded-lg mt-1 bg-[#ece4d9]" />
                </div>
              </div>
            ))}
          </div>

          {/* ── Workshop Cards Section ── */}
          <div className="w-full h-full">
            <div className="rounded-2xl bg-[#FFFBF4] w-full h-full py-4">
              <div className="py-6 px-6 md:px-8 lg:px-12 flex flex-col gap-6">

                {/* Section subtitle */}
                <div className="flex justify-center">
                  <Skeleton className="h-6 md:h-10 w-[220px] md:w-[400px] rounded-lg bg-[#e8ddd0]" />
                </div>

                {/* Workshop card grid */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-full">
                      <div className="flex flex-col gap-4">

                        {/* Thumbnail */}
                        <Skeleton className="w-full h-56 md:h-64 rounded-3xl bg-[#e8ddd0]" />

                        {/* Card details */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                          {/* Title */}
                          <Skeleton className="h-8 w-[70%] rounded-lg bg-[#d5cec4]" />
                          {/* City */}
                          <Skeleton className="h-8 w-[50%] rounded-lg bg-[#e0d8ce]" />

                          {/* Description lines */}
                          <div className="max-w-84 w-full space-y-2">
                            <Skeleton className="h-3.5 w-full rounded bg-[#ece4d9]" />
                            <Skeleton className="h-3.5 w-[80%] rounded bg-[#ece4d9]" />
                          </div>

                          {/* Date & Price */}
                          <div className="flex w-full items-center gap-2">
                            <Skeleton className="h-5 w-[80px] rounded bg-[#e0d8ce]" />
                            <Skeleton className="h-5 w-[60px] rounded bg-[#e0d8ce]" />
                          </div>

                          {/* Book button */}
                          <Skeleton className="h-9 w-full md:w-20 rounded-full border border-[#656565]/30 bg-transparent" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
