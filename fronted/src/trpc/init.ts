import { initTRPC, TRPCError } from "@trpc/server";
import { cookies, headers as getHeaders } from "next/headers";

// import { createServerClient } from "@supabase/ssr";
// import { cache } from "react";
import SuperJSON from "superjson";
// import { db } from "../../prisma/seed";
// import { createClient } from "@/lib/server";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";
import axios from "axios";
// import { createClient } from "@supabase/supabase-js";
// import { createClient } from "@/lib/server";
// import { getSupabaseServerClient} from "@/utils/supabase";
// import { adminAuth, db } from "../../firebase/server";
// import admin from "firebase-admin"
// import nookies from "nookies";
// import { Role } from "@/types";
export const createTRPCContext = async () => {};
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: SuperJSON,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
  return next({ ctx: {} });
});

export const getUserProcedure = baseProcedure.use(async ({ ctx, next }) => {
  try {
    const cookieStore = await cookies();

  const access_token = cookieStore.get("access_token")?.value;

   const res = await axios.get(
        `${process.env.BASE_API}/v1/user/profile`,
    { headers:{
      Authorization:`Bearer ${access_token}`
    } },
  );
  
  
  return next({
    ctx: {
      ...ctx,
      user:res.data.data
    },
  });

  
  } catch (error) {
    console.log(error)
    return next({
    ctx: {
      ...ctx,
      user:null
    },
  });
  }
});

export const protectedProcedure = (requiredPermissions: string[]) =>
  getUserProcedure.use(async ({ ctx, next }) => {
    console.log(ctx.user,"singhsingh")
    // const userEmail=ctx.user?.email
    // console.log(userEmail,"xxx")
    // const User=await ctx.db.user.findUnique({
    //   where:{
    //     email:userEmail
    //   }
    // })

    // console.log(User,"singhajay")

    // if (!User){
    //    throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
    // }

    // if (!requiredPermissions.includes(User.role)) {
    //   throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
    // }
    
    return next({ ctx });
  });
