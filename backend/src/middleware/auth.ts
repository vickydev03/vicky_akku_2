import { Context, SingletonBase, StatusMap } from "elysia";

import type { jwt } from "@elysiajs/jwt";
import { HTTPHeaders, Prettify } from "elysia/types";
import { ElysiaCookie } from "elysia/cookies";
// import { App } from "../../type";
// import { jwt } from "twilio";

// type AppContext = App['_context']
type JwtContext = {
  readonly sign: (payload: any, options?: any) => Promise<string>;
  readonly verify: (token: string) => Promise<any | false>;
};


type authContext = {
  jwt: JwtContext;
  store:{
    user?:{
      id:string,
      phone:string
    }
  }

  headers:HTTPHeaders,
  set: {
          headers: HTTPHeaders;
          status?: number | keyof StatusMap;
          
          cookie?: Record<string, ElysiaCookie>;
      },

};

export const authMiddleware = async ({ headers, set, store, jwt }: authContext) => {
  const authHeader = headers["authorization"];
  console.log(authHeader, 456);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (set) set.status = 401;
    return { error: "Unauthorized" };
  }

  const token = authHeader.split(" ")[1];

  const payload = await jwt.verify(token);
  //   console.log(payload);
  //   return { payload };st
  if (store) store.user = payload;
};


type Role = "ADMIN" | "STUDENT";

export const allowRoles =
  (allowedRoles: Role[]) =>
  async ({ set, store }: any) => {
    if (!store?.user) {
      if (set) set.status = 401;
      throw new Error("Unauthorized");
    }

    if (!allowedRoles.includes(store.user.role)) {
      console.log(store.user)
      if (set) set.status = 403;
      throw new Error("Forbidden: Access denied");
    }
  };