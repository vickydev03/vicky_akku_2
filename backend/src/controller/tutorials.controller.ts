import { Context } from "elysia";
import { db } from "../../prisma/seed";
import { tryCatch } from "bullmq";
import { sucrose } from "elysia/sucrose";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "../config/r2";

type getAllContext = {
  query: {
    page: string;
    limit: string;
  };
};

type CreateContext = {
  body: {
    title: string;
    description: string;
    price: number;
    duration: number;
    thumbnail: string;
    videos: {
      videoKey: string;
      title: string;
      duration: number | undefined;
      size: number;
    }[];
  };
};

type UpdateContext = {
  body: {
    isPublished?: boolean;
    title?: string;
    description?: string;
    price?: number;
    duration?: number;
    thumbnail?: string;
    videos: {
      id?: string;
      videoKey?: string;
      title?: string;
      duration?: number;
      size?: number;
    }[];
  };
  params: {
    id: string;
  };
};

type RemoveAccessContext = {
  body: {
    userId: string;
    tutorialId: string;
  };
};
export class TutorialsController {

  static async getTutorials({ query }: getAllContext) {
    const {
      page = "1",
      limit = "10",
      //   location,
    } = query;
    // console.log(type);
    const pageSize = Math.min(Number(limit), 50);
    const where: any = {};
    const filters: any[] = [];
    const now = new Date();
    // console.log(location);

    if (filters.length > 0) {
      where.AND = filters;
    }

    const pageNumber = Number(page);

    console.log(where, 88);
    console.log(now);
    const [tutorials, totalCount] = await db.$transaction([
      // Query 1: Fetch the paginated data
      db.tutorials.findMany({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        where,
        orderBy: { createdAt: "asc" },
      }),

      db.tutorials.count({ where }),
    ]);

    //total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      tutorials,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNumber,
      },
    };
  }

  static async getTutorial({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const tutorial = await db.tutorials.findUnique({
      where: { id },
    });

    if (!tutorial) {
      set.status = 404;
      return { message: "tutorial not found" };
    }

    return tutorial;
  }

  static async playTutorial({ params, set, store, body }: Context) {
    // const {tutorialsId}=body
    const { id } = params;

    if (!store.user) {
      set.status = 401;
      return { message: "Unauthorized" };
    }

    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const tutorial = await db.tutorialAccess.findFirst({
      where: {
        tutorialId: id,
        userId: store.user.id,
      },

      include: {
        tutorial: {
          select: {
            title: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!tutorial) {
      set.status = 404;
      return { message: "You don't have access" };
    }

    const videos = await db.video.findMany({
      where: { tutorialId: id },
      orderBy: { order: "asc" },
    });

    // const data = await Promise.all(
    //   videos.map(async (e) => {
    //     const command = new GetObjectCommand({
    //       Bucket: "workshops",
    //       Key: e.videoKey,
    //     });

    //     const signedUrl = await getSignedUrl(r2, command, {
    //       expiresIn: 60 * 5,
    //     });

    //     return {
    //       id: e.id,
    //       videoUrl: signedUrl,
    //       title: e.title,
    //     };
    //   })
    // );

    return {
      videos,
      tutorial: {
        title: tutorial.tutorial.title,
        thumbnail: tutorial.tutorial.thumbnail,
      },
    };
  }

  static async getTutorialAdmin({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const tutorial = await db.tutorials.findUnique({
      where: { id },
      include: {
        video: true,
      },
    });

    if (!tutorial) {
      set.status = 404;
      return { message: "tutorial not found" };
    }

    return tutorial;
  }

  static async createTutorial({ body }: CreateContext) {
    try {
      const data = {
        title: body.title,
        description: body.description,
        price: body.price,
        duration: body.duration,
        thumbnail: body.thumbnail,
        videos: body.videos,
      };
      console.log(data);
      await db.$transaction(async (tx) => {
        // 1️⃣ Create tutorial first
        const tutorial = await tx.tutorials.create({
          data: {
            title: data.title,
            description: data.description,
            duration: data.duration,
            price: data.price,
            thumbnail: data.thumbnail,
          },
        });

        // 2️⃣ Create videos with tutorialId
        const videos = await tx.video.createMany({
          data: data.videos.map((video, i) => ({
            title: video.title,
            order: i + 1,
            videoKey: video.videoKey,
            size: video.size,
            duration: String(video.duration),
            tutorialId: tutorial.id,
          })),
        });

        return { tutorial, videos };
      });

      return {
        sucrose: true,
        message: "Tutorial Created Successfully",
      };
    } catch (err) {
      return {
        sucrose: false,
        message: "Something went wrong!",
      };
    }
  }

  static async updateTutorial({ body, params }: UpdateContext) {
    try {
      const { id } = params;

      const data = {
        title: body.title,
        description: body.description,
        price: body.price,
        duration: body.duration,
        thumbnail: body.thumbnail,
        videos: body.videos,
      };

      console.log("RAW params:", params);
      console.log("Tutorial id:", id, "| type:", typeof id);

      // Check what actually exists in DB
      const exists = await db.tutorials.findUnique({
        where: { id },
        select: { id: true, title: true },
      });
      console.log("Found in DB:", exists);

      const result = await db.$transaction(async (tx) => {
        // 1️⃣ Update tutorial
        const tutorial = await tx.tutorials.update({
          where: { id },
          data: {
            isPublished: body.isPublished,
            title: data.title,
            description: data.description,
            duration: data.duration,
            price: data.price,
            thumbnail: data.thumbnail,
          },
        });

        // 2️⃣ Get existing videos from DB
        const existingVideos = await tx.video.findMany({
          where: { tutorialId: tutorial.id },
          select: { id: true },
        });

        const existingIds = existingVideos.map((v) => v.id);

        // FIX: filter out undefined so existingIds.filter() works correctly
        const incomingIds = data.videos
          .map((v) => v.id)
          .filter((id): id is string => Boolean(id));

        // 3️⃣ DELETE removed videos
        const videosToDelete = existingIds.filter(
          (id) => !incomingIds.includes(id),
        );

        if (videosToDelete.length > 0) {
          await tx.video.deleteMany({
            where: { id: { in: videosToDelete } },
          });
        }

        // 4️⃣ UPSERT (update existing + create new)
        const videoOps = data.videos
          .map((video, i) => {
            // UPDATE existing video
            if (video.id) {
              return tx.video.update({
                where: { id: video.id },
                data: {
                  title: video.title,
                  order: i + 1,
                  videoKey: video.videoKey,
                  size: video.size,
                  duration: String(video.duration),
                },
              });
            }

            // CREATE new video — only if required fields are present
            if (video.title && video.videoKey && video.size) {
              return tx.video.create({
                data: {
                  title: video.title,
                  order: i + 1,
                  videoKey: video.videoKey,
                  size: video.size,
                  duration: String(video.duration),
                  tutorialId: tutorial.id,
                },
              });
            }

            // FIX: skip invalid entries instead of passing undefined to Promise.all
            return null;
          })
          .filter((op): op is NonNullable<typeof op> => op !== null);

        const videos = await Promise.all(videoOps);

        return { tutorial, videos };
      });

      return {
        success: true,
        message: "Tutorial Updated Successfully",
        data: result, // optionally expose result
      };
    } catch (err) {
      // FIX: log the real error so you can actually debug it
      console.error("[updateTutorial] Transaction failed:", err);

      return {
        success: false,
        message: "Something went wrong!",
      };
    }
  }

  static async RemoveAccess({ body }: RemoveAccessContext) {
   try {
  const removeAccess = await db.tutorialAccess.delete({
    where: {
      userId_tutorialId: {
        userId: body.userId,
        tutorialId: body.tutorialId,
      },
    },
  });

  return {
    success: true,
    message: "Access removed successfully",
    data: removeAccess,
  };

} catch (err: any) {
  // Prisma: Record not found
  if (err.code === "P2025") {
    return {
      success: false,
      message: "Access not found or already removed",
    };
  }

  // Unexpected error
  console.error("Error removing access:", err);

  return {
    success: false,
    message: "Something went wrong while removing access",
  };
}
  }

  static async deleteTutorial({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const tutorial = await db.tutorials.delete({
      where: { id },
    });

    if (!tutorial) {
      set.status = 404;
      return { message: "Tutorial not deleted" };
    }

    return tutorial;
  }
  
  static async getEnrollment({ query, set }: Context) {
  const {
    page = "1",
    limit = "10",
    startDate,
    endDate,
    productId
  } = query;

  const pageSize = Math.min(Number(limit), 50);
  const filters: any[] = [];
  const now = new Date();

  if (productId) {
    filters.push({
      tutorial: {
        id: productId
      }
    });
  }

  if (startDate) {
    filters.push({
      createdAt: { gte: new Date(startDate) },
    });
  }

  if (endDate) {
    filters.push({
      createdAt: { lte: new Date(endDate) },
    });
  }

  const where = filters.length > 0 ? { AND: filters } : {};

  const pageNumber = Number(page);

  const [enrollment, totalCount] = await db.$transaction([
    db.tutorialAccess.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where,
      include: {
        user: {
          select: {
            phone: true,
            name: true,
          },
        },
        tutorial: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),

    // ✅ FIXED
    db.tutorialAccess.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    enrollment,
    pagination: {
      totalCount,
      totalPages,
      currentPage: pageNumber,
    },
  };
}
}
