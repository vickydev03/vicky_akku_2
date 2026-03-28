"use client"
import { useWorkshopFilters } from '@/modules/workshop/useWorkshop'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { DataTable } from '../component/DataTable'
import { Button } from '@/components/ui/button'
import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { workshopColumn } from '../component/WorkshopColumn'
import { useRouter } from 'next/navigation'

function DashBoardWorkshopView() {
    const trpc=useTRPC()
    const [filters,setFilters]=useWorkshopFilters()
    const {data}=useSuspenseQuery(trpc.workshop.upcomingWorkshop.queryOptions({...filters}))
    const totalPages=data.pagination.totalPages
    const router=useRouter()
    
    const handleRowClick=(strr:string)=>{
    }

    return (
        <div className="w-full h-full">
                  <div className="absolute left-[50%] bottom-0">
                    {filters.limit < data.pagination.totalCount && (
                    <div className="w-full mt-10">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious href="#" />
                          </PaginationItem>
        
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <PaginationItem key={i} className="">
                              <PaginationLink onClick={()=>setFilters({page:i+1})} className={`${filters.page ==i+1 && "bg-white/50"} cursor-pointer transition-all duration-300 ease-in-out`}>
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
              <div className="w-full px-5 lg:px-20 py-5 ">
        
                <div className="flex justify-between">
                  <div className="font-semibold text-lg md:text-3xl text-[#656565]">
                    Workshops
                  </div>
                  <div className="">
                    <Button className="bg-primary text-xs md:text-sm capitalize px-4 lg:py-2">
                    <Link href={"/dashboard/workshops/registrations"}>
Add Workshop
</Link>
                      
                    </Button>
                  </div>
                </div>
                  
                <div className="mt-12">
                  <DataTable
                    onRowClick={handleRowClick}
                    columns={workshopColumn}
                    data={data.workshops}
                    name="workshops"
                    onClick={() => {}}
                  />
                </div>
              </div>
        </div>
    )
}

export default DashBoardWorkshopView