import { Elysia, t } from "elysia";
import { UserController } from "../controller/user.controller";
import { allowRoles, authMiddleware } from "../middleware/auth";
// import { jwt } from "@elysiajs/jwt";

export const userRoutes = new Elysia({ prefix: "/user" })

  .post("/req-otp", UserController.reqOtp, {
    body: t.Object({
      phone: t.String({ minLength: 10, maxLength: 17 }),
      name: t.String({ minLength: 2, maxLength: 20 }),
    }),
    query: t.Object({
      ref: t.Optional(t.String()),
    }),
  })
  .post("verify-otp", UserController.verifyOtp, {
    body: t.Object({
      phone: t.String({ minLength: 10, maxLength: 17 }),
      otp: t.String({ minLength: 6, maxLength: 6 }),
    }),
    query: t.Object({
      ref: t.Optional(t.String()),
    }),
  })
  .get("/profile", UserController.profile, {
    beforeHandle: authMiddleware,
  })
  .get("/getAllUsers", UserController.getAllUsers, {
    beforeHandle: [authMiddleware,allowRoles(["ADMIN"])]
  }).get("/getUser/:id",UserController.getUser,{
    beforeHandle: [authMiddleware,allowRoles(["ADMIN"])]
  }).post(
  "/adminlogin",
  UserController.adminLogin,
  {
    body: t.Object({
      phone: t.String(),
      password: t.String(),
    }),
  }
).post("/createUser",UserController.createUser,{
  body:t.Object({
  name: t.String(),
  phone: t.String(),
  password: t.String(),
  role: t.Optional(t.Union([
    t.Literal("ADMIN"),
    t.Literal("STUDENT"),
  ])),
  email: t.Optional(t.String()),
})
})