import { Context } from "elysia";
import { db } from "../../prisma/seed";

type getAllContext = {
  query: {
    startDate: string;
    endDate: string;
    type: "upcoming" | "past" | "today";
    page: string;
    limit: string;
    location: string;
  };
};
type UpdateWorkshopContext = {
  body: {
    title?: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
    price?: string;
    eventDate?: string;
    locationId?: string;
    isActive?: boolean;
  };
  params: {
    id: string;
  };
};
type createContext = {
  body: {
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    price: string;
    eventDate: string;
    locationId: string;
  };
};

type LocationContext = {
  body: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    place: string;
  };
};


export class WorkshopController {
  static async getUpcomingWorkshop({ query }: getAllContext) {
    const {
      startDate,
      endDate,
      type,
      page = "1",
      limit = "10",
      location,
    } = query;
    console.log(type);
    const pageSize = Math.min(Number(limit), 50);
    const where: any = {};
    const filters: any[] = [];
    const now = new Date();
    console.log(location);
    if (location && location != "all") {
      console.log("working");
      filters.push({
        location: {
          is: {
            city: {
              equals: location,
              mode: "insensitive",
            },
          },
        },
      });
    }

    if (type === "upcoming") {
      filters.push({
        eventDate: {
          gt: now,
        },
      });
    }

    if (type === "past") {
      filters.push({
        eventDate: { lt: now },
      });
    }

    if (type === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      filters.push({
        eventDate: {
          gte: start,
          lte: end,
        },
      });
    }

    if (startDate) {
      filters.push({
        eventDate: { gte: new Date(startDate) },
      });
    }

    if (endDate) {
      filters.push({
        eventDate: { lte: new Date(endDate) },
      });
    }

    if (filters.length > 0) {
      where.AND = filters;
    }

    const pageNumber = Number(page);

    console.log(where, 88);
    console.log(now);
    const [workshops, totalCount] = await db.$transaction([
      // Query 1: Fetch the paginated data
      db.workshop.findMany({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        where,
        orderBy: { eventDate: "asc" },
        include: {
          location: true,
        },
      }),

      // Query 2: Fetch the total count of items matching the 'where' filter
      db.workshop.count({ where }),
    ]);

    //total pages
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      workshops,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNumber,
      },
    };
  }

  static async getWorkshop({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const workshop = await db.workshop.findUnique({
      where: { id },
      include: {
        location: true,
      },
    });

    if (!workshop) {
      set.status = 404;
      return { message: "Workshop not found" };
    }

    return workshop;
  }

  static async getLocation() {
    const datas = await db.location.findMany({
      select: {
        image: true,
      },
    });

    console.log(datas);
    const data = await db.location.findMany({});
    console.log(data, 789);
    return data;
  }

  static async getWorkshopAdmin({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const workshop = await db.workshop.findUnique({
      where: { id },
      include: {
        location: true,
        enrollment: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!workshop) {
      set.status = 404;
      return { message: "Workshop not found" };
    }

    return workshop;
  }

  static async deleteWorkshop({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const workshop = await db.workshop.delete({
      where: { id },
    });

    if (!workshop) {
      set.status = 404;
      return { message: "Workshop not deleted" };
    }

    return workshop;
  }

  static async getStudents({ query }: Context) {
    const { startDate, endDate, page = "1", limit = "10",productId } = query;
    const pageSize = Math.min(Number(limit), 50);
    const where: any = {};
    const filters: any[] = [];
    const now = new Date();

    // console.log(location);

    if (productId){
      filters.push({
        workshopId:productId
      })
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

    if (filters.length > 0) {
      where.AND = filters;
    }

    const pageNumber = Number(page);

    console.log(where, 88);
    console.log(now);
    const [students, totalCount] = await db.$transaction([
      // Query 1: Fetch the paginated data
      db.enrollment.findMany({
        take: pageSize,
        skip: (pageNumber - 1) * pageSize,
        where,
        orderBy: { createdAt: "asc" },
        include: {
          user: true,
        },
      }),

      db.enrollment.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      students,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNumber,
      },
    };
  }

  static async createWorkshop({ body }: createContext) {
    try {
      const workshop = await db.workshop.create({
        data: {
          title: body.title,
          slug: body.slug,
          description: body.description,
          thumbnail: body.thumbnail,
          price: Number(body.price),
          eventDate: new Date(body.eventDate),
          locationId: body.locationId,
        },
      });

      return {
        success: true,
        data: workshop,
        message: "Workshop created.",
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error,
      };
    }
  }

  static async updateWorkshop({ body, params }: UpdateWorkshopContext) {
    try {
      const { id } = params;

      const workshop = await db.workshop.update({
        where: { id },
        data: {
          
          title: body.title,
          slug: body.slug,
          description: body.description,
          thumbnail: body.thumbnail,
          price: body.price ? Number(body.price) : undefined,
          eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
          locationId: body.locationId,
          isActive: body.isActive,
        },
      });

      return {
        success: true,
        data: workshop,
        message: "Workshop updated.",
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "Failed to update workshop.",
      };
    }
  }
  
  static async createLocation({ body }: LocationContext) {
    try {

      const location = await db.location.create({
        data: {
          ...body
        },
      });

      return {
        success: true,
        data: location,
        message: "Location Created.",
      };

    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "Failed to update Location's.",
      };
    }
  }

  
}
