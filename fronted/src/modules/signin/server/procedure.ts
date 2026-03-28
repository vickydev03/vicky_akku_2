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
import { workshopSchema } from "@/modules/workshop/procedures";
import { UserSchema } from "@/utils/schema";

export const roleEnum = z.enum(["STUDENT", "ADMIN"]);

export const normalUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  
  phone: z.string().min(10, "Phone must be at least 10 digits"),

  role: roleEnum.default("STUDENT"),

  avatar: z.string().url().optional().nullable(),

  createdAt: z.string(),

  updatedAt: z.string(),

  lastLoginAt: z.string(),
});

export const enrollmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workshopId: z.string(),
  createdAt: z.string(),
  user: normalUser.optional().nullable(),
  workshop: workshopSchema.optional().nullable(),
});

export const userSchema = z.object({
  id: z.string(),

  name: z.string().min(1, "Name is required"),

  email: z.string(),

  phone: z.string().min(10, "Phone must be at least 10 digits"),

  role: roleEnum.default("STUDENT"),

  avatar: z.string().url().optional().nullable(),

  createdAt: z.string(),

  updatedAt: z.string(),

  lastLoginAt: z.string(),

  // Relations (usually optional in validation layer)
  // orders: z.array(z.any()).optional(),
  // enrollments: z.array(enrollmentSchema).optional(),
  // userSubscription: z.array(z.any()).optional(),
  // tutorialAccess: z.array(z.any()).optional(),
});

export const userSchemaForAdmin = z.object({
  id: z.string(),

  name: z.string().min(1, "Name is required"),

  email: z.string(),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  role: roleEnum.default("STUDENT"),
  avatar: z.string().url().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string(),
  orders: z.array(z.any()).optional(),
  enrollments: z.array(enrollmentSchema).optional(),
  userSubscription: z.array(z.any()).optional(),
  tutorialAccess: z.array(z.any()).optional(),
});

const paginationSchema = z.object({
  currentPage: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const UsersSchema = z.array(userSchema);
const getUsersOutputSchema = z.object({
  pagination: paginationSchema,
  users: UsersSchema,
});

export const userRouter = createTRPCRouter({
  requestOtp: baseProcedure
    .input(loginSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await axios.post(
          `${process.env.BASE_API}/v1/user/req-otp`,
          { ...input },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            console.log("Bad request:", error.response.data);
            return;
          }
        }

        throw error;
      }
    }),
  verifyOtp: baseProcedure
    .input(
      z.object({
        phone: z.string().min(6, "Phone number is required"),
        otp: z
          .string()
          .length(6, "OTP must be exactly 6 digits")
          .regex(/^\d+$/, "Only numbers allowed"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await axios.post(
          `${process.env.BASE_API}/v1/user/verify-otp`,
          { ...input },

          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        const cookieStore = await cookies();
        cookieStore.set("access_token", res.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
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

  profile: getUserProcedure.output(UserSchema).query(async ({ ctx, input }) => {
    try {
      
      return ctx.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          console.log("Bad request:", error.response.data);
          return;
        }
      }
    }
  }),
  
  getAllUser: protectedProcedure(["ADMIN"])
    .output(getUsersOutputSchema)
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        console.log(access_token, "check");
        const res = await axios.get(
          `${process.env.BASE_API}/v1/user/getAllUsers?page=${input.page}&limit=${input.limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true,
          },
        );
        console.log(res.data, "test-ui-test");
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


  getUser: protectedProcedure(["ADMIN"])
    .output(userSchemaForAdmin)
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.get(
          `${process.env.BASE_API}/v1/user/getUser/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true,
          },
        );
        console.log(res.data, "leah");
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

    adminLogin:baseProcedure
    .input(
      z.object({
        phone: z.string(),
        password:z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // const cookieStore = await cookies();
        // const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.post(
          `${process.env.BASE_API}/v1/user/adminlogin/`,
          {
            ...input
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },

        );
        console.log(res.data, "leah");

        const cookieStore = await cookies();
        cookieStore.set("access_token", res.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        console.log(res.data);
        return res.data;
      } catch (error: any) {
  console.log(error?.response, "a error occurred");

  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || "Something went wrong";

    throw new Error(message); // ✅ THROW
  }

  throw new Error("Unknown error");
}
    }),
    createUser:protectedProcedure(["ADMIN"])
    .input(
      z.object({
        phone: z.string(),
        password:z.string(),
        name:z.string(),
        email:z.string().optional(),
        role:z.string()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.post(
          `${process.env.BASE_API}/v1/user/createUser/`,
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
        console.log(res.data, "leah");

       
        return res.data;
      } catch (error: any) {
  console.log(error?.response, "a error occurred");

  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || "Something went wrong";

    throw new Error(message); // ✅ THROW
  }

  throw new Error("Unknown error");
}
    }),
});
