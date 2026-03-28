import { loginSchema } from "@/schema/schema";
import {
  baseProcedure,
  createTRPCRouter,
  getUserProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

export const orderRouter = createTRPCRouter({
    create:getUserProcedure.input(z.object({
        productId: z.string(),
      productType: z.enum(["WORKSHOP", "TUTORIAL", "CLASS"]),
    })).mutation(async({ctx,input})=>{
        try {
            const cookieStore = await cookies();
                    const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.post(
          `${process.env.BASE_API}/v1/order/create`,
          {
            ...input
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        console.log(error?.response as any, "a error occuried");
        if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || "Something went wrong";

    throw new Error(message); 
  }

  throw new Error("Unknown error");
      }
    }),
    verify:getUserProcedure.input(z.object({
        orderId: z.string(),
      razorpayOrderId: z.string(),
      razorpayPaymentId: z.string(),
      razorpaySignature: z.string(),

    })).mutation(async({ctx,input})=>{
        try {
            const cookieStore = await cookies();
                    const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.post(
          `${process.env.BASE_API}/v1/order/verify`,
          {
            ...input
          },
          {
            headers: {

                "Content-Type": "application/json",
                Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data);
        return res.data;
      } catch (error: any) {
        console.log(error?.response as any, "a error occuried");
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.log("Bad request:", error.response.data);
            return;
          }
        }

        throw error;
      }
    }),
});
