import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <div className="bg-hero min-h-[150vh] relative w-full">
      <div className="w-full h-full relative">

        {/* Desktop hero image skeleton — right side, hidden on mobile */}
        <div className="absolute left-1/2 top-36 hidden md:block">
          <div className="relative z-20">
            <Skeleton className="w-[672px] h-[520px] rounded-3xl bg-white/10" />
          </div>
        </div>

        {/* Main content area */}
        <div className="absolute top-[120px] w-full">
          <div className="flex flex-col max-w-6xl mx-auto">

            {/* "VICKY AKKU" large title skeleton */}
            <div className="px-4 md:px-0">
              <div className="flex justify-center">
                <Skeleton className="h-[98px] md:h-[164px] w-[85%] md:w-[90%] rounded-2xl bg-white/15" />
              </div>
            </div>

            {/* "Dance classes" + subtitle + button area */}
            <div className="w-full">
              <div className="relative w-full md:w-fit md:absolute right-[0%] md:right-[45%]">

                {/* "Dance classes" subtitle skeleton */}
                <div className="flex justify-center md:justify-start mt-4">
                  <Skeleton className="h-[40px] md:h-[72px] w-[280px] md:w-[420px] rounded-xl bg-white/12" />
                </div>

                {/* Tagline + Button container */}
                <div className="max-w-42 mt-10 w-full absolute md:relative left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 space-y-4 flex items-center md:items-start justify-center flex-col">

                  {/* Tagline skeleton */}
                  <div className="space-y-2 flex flex-col items-center md:items-start">
                    <Skeleton className="h-5 md:h-7 w-[200px] md:w-[260px] rounded-lg bg-white/10" />
                    <Skeleton className="h-5 md:h-7 w-[160px] md:w-[200px] rounded-lg bg-white/10" />
                  </div>

                  {/* Button skeleton */}
                  <Skeleton className="h-12 w-[140px] rounded-full bg-white/20" />

                  {/* Mobile hero image skeleton — visible only on mobile */}
                  <div className="md:hidden mt-4">
                    <Skeleton className="size-90 max-w-90 rounded-3xl bg-white/10" />
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