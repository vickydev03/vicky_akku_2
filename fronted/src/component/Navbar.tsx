"use client";
import { Button } from "@/components/ui/button";
import { useWorkshopFilters } from "@/modules/workshop/useWorkshop";
import { useTRPC } from "@/trpc/client";
import { getLocation } from "@/trpc/type";
import { useQuery } from "@tanstack/react-query";
import { Menu, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";


interface NavbarProps {
  isUserExist?: boolean;
  locations?: getLocation;
}

function Navbar({ isUserExist = false, locations }: NavbarProps) {
  const [filters, setFilters] = useWorkshopFilters();
  const pathName = usePathname();
  const trpc=useTRPC()
  const {data:user}=useQuery(trpc.user.profile.queryOptions())
  console.log(pathName, 7878);
  const items = [
    { label: "workshops", href: "/workshop" },
    { label: "Regular classes", href: "/regular-classes" },
    { label: "online tutorials", href: "/online-tutorials" },
    { label: "About us", href: "/about-us" },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="w-[90%] mx-auto relative ">
      <motion.div
        initial={{ y: "-200px", opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className=" relative z-50 bg-white/60 backdrop-blur-xl  border border-white/30
                 py-2 rounded-[60px]  nav-bar px-6
                 flex items-center justify-between transition-all duration-300"
      >
        {/* Logo */}
        <div className="logo">
          <h3 className="text-primary italic font-open-sauce cursor-pointer hover:scale-105 transition-transform duration-300">
            <Link href={"/"}>Vicky Akku</Link>
          </h3>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 md:gap-24">
          {items.map((e, i) => (
            <div
              key={i}
              className="relative font-open-sauce capitalize text-[#656565] text-sm cursor-pointer group"
            >
              <Link href={e.href} className="relative z-10">
                {e.label}
              </Link>
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary 
                             transition-all duration-300 group-hover:w-full"
              ></span>
            </div>
          ))}
        { user&&user.role==="ADMIN" &&  <div
              className="relative font-open-sauce capitalize text-[#656565] text-sm cursor-pointer group"
            >
              <Link href={"/dashboard"} className="relative z-10">
                Dashboard
              </Link>
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 bg-primary 
                             transition-all duration-300 group-hover:w-full"
              ></span>
            </div>}
          <div>
            {user ? (
              <Button
                className="bg-primary rounded-full cursor-pointer 
                               hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <Link href={"/profile"}>
       <User className="text-white size-5" />
               </Link>
              </Button>
            ) : (
              <Button
                className="rounded-full bg-primary cursor-pointer 
                               hover:scale-105 transition-transform duration-300 shadow-md"
              >
                <Link href={"/signin"}> Log in</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="block md:hidden">
          <Button
            onClick={() => setOpen((e) => !e)}
            className="cursor-pointer rounded-full hover:scale-105 transition-transform duration-300 shadow-md"
          >
            {open ? (
              <X className="size-4 text-white" />
            ) : (
              <Menu className="size-4 text-white" />
            )}
          </Button>
        </div>
      </motion.div>
      {
        <div className="absolute top-[calc(100%-30px)] w-full">
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeInOut",
                }}
                className=" w-full bg-[#E8EFF4] rounded-[30px] shadow-lg overflow-hidden"
              >
                <ul className="flex flex-col gap-2 max-w-[90%] mx-auto pt-[30px]">
                  {items.map((e, i) => (
                    <li
                      key={i}
                      className="py-2 text-sm capitalize border-b border-dashed border-[#82828299] last:border-none"
                    >
                      <Link href={e.href}>
                          {e.label}
                      </Link>
                    </li>
                  ))}
                   { !user ? <li
                      
                      className="py-2 text-sm capitalize border-b border-dashed border-[#82828299] last:border-none"
                    >
                      <Link href={"/signin"}>Sign in</Link>
                    </li> : <li
                     
                      className="py-2 text-sm capitalize border-b border-dashed border-[#82828299] last:border-none"
                    >
                      <Link href={"/dashboard"}>Dashboard</Link>
                    </li>}
                   {
                     user && <li
                     
                      className="py-2 text-sm capitalize border-b border-dashed border-[#82828299] last:border-none"
                    >
                      <Link href={"/profile"}>Profile</Link>
                    </li>
         }
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    </div>
  );
}

export default Navbar;
