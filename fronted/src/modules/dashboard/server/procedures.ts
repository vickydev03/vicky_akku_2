import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OverviewItem = { count: number; delta: number; previous: number,total:number,byProductType:[] };

export type DashboardStats = {
  success: boolean;
  filters: {
    startDate: string | null;
    endDate: string | null;
    granularity: "day" | "week" | "month";
    city: string | null;
    locationId: string | null;
    page: number;
    limit: number;
  };
  overview: {
    totalUsers: OverviewItem;
    totalEnrollments: OverviewItem;
    totalTutorialAccess: OverviewItem;
    totalSubscriptions: OverviewItem;
    totalOrders: OverviewItem;
    paidOrders: OverviewItem;
    revenue: OverviewItem;
    userRoleBreakdown: { role: string; _count: { id: number } }[];
    orderStatusBreakdown: { status: string; _count: { id: number }; _sum: { amount: number | null } }[];
  };
  last24Hours: {
    workshopEnrollments: number;
    classSubscriptions: number;
    tutorialAccess: number;
  };
  workshops: {
    total: number;
    list: any[];
    topByEnrollments: any[];
    revenueBreakdown: any[];
  };
  regularClasses: {
    total: number;
    list: any[];
    subscriptionBreakdown: any[];
    statusBreakdown: any[];
  };
  tutorials: {
    total: number;
    list: any[];
    accessBreakdown: any[];
  };
  recentActivity: {
    users: any[];
    enrollments: any[];
    orders: any[];
    subscriptions: any[];
  };
  timeSeries: {
    date: string;
    users: number;
    enrollments: number;
    orders: number;
    revenue: number;
    subscriptions: number;
  }[];
};

// ─── Input ────────────────────────────────────────────────────────────────────

const dashboardStatsInput = z.object({
  startDate:   z.string().optional(),
  endDate:     z.string().optional(),
  granularity: z.enum(["day", "week", "month"]).default("day"),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure(["ADMIN"])
    .input(dashboardStatsInput)
    .query(async ({  input  }): Promise<DashboardStats> => {
      const cookieStore = await cookies();
      const access_token = cookieStore.get("access_token")?.value;
      
      const url = `${process.env.BASE_API}/v1/dashboard/stats?startDate=${input.startDate}&endDate=${input.endDate}`;

      try {
        const res = await axios.get<DashboardStats>(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        console.log(res.data)
        return res.data;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Session expired. Please log in again.",
            });
          }
          
          if (status === 403) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You do not have permission to access this resource.",
            });
          }

          if (status === 404) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Dashboard stats endpoint not found.",
            });
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.response?.data?.message ?? `API error: ${status}`,
          });
        }

        // Network / timeout errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not reach the API. Please try again later.",
        });
      }
    }),
});