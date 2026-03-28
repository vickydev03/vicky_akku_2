"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Users,
  CalendarDays,
  GraduationCap,
  Video,
  ChevronDown,
  FileVideo,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (section: string) => {
    setOpen(open === section ? null : section);
  };

  const submenuClass =
    "relative flex items-center gap-3 text-sm transition-all duration-300 hover:translate-x-1";

  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader className="pl-6 py-2  md:py-2 border-b">
        <h3 className="text-xl text-primary italic font-open-sauce">
          Vicky Akku Admin
        </h3>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-4 mt-6 space-y-2">
        {/* HOME */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 p-2 rounded-md transition ${
            pathname === "/dashboard"
              ? "bg-muted font-medium"
              : "hover:bg-muted"
          }`}
        >
          <LayoutDashboard size={18} />
          Home
        </Link>

        {/* USERS */}
        <Link
          href="/dashboard/users"
          className={`flex items-center gap-3 p-2 rounded-md transition ${
            pathname === "/users" ? "bg-muted font-medium" : "hover:bg-muted"
          }`}
        >
          <Users size={18} />
          Users
        </Link>

        {/* WORKSHOPS */}
        <Collapsible open={open === "workshops"}>
          <CollapsibleTrigger
            onClick={() => toggle("workshops")}
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition"
          >
            <div className="flex items-center gap-3">
              <CalendarDays size={18} />
              Workshops
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-500 ${
                open === "workshops" ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="relative transition-all duration-500 pl-10 pt-3 pb-2 space-y-3">
            {/* Vertical Line */}
            <div className="absolute left-[7%] bg-primary top-0 h-full w-px" />

            {[
              { name: "All Workshops", href: "/dashboard/workshops" },
              { name: "Students", href: "/dashboard/workshops/students" },
              { name: "Registrations", href: "/dashboard/workshops/registrations" },
              { name: "Create Location", href: "/dashboard/workshops/create-location"},
            ].map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${submenuClass} ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* REGULAR CLASSES */}
        <Collapsible open={open === "regular"}>
          <CollapsibleTrigger
            onClick={() => toggle("regular")}
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition"
          >
            <div className="flex items-center gap-3">
              <GraduationCap size={18} />
              Regular Classes
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                open === "regular" ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="relative pl-10 pt-3 pb-2 space-y-3">
            <div className="absolute left-[7%] bg-primary top-0 h-full w-px  " />

            {[
              { name: "All Classes", href: "/dashboard/regular-classes" },
              { name: "Subscribers", href: "/dashboard/regular-classes/subscribers" },
              { name: "Registrations", href: "/dashboard/regular-classes/registrations" },
              
            ].map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${submenuClass} ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* ONLINE TUTORIALS */}
        <Collapsible open={open === "tutorials"}>
          <CollapsibleTrigger
            onClick={() => toggle("tutorials")}
            className="flex items-center justify-between w-full p-2 rounded-md hover:bg-muted transition"
          >
            <div className="flex items-center gap-3">
              <Video size={18} />
              Online Tutorials
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                open === "tutorials" ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="relative pl-10 pt-3 pb-2 space-y-3">
            <div className="absolute left-[7%] bg-primary top-0 h-full w-px" />

            {[
              { name: "All Tutorials", href: "/dashboard/online-tutorials" },
              { name: "Enrollments", href: "/dashboard/online-tutorials/enrollments"},

{ name: "Create", href: "/dashboard/online-tutorials/create"},
            ].map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${submenuClass} ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        

      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t p-4 text-xs text-muted-foreground">
        © 2026 Vicky Akku
      </SidebarFooter>
    </Sidebar>
  );
}
