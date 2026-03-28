import { Elysia, t } from "elysia";
import { UserController } from "../controller/user.controller";
import { allowRoles, authMiddleware } from "../middleware/auth";
import { WorkshopController } from "../controller/workshop.controller";
// import { jwt } from "@elysiajs/jwt";

export const workshopRoutes = new Elysia({ prefix: "/workshop" }).get(
  "/",
  WorkshopController.getUpcomingWorkshop,
  {
    query: t.Object({
      startDate: t.Optional(t.String()),
      endDate: t.Optional(t.String()),
      type: t.Optional(t.String()),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      location:t.Optional(t.String())
    }),
  },
  
).get("/location",WorkshopController.getLocation).get("/:id",WorkshopController.getWorkshop).
get("/getWorkshop/:id",WorkshopController.getWorkshopAdmin,{
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).get("/getStudents",WorkshopController.getStudents,{
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])],
}).post("/create",WorkshopController.createWorkshop,{
  body: t.Object({
  title: t.String(),
  slug: t.String(),
  description: t.String(),
  thumbnail: t.String(),
  price: t.String(),
  eventDate: t.String(),
  locationId: t.String(),
  
}
)
}).patch("/update/:id",WorkshopController.updateWorkshop,{
  body: t.Object({
  title: t.Optional(t.String()),
  slug: t.Optional(t.String()),
  description: t.Optional(t.String()),
  thumbnail: t.Optional(t.String()),
  price: t.Optional(t.String()),
  eventDate: t.Optional(t.String()),
  locationId: t.Optional(t.String()),
}),
beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
})
.delete("/delete/:id",WorkshopController.deleteWorkshop,{
beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).post("/location/create",WorkshopController.createLocation,{
  body:t.Object({
    name: t.String(),
    address: t.String(),
    city: t.String(),
    state: t.String(),
    country: t.String(),
    pincode: t.String(),
    place: t.String(),
  }),
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
})

