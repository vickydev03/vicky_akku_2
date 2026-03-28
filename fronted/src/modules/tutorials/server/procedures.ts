import { loginSchema } from "@/schema/schema";
import {
  baseProcedure,
  createTRPCRouter,
  getUserProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
// import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const tutorialsSchema = z.object({
  id: z.string(),
  title: z.string(),
  isPublished:z.boolean(),
  description: z.string(),
  price: z.number(),
  thumbnail: z.string(),
  createdAt: z.string(),
});

const paginationSchema = z.object({
  currentPage: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const gettutorialsOutputSchema = z.object({
  pagination: paginationSchema,
  tutorials: z.array(tutorialsSchema),
});

export const TutorialVideoSchema = z.object({
  id: z.string().uuid(),
  tutorialId: z.string().uuid(),
  title: z.string(),
  videoKey: z.string(),
  size: z.number(),
  order: z.number().int(),
  createdAt: z.string().datetime(),
});

export type TutorialVideo = z.infer<typeof TutorialVideoSchema>;

// ─── Tutorial ─────────────────────────────────────────────────────────────────

export const TutorialSchemaAdmin = z.object({
  id: z.string().uuid(),
  isPublished: z.boolean(),
  createdAt: z.string().datetime(),
  title: z.string(),
  duration: z.number(),
  thumbnail: z.string().url(),
  price: z.number(),
  description: z.string(),
  video: z.array(TutorialVideoSchema),
});


import { z } from "zod";

export const getEnrollmentSchema = z.object({
  enrollment: z.array(
    z.object({
      id: z.string(),

      createdAt: z.string().datetime(),

      userId: z.string(),
      tutorialId: z.string(),

      user: z.object({
        phone: z.string(),
        name: z.string(),
      }),

      tutorial: z.object({
        title: z.string(),
      }),
    })
  ),

  pagination: z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});
export const tutorialsRouter = createTRPCRouter({

  getTutorials: baseProcedure
    .input(
      z.object({
        page: z.number().min(1, "page can't below 1"),
        limit: z.number().min(1, "limit can't below 1"),
      }),
    )
    .output(gettutorialsOutputSchema)
    .query(async ({ input, ctx }) => {
      try {
        const res = await axios.get(
          `${process.env.BASE_API}/v1/tutorials?page=${input.page}&limit=${input.limit}`,
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
  createTutorials: baseProcedure
    .input(
      z.object({
        title: z.string().min(1, "page can't below 1"),
        description: z.string().min(1, "limit can't below 1"),
        price: z.number().optional(),
        duration: z.number().optional(),
        thumbnail: z.string().min(1, "thumbnail is required"),
        videos: z.array(
          z.object({
            videoKey: z.string(),
            title: z.string(),
            duration:z.number().optional(),
            size:z.number().optional()

          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        
        const res = await axios.post(
          `${process.env.BASE_API}/v1/tutorials/create`,
          { ...input },
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
  updateTutorial: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, "page can't below 1"),
        title: z.string().min(1, "page can't below 1").optional(),
        isPublished:z.boolean().optional(),
        description: z.string().min(1, "limit can't below 1").optional(),
        price: z.number().optional(),
        duration: z.number().optional(),
        thumbnail: z.string().min(1, "thumbnail is required").optional(),
        videos: z.array(
          z.object({
            videoKey: z.string().optional(),
            title: z.string().optional(),
            duration:z.number().optional(),
            size:z.number().optional()

          }),
        ).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {

      console.log(input,"checking inputs")
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        
        const res = await axios.patch(
          `${process.env.BASE_API}/v1/tutorials/update/${input.id}`,
          { ...input },
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
  getTutorialAdmin: protectedProcedure(["ADMIN"])
    .output(TutorialSchemaAdmin)
    .input(
      z.object({
        id: z.string().min(1, "page can't below 1"),
      }),
    ).query(async ({ input, ctx }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;

        const res = await axios.get(
          `${process.env.BASE_API}/v1/tutorials/get/${input.id}`,
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
  tutorialDelete: protectedProcedure(["ADMIN"])
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
          `${process.env.BASE_API}/v1/tutorials/delete/${input.id}`,
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
  getTutorial: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .output(tutorialsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const res = await axios.get(
          `${process.env.BASE_API}/v1/tutorials/${input.id}`,
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
  playVideos: getUserProcedure
    .input(
      z.object({
        tutorialId: z.string(),
        userId:z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const cookieStore = await cookies();
        const access_token = await cookieStore.get("access_token")?.value;
        
        const res = await axios.get(
          `${process.env.BASE_API}/v1/tutorials/${input.tutorialId}/play-video`,
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

  getSignedUrl: baseProcedure
    .input(
      z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
        }),
      ),
    )
    .output(
      z.object({
        files: z.array(
          z.object({
            uploadUrl: z.string(),
            key: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log(input, "AKKU");
        const res = await axios.post(
          `${process.env.BASE_API}/v1/upload/presigned-url/`,
          {
            files: input,
          },
          {
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

  getVideos: baseProcedure
    .output(
      z.object({
        videos: z.array(
          z.object({
            key: z.string(),
            size: z.number(),
            lastModified: z.string(),
          }),
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        console.log(input, "AKKU");
        const res = await axios.get(
          `${process.env.BASE_API}/v1/upload/getVideos/`,

          {
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


    getStudents: protectedProcedure(["ADMIN"])
    .input(
      z.object({
        page: z.number(),
        limit:z.number(),
        productId:z.string().optional()
        
      }),
    )
    .output(getEnrollmentSchema)
    .query(async ({ ctx, input }) => {
      try {
        
                const cookieStore = await cookies();
                const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.get(
          `${process.env.BASE_API}/v1/tutorials/getEnrollment?page=${input.page}&limit=${input.limit}&productId=${input.productId}`,
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

    removeAccess:protectedProcedure(["ADMIN"]).input(z.object({
      userId:z.string(),
      tutorialId:z.string()
    })).mutation(async({ctx,input})=>{

      try {
        
                const cookieStore = await cookies();
                const access_token = await cookieStore.get("access_token")?.value;
        const res = await axios.post(
          `${process.env.BASE_API}/v1/tutorials/remove-access`,
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
    })

});
