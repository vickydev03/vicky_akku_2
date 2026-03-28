// routes/upload.route.ts

import { Elysia, t } from "elysia";
import { UploadController } from "../controller/upload.controller";
export const uploadRoute = new Elysia({ prefix: "/upload" })
  .post("/presigned-url", UploadController.getPresignedUrl,{
    body:t.Object({
      files:t.Array(
      t.Object({
        name:t.String(),
        size:t.Number(),
        type:t.String()
    })
    )
    })
  }).get("/getVideos",UploadController.showAllVideos)


  