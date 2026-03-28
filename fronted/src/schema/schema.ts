import z from "zod";

export const loginSchema = z.object({
  name: z
    .string()
    .min(1, "name is required"),
    phone:z.string().min(10, "phone is required")
})
