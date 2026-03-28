import { Elysia, t } from "elysia";
import { UserController } from "../controller/user.controller";
import { allowRoles, authMiddleware } from "../middleware/auth";
import { WorkshopController } from "../controller/workshop.controller";
import { TutorialsController } from "../controller/tutorials.controller";

export const tutorialsRoutes = new Elysia({ prefix: "/tutorials" }).get(
  "/",
  TutorialsController.getTutorials,
  {
    
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  },

).get("/:id",TutorialsController.getTutorial).get("/:id/play-video",TutorialsController.playTutorial,{
  beforeHandle:[authMiddleware],
})
.post("/create",TutorialsController.createTutorial,{
    body:t.Object({
      title:t.String(),
      description:t.String(),
      price:t.Number(),
      duration:t.Number(),
      thumbnail:t.String(),
      videos:t.Array(t.Object({
        title:t.String(),
        videoKey:t.String(),
         duration:t.Number(),
        size:t.Number()
      }))
    }),
    beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
})
.get("/get/:id",TutorialsController.getTutorialAdmin,{
    beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
})
.patch("/update/:id",TutorialsController.updateTutorial,{
  
  body: t.Object({
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    price: t.Optional(t.Number()),
    duration: t.Optional(t.Number()),
    thumbnail: t.Optional(t.String()),

    videos: t.Optional(t.Array(
      t.Object({
        id: t.Optional(t.String()),
        videoKey: t.Optional(t.String()),
        title: t.Optional(t.String()),
        duration: t.Optional(t.Number()),
        size: t.Optional(t.Number()),
      })
    ),)
  }),

  params: t.Object({
    id: t.String(),
  }),
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).delete("/delete/:id",TutorialsController.deleteTutorial,{
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).get("/getEnrollment",TutorialsController.getEnrollment,{
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
}).post("/remove-access",TutorialsController.RemoveAccess,{
  body:t.Object({
    userId:t.String(),
    tutorialId:t.String(),
  }),
  beforeHandle:[authMiddleware,allowRoles(["ADMIN"])]
})