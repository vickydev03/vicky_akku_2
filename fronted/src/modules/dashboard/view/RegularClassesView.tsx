"use client";
import { useRegularClassesFilters } from "@/modules/regular-classes/hooks/hook/useRegularClasses";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DatePickerWithRange } from "../component/DatePicker";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "../component/DataTable";
import { regularClassColumns } from "../component/RegularClassColumn";
import Link from "next/link";
function RegularClassesView() {
  const [filters, setFilters] = useRegularClassesFilters();

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.regularClasses.getAllClasses.queryOptions({ ...filters }),
  );

  const totalPages = data.pagination.totalPages;
  return (
    <div className="w-full h-full">
      <div className="w-full px-5 lg:px-20 py-5 ">
        <div className="flex justify-between">
          <div className="font-semibold text-lg md:text-3xl text-[#656565]">
            Regular Classes
          </div>
          <div className=" flex flex-col md:flex-row md:items-center gap-4">
            <DatePickerWithRange />
            <Button className="bg-primary text-xs md:text-sm capitalize px-4 lg:py-2">
              <Link href={"/dashboard/regular-classes/registrations"}>
                Add Regular Class
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <DataTable
            columns={regularClassColumns}
            data={data.classes}
            name="regularclass"
            onRowClick={() => {}}
            onClick={() => {}}
          />
        </div>

        <div className="absolute left-[50%]">
          {filters.limit < data.pagination.totalCount && (
            <div className="w-full mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i} className="">
                      <PaginationLink
                        onClick={() => setFilters({ page: i + 1 })}
                        className={`${filters.page == i + 1 && "bg-white/50"} cursor-pointer transition-all duration-300 ease-in-out`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegularClassesView;
