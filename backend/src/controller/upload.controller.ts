// controllers/upload.controller.ts

import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { r2 } from "../config/r2";
import { Context } from "elysia";
// import { Context } from "inngest";

type FileMeta = {
  name: string;
  type: string;
  size: number;
};

type getAllContext = {
  body: {
    files: FileMeta[];
  };
  set: any;
};

export class UploadController {
  static async getPresignedUrl({ body, set }: getAllContext) {
    const files = body.files;

    try {
      if (!Array.isArray(files)) {
        set.status = 400;
        return { message: "Expected array of files" };
      }

    //  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

      const urls = await Promise.all(
        files.map(async (file) => {
          const { name, type, size } = file;

        //  if (!allowedTypes.includes(type)) {
        //    throw new Error("Invalid file type");
          // }

         // if (size > 100 * 1024 * 1024) {
          //  throw new Error("File too large");
        //  }

          const key = `uploads/${crypto.randomUUID()}-${name}`;

          const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            ContentType: type,
          });

          const uploadUrl = await getSignedUrl(r2, command, {
            expiresIn: 600,
          });

          return { uploadUrl, key };
        }),
      );

      return { files: urls };
    } catch (error) {
      set.status = 500;
      console.log(error)
      return { message: "Failed to generate presigned URLs" };
    }
  }

  static async showAllVideos({ set }: Context) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: "uploads/",
      });

      const res = await r2.send(command);

      const videoExtensions = [".mp4", ".mov", ".webm", ".mkv"];

      const videos =
        res.Contents?.filter((file) =>
          videoExtensions.some((ext) => file.Key?.toLowerCase().endsWith(ext)),
        ).map((file) => ({
          key: file.Key,
          size: file.Size,
          lastModified: file.LastModified,
        })) || [];

      return { videos };
    } catch (error) {
      set.status = 500;
      return { message: "Failed to fetch videos" };
    }
  }
}
