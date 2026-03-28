// app.ts
import { Elysia } from "elysia"
import { jwt } from "@elysiajs/jwt"

export const app = new Elysia()
  .use(jwt({
    name: "jwt",
    secret: "super-secret"
  }))
  .state('user', null as null | {
    id: string
    phone: string
  })

export type App = typeof app
