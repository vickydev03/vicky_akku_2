import { LocationSchema } from "@/modules/workshop/procedures";
import z from "zod";

export const loginSchema = z.object({
  name: z.string().min(1, "name is required"),
  phone: z.string().min(10, "phone is required"),
});

// import { z } from "zod";

/* -------------------- CLASS -------------------- */
export const ClassSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  price: z.number(),
  City: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  isActive: z.boolean(),
});

/* -------------------- USER SUBSCRIPTION -------------------- */
export const UserSubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  classId: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]).or(z.string()),
  createdAt: z.string().datetime(),
  class: ClassSchema,
});

/* -------------------- WORKSHOP -------------------- */
export const WorkshopSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  price: z.number(),
  eventDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  locationId: z.string(),
  location: LocationSchema,
});

/* -------------------- ENROLLMENT -------------------- */
export const EnrollmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workshopId: z.string(),
  createdAt: z.string().datetime(),
  workshop: WorkshopSchema,
});

/* -------------------- TUTORIAL -------------------- */
export const TutorialSchema = z.object({
  id: z.string(),
  isPublished: z.boolean(),
  createdAt: z.string().datetime(),
  title: z.string(),
  duration: z.number(),
  thumbnail: z.string(),
  price: z.number(),
  description: z.string(),
});

/* -------------------- TUTORIAL ACCESS -------------------- */
export const TutorialAccessSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  userId: z.string(),
  tutorialId: z.string(),
  tutorial: TutorialSchema,
});

/* -------------------- USER -------------------- */
export const UserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.enum(["ADMIN", "STUDENT"]).or(z.string()),
    avatar: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    lastLoginAt: z.string().datetime(),

    userSubscription: z.array(UserSubscriptionSchema),
    enrollments: z.array(EnrollmentSchema),
    tutorialAccess: z.array(TutorialAccessSchema),
  })
  .nullable();

/* -------------------- TYPE -------------------- */
export type User = z.infer<typeof UserSchema>;
