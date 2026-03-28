import { Elysia, t } from "elysia";
import { UserController } from "../controller/user.controller";
import { allowRoles, authMiddleware } from "../middleware/auth";
import { WorkshopController } from "../controller/workshop.controller";
import { RegularClassController } from "../controller/regular_classes.controller";

export const regularClassesRoutes = new Elysia({ prefix: "/regular-classes"}).get(
  "/",
  RegularClassController.getClasses,
  {
    query: t.Object({
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
    }),
  },
).get("/:id",RegularClassController.getClass).get("/getClassDetails/:id",RegularClassController.getClassAdmin,{
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).get("/getSubscribers",RegularClassController.getSubscribers,{
  query:t.Object({
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        productId: t.Optional(t.String()),
    }),
    beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).post("/create",RegularClassController.CreateClass,{
  body: t.Object({
  title: t.String({ minLength: 3, maxLength: 150 }),
  description: t.String({ minLength: 10 }),
  thumbnail: t.String(),
  price: t.Number({ minimum: 0 }),
  City: t.String(),
  startDate: t.String(),
  endDate: t.String(),
  perfectFor: t.Array(
    t.Object({
      name: t.String()
    })
  )
})
,beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).patch("/update/:id",RegularClassController.UpdateClass,{
  body:t.Object({
    title:t.Optional(t.String()),
    description:t.Optional(t.String()),
    thumbnail:t.Optional(t.String()),
    price:t.Optional(t.Number()),
    city:t.Optional(t.String()),
    startDate:t.Optional(t.String()),
    endDate:t.Optional(t.String()),
    perfectFor:t.Optional(t.Array(t.Object({name:t.String()})))
  }),beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).delete("/delete/:id",RegularClassController.deleteClass,{
  beforeHandle:[authMiddleware,allowRoles(['ADMIN'])]
})

