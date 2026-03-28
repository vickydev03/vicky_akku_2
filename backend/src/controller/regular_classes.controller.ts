import { Context } from "elysia";
import { db } from "../../prisma/seed";
import { ConversationRelay } from "twilio/lib/twiml/VoiceResponse";

type getAllContext = {
  query: {
    page: string;
    limit: string;
    startDate:string;
    endDate:string;
    productId:string
  };
};

type CreateClassInput = {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  City: string;
  startDate: string;
  endDate: string;
  perfectFor: {
    name: string;
  }[];
};

type createContext = {
  body: CreateClassInput
};

type UpdateContext = {
  body: {
    title ?: string;
    description? : string;
  thumbnail ?: string;
  price?: number;
  City ?: string;
  isActive?:boolean;
  startDate ?: string;
  endDate ?: string;
  perfectFor ?: {
    name: string;
  }[];
  }
  params:{
    id:string
  }
};



export class RegularClassController {
  
static async getClasses({ query }: getAllContext) {
  const {
    page = "1",
    limit = "10",
    startDate,
    endDate,
  } = query;

  const pageSize = Math.min(Number(limit), 50);
  const pageNumber = Number(page);

  const filters: any[] = [];

  // ✅ Add filters first
  if (startDate) {
    filters.push({
      endDate: { gte: new Date(startDate) },
    });
  }

  if (endDate) {
    filters.push({
      endDate: { lte: new Date(endDate) },
    });
  }

  // ✅ Now build where
  const where: any = {};

  if (filters.length > 0) {
    where.AND = filters;
  }

  const [classes, totalCount] = await db.$transaction([
    db.regularClass.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where,
      include: {
        perfectFor: true,
      },
      orderBy: { createdAt: "asc" },
    }),

    db.regularClass.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    classes,
    pagination: {
      totalCount,
      totalPages,
      currentPage: pageNumber,
    },
  };
}

static async getSubscribers({ query }: getAllContext) {
  const {
    page = "1",
    limit = "10",
    startDate,
    endDate,
    productId
  } = query;

  const pageSize = Math.min(Number(limit), 50);
  const pageNumber = Number(page);

  const filters: any[] = [];

  if (productId) {
    filters.push({
      classId: productId
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

  console.log(filters,789456)
  const where = filters.length > 0 ? { AND: filters } : {};
  
  console.log(where,789456)
  const [subscribers, totalCount] = await db.$transaction([
    db.userSubscription.findMany({
      take: pageSize,
      skip: (pageNumber - 1) * pageSize,
      where,
      include: {
        user: true,
        class: {
          select: {
            title: true,
            endDate: true,
          }
        }
      },
      orderBy: { createdAt: "asc" },
    }),

    // ✅ FIXED
    db.userSubscription.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    subscribers,
    pagination: {
      totalCount,
      totalPages,
      currentPage: pageNumber,
    },
  };
}

static async getClass({ params, set }:Context) {
    const { id } = params

    // validate id if using Mongo
    if (!id) {
      set.status = 400
      return { message: "Invalid ID" }
    }

    const classes = await db.regularClass.findUnique({
      where: { id },
      include:{
        perfectFor:true
      }
    })

    if (!classes) {
      set.status = 404
      return { message: "tutorial not found" }
    }

    return classes
}

static async CreateClass({ body }: createContext) {

  const input = body;

  const newClass = await db.regularClass.create({
    data: {
      title: input.title,
      description: input.description,
      thumbnail: input.thumbnail,
      price: input.price,
      City: input.City,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      
      perfectFor: {
        connectOrCreate: input.perfectFor.map(tag => ({
          where: {
            name: tag.name
          },
          create: {
            name: tag.name
          }
        }))
      }
    },

    include: {
      perfectFor: true
    }
  });

  return newClass;
}

static async UpdateClass({ body,params }: UpdateContext) {

  const {id}=params
  console.log(id,"zzz")
  const input = body;

  await db.regularClass.update({
  where: { id: id},
  data: {
    title: input.title,
    description: input.description,
    thumbnail: input.thumbnail,
    price: input.price,
    City: input.City,
    isActive:input.isActive,
    ...(input.startDate&& {startDate:new Date(input.startDate)}),
    ...(input.endDate&& {startDate:new Date(input.endDate)}),

    perfectFor: {
      set: [], // remove all previous relations
      connectOrCreate: (input.perfectFor?? [] ).map((tag) => ({
        where: {
          name: tag.name,
        },
        create: {
          name: tag.name,
        },
      })),
    },
  },

  include: {
    perfectFor: true,
  },
});
  return {
    success:true,
    message:"Regular Class Updated Successfully"
  };
}
  
static async getClassAdmin({ params, set }:Context) {
    const { id } = params

    // validate id if using Mongo
    if (!id) {
      set.status = 400
      return { message: "Invalid ID" }
    }

    const classes = await db.regularClass.findUnique({
  where: { id },
  include: {
    perfectFor: true,
    subscriptions: {
      take: 5,
      
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        class:true
      },
    },
    _count: {
      select: {
        subscriptions: true,
      },
    },
  },
});
    if (!classes) {
      set.status = 404
      return { message: "tutorial not found" }
    }

    return classes
}

static async deleteClass({ params, set }: Context) {
    const { id } = params;

    // validate id if using Mongo
    if (!id) {
      set.status = 400;
      return { message: "Invalid ID" };
    }

    const regualrClass= await db.regularClass.delete({
      where: { id },
      
    });

    if (!regualrClass) {
      set.status = 404;
      return { message: "Workshop not deleted" };
    }

    return regualrClass;
}

}
