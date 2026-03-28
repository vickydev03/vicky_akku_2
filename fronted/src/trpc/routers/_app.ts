// import { userRouter } from "@/modules/user/server/procedures";
// import { TourRouter } from "@/modules/Tours/server/procedure";
import { userRouter } from "@/modules/signin/server/procedure";
import {  createTRPCRouter } from "../init";
import { workshopRouter } from "@/modules/workshop/procedures";
import { tutorialsRouter } from "@/modules/tutorials/server/procedures";
import { classesRouter } from "@/modules/regular-classes/server/procedures";
import { dashboardRouter } from "@/modules/dashboard/server/procedures";
import { orderRouter } from "@/modules/order/server/procedures";

export const appRouter = createTRPCRouter({

  user:userRouter,
  workshop:workshopRouter,
  tutorials:tutorialsRouter,
  regularClasses:classesRouter,
  dashboard:dashboardRouter,
  order:orderRouter
  
});

export type AppRouter = typeof appRouter;
