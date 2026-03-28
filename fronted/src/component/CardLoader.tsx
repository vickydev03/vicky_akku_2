import { Skeleton } from "@/components/ui/skeleton";

function WorkshopCardSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">

        {/* Image */}
        <Skeleton className="w-full h-56 md:h-64 rounded-3xl" />

        <div className="flex flex-col items-center md:items-start gap-3">

          {/* Title + Place */}
          <div className="space-y-2 flex flex-col items-center md:items-start">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Description */}
          <div className="space-y-2 max-w-84">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-52" />
          </div>

          {/* Date + Price */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Button */}
          <Skeleton className="h-10 w-24 rounded-full" />

        </div>
      </div>
    </div>
  );
}



function CardLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto w-full">
        <div className="">
        <WorkshopCardSkeleton/>
        </div>
        <div className="hidden lg:block">
        <WorkshopCardSkeleton/>
        </div>
        <div className="hidden lg:block">
        <WorkshopCardSkeleton/>
        </div>
    </div>
  )
}

export default CardLoader