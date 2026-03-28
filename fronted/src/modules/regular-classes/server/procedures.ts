import { loginSchema } from "@/schema/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";
import { userSchema } from "@/modules/signin/server/procedure";

const classTagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const regularClassSchema = z.object({
  id: z.string(),

  title: z.string(),

  description: z.string(),

  thumbnail: z.string(),

  City: z.string(),

  price: z.number().positive("Price must be greater than 0"),

  isActive: z.boolean(),

  perfectFor: z.array(classTagSchema),

  startDate: z.string(),

  endDate: z.string(),

  createdAt: z.string(),
});

const subscriptionSchema = z.object({
  id: z.string(),
  classId: z.string(),
  userId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  user: userSchema,
  class: z
    .object({
      endDate: z.string().optional(),
      title: z.string(),
    })
    .optional(),
});

export const regularClassSchemaAdmin = z.object({
  id: z.string(),

  title: z.string(),

  description: z.string(),

  thumbnail: z.string(),

  City: z.string(),

  price: z.number().positive("Price must be greater than 0"),

  isActive: z.boolean(),

  perfectFor: z.array(classTagSchema),

  startDate: z.string(),

  endDate: z.string(),

  createdAt: z.string(),
  subscriptions: z.array(subscriptionSchema),
  _count: z.object({
    subscriptions: z.number(),
  }),
});

const paginationSchema = z.object({
  currentPage: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const getClassesOutputSchema = z.object({
  pagination: paginationSchema,
  classes: z.array(regularClassSchema),
});

const subscriptionsSchema = z.object({
  pagination: paginationSchema,
  subscribers: z.array(subscriptionSchema),
});

// import { z } from "zod";

export const createClassSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(150),

  description: z.string().min(10, "Description is too short"),

  thumbnail: z.string().url("Thumbnail must be a valid URL"),

  City: z.string().min(2, "City is required"),

  price: z.number().min(0, "Price must be positive"),

  startDate: z.string(),

  endDate: z.string(),

  perfectFor: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .min(1, "Select at least one tag"),
});


export const classesRouter = createTRPCRouter({
  getAllClasses: baseProcedure
    .input(
      z.object({
        page: z.number().min(1, "page can't below 1"),
        limit: z.number().min(1, "limit can't below 1"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .output(getClassesOutputSchema)
    .query(async ({ input, ctx }) => {
      console.log(input, " to test");

      try {
        // const res = await axios.get(

        //   `${process.env.BASE_API}/v1/regular-classes?&page=${input.page}&limit=${input.limit}&startDate=${input.startDate}&endDate=${input.endDate}`,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     withCredentials: true,
        //   },
        // );
        const res = await axios.get(
          `${process.env.BASE_API}/v1/regular-classes`,
          {
            params: {
              page: input.page,
              limit: input.limit,
              startDate: input.startDate,
              endDate: input.endDate,
            },
            headers: {
              "Content-Type": "application/json",
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

  getClass: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(regularClassSchema)
    .query(async ({ ctx, input }) => {
      try {
        const res = await axios.get(
          `${process.env.BASE_API}/v1/regular-classes/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
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
  createregularClasses: protectedProcedure(["ADMIN"])
    .input(
      createClassSchema
    )
    .mutation(async ({ ctx, input }) => {
      try {
        
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.post(
          `${process.env.BASE_API}/v1/regular-classes/create`,
          {...input},
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
  updateregularClasses: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        id:z.string(),
        title: z.string().min(3, "Title must be at least 3 characters").max(150).optional(),
        description: z.string().min(10, "Description is too short").optional(),

          thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),

  City: z.string().min(2, "City is required").optional(),

  price: z.number().min(0, "Price must be positive").optional(),

  startDate: z.string().optional(),
  isActive:z.boolean().default(true).optional(),
  endDate: z.string().optional(),

  perfectFor: z
    .array(
      z.object({
        name: z.string(),
      }).optional(),
    )
    .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.patch(
          `${process.env.BASE_API}/v1/regular-classes/update/${input.id}`,
          {...input},
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
  
  getClassAdmin: protectedProcedure(["admin"])
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(regularClassSchemaAdmin)
    .query(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.get(
          `${process.env.BASE_API}/v1/regular-classes/getClassDetails/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
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
  getSubscribers: protectedProcedure(["admin"])
    .input(
      z.object({
        page: z.number().min(1, "page can't below 1"),
        limit: z.number().min(1, "limit can't below 1"),
        startDate: z.string(),
        endDate: z.string(),
        productId: z.string().optional(),

      }),
    )
    .output(subscriptionsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.get(
          `${process.env.BASE_API}/v1/regular-classes/getSubscribers/?productId=${input.productId}`,
          {
            params: {
              page: input.page,
              limit: input.limit,
              startDate: input.startDate || undefined,
              endDate: input.endDate || undefined,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
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

    classDetails: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        id: z.string().min(1, "id is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.delete(
          `${process.env.BASE_API}/v1/regular-classes/delete/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true,
          },
        );
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
