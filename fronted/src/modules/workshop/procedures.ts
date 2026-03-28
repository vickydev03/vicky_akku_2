import { loginSchema } from "@/schema/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { string, z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";
import { regularClassSchema } from "../regular-classes/server/procedures";

 export  const LocationSchema = z.object({
  id: z.string(),
  place: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  image:z.string(),
  country: z.string(),
  pincode: z.string().nullable(),
  createdAt: z.coerce.date(),
});


const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  place:z.string().nullable(),
  state: z.string(),
  image:z.string(),
  country: z.string(),
  pincode: z.string().nullable(),
  createdAt: z.string(),
});
const LocationListSchema = z.array(LocationSchema);
export const roleEnum = z.enum(["STUDENT", "ADMIN"]);

const userSchema=z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    role: roleEnum,
    avatar: z.string().url().optional().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    lastLoginAt: z.string(),
  })
  
export const enrollmentSchema=z.object({
  id:z.string(),
  userId:z.string(),
  workshopId:z.string(),
  createdAt:z.string(),
  user:userSchema
})


export const workshopSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  slug: z.string(),
  thumbnail: z.string(),
  eventDate: z.string(),
  createdAt: z.string(),
  locationId: z.string(),
  location: locationSchema.optional().nullable(),
  enrollment:z.array(enrollmentSchema).optional().nullable()
});

const paginationSchema = z.object({
  currentPage: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const getWorkshopsOutputSchema = z.object({
  pagination: paginationSchema,
  workshops: z.array(workshopSchema),
});

const studentsSchema=z.array(
  z.object({
    id:z.string(),
    workshopId:z.string(),
    userId:z.string(),
    createdAt:z.string(),
    user:userSchema
  })
)


const getStudentSchema=z.object({
  pagination: paginationSchema,
  students:studentsSchema
})

export const workshopRouter = createTRPCRouter({
  upcomingWorkshop: baseProcedure
    .input(
      z.object({
        page: z.number().min(1, "page can't below 1"),
        limit: z.number().min(1, "limit can't below 1"),
        location: z.string(),
        type:z.string().default("upcoming"),
      }),
    )
    .output(getWorkshopsOutputSchema)
    .query(async ({ input, ctx }) => {
      console.log(input, "from ajay to test");
      try {
        // new Promise((resolve) => setTimeout(resolve, 12000));
        const res = await axios.get(
          `${process.env.BASE_API}/v1/workshop?type=${input.type}&page=${input.page}&limit=${input.limit}&location=${input.location}`,
          {
            headers: {
              "Content-Type": "application/json",
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
  getAllLocation: baseProcedure
    .output(LocationListSchema)
    .query(async ({ ctx }) => {
      try {
        const res = await axios.get(
          `${process.env.BASE_API}/v1/workshop/location`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"hii")
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

  getWorkshop: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(workshopSchema)
    .query(async ({ ctx, input }) => {
      try {
        const res = await axios.get(
          `${process.env.BASE_API}/v1/workshop/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"finaltest")
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
  createWorkshop: baseProcedure
    .input(
      z.object({
      title:       z.string().min(3, "At least 3 characters"),
      slug:        z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase + hyphens only"),
      description: z.string().min(20, "Write at least 20 characters"),
      thumbnail:   z.string().min(1, "Thumbnail required"),
      price:       z.string(),
      eventDate:   z.date(),
      locationId:  z.string().min(1, "Select a location"),
      }),
    )
    .output(
      z.object({
        message:z.string(),
        data:workshopSchema,
        success:z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
          const cookieStore = await cookies();
          const access_token = await cookieStore.get("access_token")?.value;
          
        const res = await axios.post(
          `${process.env.BASE_API}/v1/workshop/create`,
          {...input},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"finaltest")
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
  updateWorkshop: baseProcedure
    .input(
    z.object({
    id: z.string(),

    title: z.string().min(3).optional(),
    isActive:z.boolean().optional(),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase + hyphens only")
      .optional(),

    description: z.string().min(20).optional(),

    thumbnail: z.string().min(1).optional(),

    price: z.string().optional(),

    eventDate: z.date().optional(),

    locationId: z.string().min(1).optional(),
  })
)
    
    .mutation(async ({ ctx, input }) => {
      try {
          const cookieStore = await cookies();
          const access_token = await cookieStore.get("access_token")?.value;
          
        const res = await axios.patch(
          `${process.env.BASE_API}/v1/workshop/update/${input.id}`,
          {...input},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"finaltest")
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
    
  getWorkshopAdmin: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(workshopSchema)
    .query(async ({ ctx, input }) => {
      try {
        
          const cookieStore = await cookies();
          const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.get(
          `${process.env.BASE_API}/v1/workshop/getWorkshop/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"testtesttest")
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
  workshopDelete: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        
          const cookieStore = await cookies();
          const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.delete(
          `${process.env.BASE_API}/v1/workshop/delete/${input.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );
        console.log(res.data,"testtesttest")
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
  CreateLocation: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    pincode: z.string().optional(),
    place: z.string().optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        
          const cookieStore = await cookies();
          const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.post(
          `${process.env.BASE_API}/v1/workshop/location/create`,
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
        console.log(res.data,"testtesttest")
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
  getStudents: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        page: z.number(),
        limit:z.number(),
        productId:z.string().optional()
      }),
    )
    .output(getStudentSchema)
    .query(async ({ ctx, input }) => {
      try {
        
                const cookieStore = await cookies();
                const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.get(
          `${process.env.BASE_API}/v1/workshop/getStudents?page=${input.page}&limit=${input.limit}&productId=${input.productId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:`Bearer ${access_token}`
            },
            withCredentials: true,
          },
        );

        console.log(res.data,"testtesttest")
        
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
