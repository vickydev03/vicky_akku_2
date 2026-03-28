import React from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link"; // Added missing import
import { format } from "date-fns";
import { CalendarX, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

function ProfileContainer() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.profile.queryOptions());

  const router = useRouter();
  if (!data) {
    router.push("/");
    return;
  }
  // Handle case where subscription might be empty to prevent crash
  const subscription = data.userSubscription?.[0];
  const activeCheck=new Date(subscription?.class.endDate) < new Date()

  const isActive = subscription
    ? activeCheck
    : !activeCheck;

  console.log(isActive,new Date(subscription?.class.endDate) < new Date(), "aj");
  return (
    <div className="pt-24 md:pt-32 pb-24 px-4 max-w-7xl mx-auto">
      <div className="bg-[#FFFBF4] py-6 rounded-[30px] lg:min-h-96 mb-12">
        <div className="w-full h-full flex flex-col lg:flex-row items-center gap-6 lg:gap-12 px-4 lg:px-12">
          {/* Avatar Section */}
          <div className="flex items-center justify-between w-full lg:w-fit p-3">
            <div className="bg-red-400 rounded-full size-28 sm:size-36 md:size-48 lg:size-72 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {data.name?.charAt(0) || "U"}
            </div>

            <div className="flex justify-center md:hidden items-center ml-4">
              <button
                className={`font-open-sauce px-5 py-1 ${
                  !isActive
                    ? "bg-[#F2E9F9] border-[#977DAE]"
                    : "bg-[#F7EDDD] border-[#A48E6A]"
                } rounded-full tracking-wider text-[#827B70] border-2 text-sm font-medium capitalize`}
              >
                {isActive ? "Rejoin" : "Active"}
              </button>
            </div>
          </div>

          {/* User Info Section */}
          <div className="w-full space-y-4 text-left">
            <h3 className="font-bold tracking-wider text-[#2A2A2A] font-open-sauce text-2xl sm:text-3xl capitalize">
              {data.name}
            </h3>

            <p className="capitalize text-[#656565] font-open-sauce text-sm sm:text-lg lg:text-xl font-medium tracking-wider">
              {data.phone}
            </p>

            {/* Class Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <p className="capitalize text-[#656565] font-open-sauce text-sm sm:text-lg lg:text-xl font-medium tracking-wider">
                {subscription?.class.title || "No Active Subscription"}
              </p>

              <button
                className={`font-open-sauce hidden md:block px-5 py-1 ${
                  !isActive
                    ? "bg-[#F2E9F9] border-[#977DAE]"
                    : "bg-[#F7EDDD] border-[#A48E6A]"
                } rounded-full tracking-wider text-[#827B70] border-2 text-sm lg:text-lg font-medium capitalize w-fit`}
              >
                {isActive ? "Rejoin" : "Active"}
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="bg-[#977DAE] text-white font-semibold flex items-center justify-center size-12 md:size-16 rounded-xl md:rounded-3xl text-sm md:text-lg">
                  {data.enrollments.length}
                </div>
                <div className="flex flex-col leading-tight text-xs md:text-base">
                  <p>Workshop</p>
                  <p>Booked</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#977DAE] text-white font-semibold flex items-center justify-center size-12 md:size-16 rounded-xl md:rounded-3xl text-sm md:text-lg">
                  {data.tutorialAccess.length}
                </div>
                <div className="flex flex-col leading-tight text-xs md:text-base">
                  <p>Purchased</p>
                  <p>Tutorials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <motion.h2
          className="font-passion-one text-3xl md:text-5xl text-[#DAA3B0] uppercase mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          My Booking
        </motion.h2>

        <Tabs defaultValue="workshops" className="w-full">
          <div className="flex  scroll-container max-w-full  overflow-scroll py-4 h-fit">
            <TabsList className="bg-transparent  h-auto p-0 mb-8   justify-start no-scrollbar">
              <div className="flex items-center gap-3 pb-2">
                <TabsTrigger
                  className="rounded-full border-2 border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-6 py-2 font-semibold text-[#656565] hover:text-[#656565] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary whitespace-nowrap"
                  value="workshops"
                >
                  Workshops
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full border-2 hover:text-[#656565] border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-6 py-2 font-semibold text-[#656565] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary whitespace-nowrap"
                  value="online tutorial"
                >
                  Online Tutorial
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full border-2 hover:text-[#656565] border-[#CFCFCF] tracking-wide bg-[#FFFBF4] px-6 py-2 font-semibold text-[#656565] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary whitespace-nowrap"
                  value="Regular Class"
                >
                  Regular Classes
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="workshops">
            {data.enrollments.length == 0 ? (
              <div className="rounded-[30px] h-64 bg-[#FFFBF4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <CalendarX className="w-10 h-10 text-gray-400" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      No purchased workshops yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Your purchased workshops will appear here.
                    </p>
                  </div>

                  <Link href="/workshops">
                    <Button className="rounded-full">Browse Workshops</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {data.enrollments.map((e, i) => {
                  const formattedDate = format(
                    new Date(e.workshop.eventDate),
                    "do MMM yyyy | h b",
                  ).toUpperCase();
                  return (
                    <div
                      key={i}
                      className="bg-[#FFFBF4] w-full flex flex-col md:flex-row gap-5 rounded-[30px] p-4 border border-black/5"
                    >
                      <div className="relative shrink-0">
                        <Image
                          alt={e.workshop.title}
                          className="w-full md:w-64 h-48 md:h-40 object-cover rounded-[25px]"
                          height={400}
                          width={400}
                          src={e.workshop.thumbnail}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-open-sauce font-bold text-[#656565] text-xl md:text-2xl">
                            {e.workshop.title}
                          </h3>
                          <div className="text-sm lg:text-base px-4 py-2 bg-[#F2E9F9] text-[#6B6B6B] rounded-full w-fit flex items-center gap-2">
                            <span className="font-normal">Date:</span>
                            <span className="font-bold">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#827B70] text-sm md:text-base">
                            <Image
                              src="/image/svg/address.svg"
                              alt="loc"
                              height={20}
                              width={20}
                            />
                            <span>{e.workshop.location.address}</span>
                          </div>
                        </div>
                        <div className="md:self-start">
                          <span className="bg-primary text-white px-8 py-2 rounded-full font-open-sauce font-semibold block text-center">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="online tutorial">
            {data.tutorialAccess.length == 0 ? (
              <div className="rounded-[30px] h-64 bg-[#FFFBF4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <CalendarX className="w-10 h-10 text-gray-400" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      No purchased workshops yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Your purchased tutorial's will appear here.
                    </p>
                  </div>

                  <Link href="/online-tutorials">
                    <Button className="rounded-full">Browse Tutorial's</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.tutorialAccess.map((e, i) => (
                  <Link
                    key={i}
                    href={`/online-tutorials/${e?.tutorialId}/video-play`}
                    className="block group"
                  >
                    <div className="bg-[#FFFBF4] rounded-[30px] p-4 h-full border border-black/5 group-hover:shadow-md transition-shadow">
                      <div className="relative mb-4">
                        <Image
                          alt={e?.tutorial.title}
                          className="w-full aspect-video object-cover rounded-[25px]"
                          height={300}
                          width={400}
                          src={e?.tutorial.thumbnail}
                        />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-open-sauce font-bold text-[#656565] text-lg md:text-xl line-clamp-2">
                          {e?.tutorial.title}
                        </h3>
                        <span className="bg-primary text-white px-6 py-1 rounded-full text-sm inline-block">
                          Play
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="Regular Class">
            {data.userSubscription.length == 0 ? (
              <div className="rounded-[30px] h-64 bg-[#FFFBF4] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <CalendarX className="w-10 h-10 text-gray-400" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">
                      No purchased classes yet
                    </p>
                    <p className="text-xs text-gray-400">
                      Your purchased classes will appear here.
                    </p>
                  </div>

                  <Link href="/regular-classes">
                    <Button className="rounded-full">
                      Browse Regular Classes
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {data.userSubscription.map((e, i) => {
                  const formattedDate = format(
                    new Date(e?.class.startDate),
                    "do MMM yyyy | h b",
                  ).toUpperCase();
                  return (
                    <div
                      key={i}
                      className="bg-[#FFFBF4] w-full flex flex-col md:flex-row gap-5 rounded-[30px] p-4 border border-black/5"
                    >
                      <div className="relative shrink-0">
                        <Image
                          alt={e?.class.title}
                          className="w-full md:w-64 h-48 md:h-40 object-cover rounded-[25px]"
                          height={400}
                          width={400}
                          src={e?.class.thumbnail}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
                        <div className="flex flex-col gap-3">
                          <h3 className="font-open-sauce font-bold text-[#656565] text-xl md:text-2xl">
                            {e?.class.title}
                          </h3>
                          <div className="text-sm lg:text-base px-4 py-2 bg-[#F2E9F9] text-[#6B6B6B] rounded-full w-fit flex items-center gap-2">
                            <span className="font-normal">Start Date:</span>
                            <span className="font-bold">{formattedDate}</span>
                          </div>
                        </div>
                        <div className="md:self-start">
                          <span className="bg-primary text-white px-8 py-2 rounded-full font-open-sauce font-semibold block text-center">
                            Paid
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfileContainer;
