import { Context, Elysia } from "elysia";
import { userRoutes } from "./routes/user.routes";
import { AppError } from "./lib/error";
import { serve } from "inngest/bun";
import { inngest } from "./lib/inngest";
import { functions } from "./inngest";
import { jwt } from "@elysiajs/jwt";
import { cors } from '@elysiajs/cors';
import cookie from "@elysiajs/cookie";
import { workshopRoutes } from "./routes/workshop.routes";
import { tutorialsRoutes } from "./routes/tutorials.routes";
import { regularClassesRoutes } from "./routes/regularClasses.routes";
import { uploadRoute } from "./routes/upload.routes";
import { dashboardRoutes } from "./routes/dashboard.routes";
import { orderRoutes } from "./routes/order.routes";

const handler = serve({
  client: inngest,
  functions,
});

const app = new Elysia().state('user', {
    id: '' as string,
    phone: '' as string
  })
// app.use("/api/inngest",handler);
const inngestHandler = app.all("/api/inngest", ({ request }) =>
  handler(request),
);


app.use(
  cors({
    origin: [process.env.FRONTED_URL!],
    credentials: true,
  })
)
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "7d",
    }),
  )
  .use(cookie())
  .use(inngestHandler)
  .onError((ctx) => {
    const { error, set, code } = ctx;

    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        code: error.constructor.name,
        message: error.message,
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid data provided",
        errors: (error as any)?.all,
      };
    }

    set.status = 500;

    return {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  })
  
  .group("/api/v1", (api) => api.use(userRoutes).use(workshopRoutes).use(tutorialsRoutes).use(regularClassesRoutes).use(uploadRoute).use(dashboardRoutes).use(orderRoutes))
  .listen(3000);

  
console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
