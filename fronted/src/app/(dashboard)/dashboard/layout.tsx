"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/dashboard/component/AppSidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <aside>
          <AppSidebar />
        </aside>
        <main className="w-full h-full">
          <div className=" py-2 md:py-2 border-b w-full">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default layout;
