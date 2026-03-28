import { Elysia, t } from "elysia";
import { getDashboardStats } from "../controller/dashboard";
import { allowRoles, authMiddleware } from "../middleware/auth";

export const dashboardRoutes = new Elysia({ prefix: "/dashboard" })
  .get("/stats", getDashboardStats, {
    beforeHandle: [authMiddleware, allowRoles(["ADMIN"])],
    query: t.Object({
      startDate:   t.Optional(t.String({ format: "date", description: "Filter start date (YYYY-MM-DD)" })),
      endDate:     t.Optional(t.String({ format: "date", description: "Filter end date (YYYY-MM-DD)" })),
      granularity: t.Optional(
        t.Union(
          [t.Literal("day"), t.Literal("week"), t.Literal("month")],
          { description: "Time-series bucket size (default: day)" }
        )
      ),
      city:        t.Optional(t.String({ description: "Filter by city name" })),
      locationId:  t.Optional(t.String({ format: "uuid", description: "Filter by workshop location ID" })),
      page:        t.Optional(t.String({ pattern: "^[0-9]+$", description: "Page number (default: 1)" })),
      limit:       t.Optional(t.String({ pattern: "^[0-9]+$", description: "Items per page, max 50 (default: 10)" })),
    }),
    detail: {
      tags: ["Dashboard"],
      summary: "Dashboard analytics",
      description: `
Returns full platform analytics including:
- **Overview KPIs** – users, enrollments, subscriptions, tutorial access, orders, revenue (with % delta vs previous period)
- **Last 24h** – quick snapshot per section
- **Workshops** – paginated list, top 5 by enrollments, revenue per workshop
- **Regular Classes** – paginated list, subscriptions per class, status breakdown
- **Tutorials** – paginated list, access count per tutorial
- **Orders** – status breakdown (PENDING / PAID / FAILED / REFUNDED)
- **Recent Activity** – latest 5 users, enrollments, orders, subscriptions
- **Time Series** – bucketed by \`granularity\` over the selected date range
      `.trim(),
      security: [{ cookieAuth: [] }],
      responses: {
        200: { description: "Analytics data returned successfully" },
        401: { description: "Unauthorized – missing or invalid token" },
        500: { description: "Internal server error" },
      },
    },
  });