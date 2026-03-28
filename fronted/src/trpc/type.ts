import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./routers/_app";
import { getTraceEvents } from "next/dist/trace";

 type RouterOutput = inferRouterOutputs<AppRouter>;
type ArrayElement<T> = T extends (infer U)[] ? U : never;


export type getUser=RouterOutput["user"]["profile"]
export type getWorkshop=RouterOutput["workshop"]["upcomingWorkshop"]
export type getWorkshopType=RouterOutput["workshop"]["upcomingWorkshop"]["workshops"]
export type getWorkshopCard=RouterOutput["workshop"]["upcomingWorkshop"]["workshops"][number]
export type getLocation=RouterOutput["workshop"]["getAllLocation"]
export type getWorkshopId=RouterOutput["workshop"]["getWorkshop"]
export type getTutorials=RouterOutput["tutorials"]["getTutorials"]
export type getTutorial=RouterOutput["tutorials"]["getTutorial"]
export type getAccess=RouterOutput["tutorials"]["getStudents"]["enrollment"][0]
export type getClasses=RouterOutput["regularClasses"]["getAllClasses"]["classes"][number]
export type getUsers=RouterOutput["user"]["getAllUser"]["users"]
export type getStudent=RouterOutput["workshop"]["getStudents"]["students"][number]
export type getSubscribersType=RouterOutput["regularClasses"]["getSubscribers"]["subscribers"][number]




