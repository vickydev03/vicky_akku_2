import { Context } from "elysia";
import { db as prisma } from "../../prisma/seed";

// ─── Query Types ─────────────────────────────────────────────────────────────

type DashboardContext = Context<{
  query: {
    startDate?: string;
    endDate?: string;
    granularity?: "day" | "week" | "month";
    city?: string;
    locationId?: string;
  };
}>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isValidDate(d: any) {
  return d instanceof Date && !isNaN(d.getTime());
}

function buildDateRange(startDate?: string, endDate?: string) {
  if (!startDate || !endDate || startDate.includes("NaN") || endDate.includes("NaN")) return undefined;
  
  const gte = new Date(startDate);
  const lte = new Date(endDate);
  
  if (!isValidDate(gte) || !isValidDate(lte)) return undefined;
  
  return { gte, lte };
}

function previousPeriod(startDate?: string, endDate?: string) {
  if (!startDate || !endDate || startDate.includes("NaN") || endDate.includes("NaN")) {
    return { prevStart: undefined, prevEnd: undefined };
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (!isValidDate(start) || !isValidDate(end)) {
    return { prevStart: undefined, prevEnd: undefined };
  }

  const diff = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - diff);
  return { prevStart, prevEnd };
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
}

// ─── Controller ──────────────────────────────────────────────────────────────

export const getDashboardStats = async ({ query, set }: DashboardContext) => {
  try {
    const {
      startDate,
      endDate,
      granularity = "day",
      city,
      locationId,
    } = query;

    const createdAtRange = buildDateRange(startDate, endDate);
    const eventDateRange = buildDateRange(startDate, endDate);
    const { prevStart, prevEnd } = previousPeriod(startDate, endDate);
    const prevRange = buildDateRange(
      prevStart?.toISOString(),
      prevEnd?.toISOString()
    );

    // NOTE: Order model has NO relation to Workshop or Location.
    // Orders are filtered only by createdAt, status, productType, and productId.
    // Workshop/class/tutorial revenue is cross-referenced via productId + productType.

    // ── 1. OVERVIEW COUNTS ──────────────────────────────────────────────────

    const [
      totalUsers,
      prevTotalUsers,
      totalEnrollments,
      prevEnrollments,
      totalTutorialAccess,
      prevTutorialAccess,
      totalSubscriptions,
      prevSubscriptions,
      totalOrders,
      prevOrders,
      paidOrders,
      prevPaidOrders,
    ] = await Promise.all([
      prisma.user.count({
        where: createdAtRange ? { createdAt: createdAtRange } : undefined,
      }),
      prisma.user.count({
        where: prevRange ? { createdAt: prevRange } : undefined,
      }),

      prisma.enrollment.count({
        where: {
          ...(createdAtRange && { createdAt: createdAtRange }),
          ...(locationId && { workshop: { locationId } }),
          ...(city && { workshop: { location: { city } } }),
        },
      }),
      prisma.enrollment.count({
        where: {
          ...(prevRange && { createdAt: prevRange }),
          ...(locationId && { workshop: { locationId } }),
          ...(city && { workshop: { location: { city } } }),
        },
      }),

      prisma.tutorialAccess.count({
        where: createdAtRange ? { createdAt: createdAtRange } : undefined,
      }),
      prisma.tutorialAccess.count({
        where: prevRange ? { createdAt: prevRange } : undefined,
      }),

      prisma.userSubscription.count({
        where: {
          ...(createdAtRange && { createdAt: createdAtRange }),
          ...(city && { class: { City: city } }),
        },
      }),
      prisma.userSubscription.count({
        where: {
          ...(prevRange && { createdAt: prevRange }),
          ...(city && { class: { City: city } }),
        },
      }),

      prisma.order.count({
        where: createdAtRange ? { createdAt: createdAtRange } : undefined,
      }),
      prisma.order.count({
        where: prevRange ? { createdAt: prevRange } : undefined,
      }),

      prisma.order.count({
        where: {
          status: "PAID",
          ...(createdAtRange && { createdAt: createdAtRange }),
        },
      }),
      prisma.order.count({
        where: {
          status: "PAID",
          ...(prevRange && { createdAt: prevRange }),
        },
      }),
    ]);

    // ── 2. REVENUE ──────────────────────────────────────────────────────────

    const [revenueAgg, prevRevenueAgg] = await Promise.all([
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          ...(createdAtRange && { createdAt: createdAtRange }),
        },
      }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          ...(prevRange && { createdAt: prevRange }),
        },
      }),
    ]);

    const totalRevenue = revenueAgg._sum.amount ?? 0;
    const prevRevenue = prevRevenueAgg._sum.amount ?? 0;

    const revenueByProductType = await prisma.order.groupBy({
      by: ["productType"],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: "PAID",
        ...(createdAtRange && { createdAt: createdAtRange }),
      },
      orderBy: { _sum: { amount: "desc" } },
    });

    // ── 3. ORDER STATUS BREAKDOWN ────────────────────────────────────────────

    const orderStatusBreakdown = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { amount: true },
      where: createdAtRange ? { createdAt: createdAtRange } : undefined,
    });

    // ── 4. WORKSHOP SECTION ─────────────────────────────────────────────────

    const workshopWhere = {
      ...(eventDateRange && { eventDate: eventDateRange }),
      ...(locationId && { locationId }),
      ...(city && { location: { city } }),
    };

    // Total count — full dataset, no pagination
    const totalWorkshops = await prisma.workshop.count({ where: workshopWhere });

    // Top workshops by enrollment count — summary only, no pagination needed
    const topWorkshops = await prisma.workshop.findMany({
      where: workshopWhere,
      include: {
        location: true,
        _count: { select: { enrollment: true } },
      },
      orderBy: { enrollment: { _count: "desc" } },
      take: 10,
    });

    // Workshop revenue breakdown
    const workshopOrderRevenue = await prisma.order.groupBy({
      by: ["productId"],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: "PAID",
        productType: "WORKSHOP",
        ...(createdAtRange && { createdAt: createdAtRange }),
      },
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    });

    const workshopProductIds = workshopOrderRevenue.map((o) => o.productId);
    const workshopDetails = await prisma.workshop.findMany({
      where: { id: { in: workshopProductIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        eventDate: true,
        locationId: true,
        location: { select: { city: true, name: true } },
      },
    });
    const workshopMap = Object.fromEntries(workshopDetails.map((w) => [w.id, w]));

    const workshopRevenueEnriched = workshopOrderRevenue.map((o) => ({
      productId: o.productId,
      totalRevenue: o._sum.amount ?? 0,
      orderCount: o._count.id,
      workshop: workshopMap[o.productId] ?? null,
    }));

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const workshopEnrollments24h = await prisma.enrollment.count({
      where: {
        createdAt: { gte: last24h },
        ...(locationId && { workshop: { locationId } }),
        ...(city && { workshop: { location: { city } } }),
      },
    });

    // ── 5. REGULAR CLASS SECTION ─────────────────────────────────────────────

    const classWhere = {
      ...(city && { City: city }),
      ...(startDate || endDate
        ? {
            AND: [
              ...(startDate ? [{ endDate: { gte: new Date(startDate) } }] : []),
              ...(endDate ? [{ startDate: { lte: new Date(endDate) } }] : []),
            ],
          }
        : {}),
    };

    const totalClasses = await prisma.regularClass.count({ where: classWhere });

    const classSubscriptionBreakdown = await prisma.userSubscription.groupBy({
      by: ["classId"],
      _count: { id: true },
      where: {
        ...(createdAtRange && { createdAt: createdAtRange }),
        ...(city && { class: { City: city } }),
      },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const classIds = classSubscriptionBreakdown.map((c) => c.classId);
    const classDetails = await prisma.regularClass.findMany({
      where: { id: { in: classIds } },
      select: {
        id: true,
        title: true,
        City: true,
        price: true,
        startDate: true,
        endDate: true,
        isActive: true,
      },
    });
    const classMap = Object.fromEntries(classDetails.map((c) => [c.id, c]));

    const classSubEnriched = classSubscriptionBreakdown.map((c) => ({
      classId: c.classId,
      subscriptionCount: c._count.id,
      class: classMap[c.classId] ?? null,
    }));

    const classOrderRevenue = await prisma.order.groupBy({
      by: ["productId"],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: "PAID",
        productType: "CLASS",
        ...(createdAtRange && { createdAt: createdAtRange }),
      },
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    });

    const classRevenueProductIds = classOrderRevenue.map((o) => o.productId);
    const classRevenueDetails = await prisma.regularClass.findMany({
      where: { id: { in: classRevenueProductIds } },
      select: { id: true, title: true, City: true, price: true, isActive: true },
    });
    const classRevenueMap = Object.fromEntries(classRevenueDetails.map((c) => [c.id, c]));

    const classRevenueEnriched = classOrderRevenue.map((o) => ({
      productId: o.productId,
      totalRevenue: o._sum.amount ?? 0,
      orderCount: o._count.id,
      class: classRevenueMap[o.productId] ?? null,
    }));

    const subStatusBreakdown = await prisma.userSubscription.groupBy({
      by: ["status"],
      _count: { id: true },
      where: {
        ...(createdAtRange && { createdAt: createdAtRange }),
        ...(city && { class: { City: city } }),
      },
    });

    const classSubscriptions24h = await prisma.userSubscription.count({
      where: {
        createdAt: { gte: last24h },
        ...(city && { class: { City: city } }),
      },
    });
    
    // ── 6. TUTORIAL SECTION ──────────────────────────────────────────────────

    const totalTutorials = await prisma.tutorials.count({
      where: createdAtRange ? { createdAt: createdAtRange } : undefined,
    });

    const tutorialAccessBreakdown = await prisma.tutorialAccess.groupBy({
      by: ["tutorialId"],
      _count: { id: true },
      where: createdAtRange ? { createdAt: createdAtRange } : undefined,
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    const tutorialIds = tutorialAccessBreakdown.map((t) => t.tutorialId);
    const tutorialDetails = await prisma.tutorials.findMany({
      where: { id: { in: tutorialIds } },
      select: { id: true, title: true, price: true, thumbnail: true, isPublished: true },
    });
    const tutorialMap = Object.fromEntries(tutorialDetails.map((t) => [t.id, t]));

    const tutorialAccessEnriched = tutorialAccessBreakdown.map((t) => ({
      tutorialId: t.tutorialId,
      accessCount: t._count.id,
      tutorial: tutorialMap[t.tutorialId] ?? null,
    }));

    const tutorialOrderRevenue = await prisma.order.groupBy({
      by: ["productId"],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        status: "PAID",
        productType: "TUTORIAL",
        ...(createdAtRange && { createdAt: createdAtRange }),
      },
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    });

    const tutorialRevenueProductIds = tutorialOrderRevenue.map((o) => o.productId);
    const tutorialRevenueDetails = await prisma.tutorials.findMany({
      where: { id: { in: tutorialRevenueProductIds } },
      select: { id: true, title: true, price: true, isPublished: true },
    });
    const tutorialRevenueMap = Object.fromEntries(tutorialRevenueDetails.map((t) => [t.id, t]));

    const tutorialRevenueEnriched = tutorialOrderRevenue.map((o) => ({
      productId: o.productId,
      totalRevenue: o._sum.amount ?? 0,
      orderCount: o._count.id,
      tutorial: tutorialRevenueMap[o.productId] ?? null,
    }));

    const tutorialAccess24h = await prisma.tutorialAccess.count({
      where: { createdAt: { gte: last24h } },
    });

    // ── 7. RECENT ACTIVITY ───────────────────────────────────────────────────

    const [recentUsers, recentEnrollments, recentOrders, recentSubscriptions] =
      await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            createdAt: true,
            lastLoginAt: true,
          },
        }),
        prisma.enrollment.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { id: true, name: true, phone: true } },
            workshop: {
              select: { id: true, title: true, eventDate: true, price: true },
            },
          },
        }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        }),
        prisma.userSubscription.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { id: true, name: true, phone: true } },
            class: { select: { id: true, title: true, City: true } },
          },
        }),
      ]);

    // ── 8. USER ROLE BREAKDOWN ───────────────────────────────────────────────

    const userRoleBreakdown = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
      where: createdAtRange ? { createdAt: createdAtRange } : undefined,
    });

    // ── 9. ENROLLMENT BY LOCATION / CITY ────────────────────────────────────

    const enrollmentByLocation = await prisma.enrollment.groupBy({
      by: ["workshopId"],
      _count: { id: true },
      where: createdAtRange ? { createdAt: createdAtRange } : undefined,
      orderBy: { _count: { id: "desc" } },
    });

    const locationWorkshopIds = enrollmentByLocation.map((e) => e.workshopId);
    const locationWorkshops = await prisma.workshop.findMany({
      where: { id: { in: locationWorkshopIds } },
      select: {
        id: true,
        locationId: true,
        location: { select: { id: true, city: true, name: true } },
      },
    });
    const locationWorkshopMap = Object.fromEntries(
      locationWorkshops.map((w) => [w.id, w])
    );

    const cityEnrollmentMap: Record<
      string,
      { city: string; locationName: string; count: number }
    > = {};
    for (const e of enrollmentByLocation) {
      const wk = locationWorkshopMap[e.workshopId];
      if (!wk) continue;
      const key = wk.location.city;
      if (!cityEnrollmentMap[key]) {
        cityEnrollmentMap[key] = {
          city: key,
          locationName: wk.location.name,
          count: 0,
        };
      }
      cityEnrollmentMap[key].count += e._count.id;
    }
    const enrollmentByCity = Object.values(cityEnrollmentMap).sort(
      (a, b) => b.count - a.count
    );

    // ── 10. TIME-SERIES ──────────────────────────────────────────────────────

    const [tsUsers, tsEnrollments, tsOrders, tsSubscriptions] =
      await Promise.all([
        prisma.user.findMany({
          where: createdAtRange ? { createdAt: createdAtRange } : undefined,
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.enrollment.findMany({
          where: {
            ...(createdAtRange && { createdAt: createdAtRange }),
            ...(locationId && { workshop: { locationId } }),
            ...(city && { workshop: { location: { city } } }),
          },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.order.findMany({
          where: {
            status: "PAID",
            ...(createdAtRange && { createdAt: createdAtRange }),
          },
          select: { createdAt: true, amount: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.userSubscription.findMany({
          where: {
            ...(createdAtRange && { createdAt: createdAtRange }),
            ...(city && { class: { City: city } }),
          },
          select: { createdAt: true },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const bucketKey = (date: Date): string => {
      const d = new Date(date);
      if (granularity === "month")
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (granularity === "week") {
        const day = d.getDay() || 7;
        d.setDate(d.getDate() - day + 1);
      }
      return d.toISOString().slice(0, 10);
    };

    type TSBucket = {
      users: number;
      enrollments: number;
      orders: number;
      revenue: number;
      subscriptions: number;
    };
    const tsMap: Record<string, TSBucket> = {};
    const ensureBucket = (key: string) => {
      if (!tsMap[key])
        tsMap[key] = {
          users: 0,
          enrollments: 0,
          orders: 0,
          revenue: 0,
          subscriptions: 0,
        };
    };

    tsUsers.forEach((u) => {
      const k = bucketKey(u.createdAt);
      ensureBucket(k);
      tsMap[k].users++;
    });
    tsEnrollments.forEach((e) => {
      const k = bucketKey(e.createdAt);
      ensureBucket(k);
      tsMap[k].enrollments++;
    });
    tsOrders.forEach((o) => {
      const k = bucketKey(o.createdAt);
      ensureBucket(k);
      tsMap[k].orders++;
      tsMap[k].revenue += o.amount;
    });
    tsSubscriptions.forEach((s) => {
      const k = bucketKey(s.createdAt);
      ensureBucket(k);
      tsMap[k].subscriptions++;
    });

    const timeSeries = Object.entries(tsMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({ date, ...counts }));

    // ── 11. FINAL RESPONSE ────────────────────────────────────────────────────

    return {
      success: true,
      filters: {
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        granularity,
        city: city ?? null,
        locationId: locationId ?? null,
      },

      overview: {
        totalUsers: {
          count: totalUsers,
          delta: pctChange(totalUsers, prevTotalUsers),
          previous: prevTotalUsers,
        },
        totalEnrollments: {
          count: totalEnrollments,
          delta: pctChange(totalEnrollments, prevEnrollments),
          previous: prevEnrollments,
        },
        totalTutorialAccess: {
          count: totalTutorialAccess,
          delta: pctChange(totalTutorialAccess, prevTutorialAccess),
          previous: prevTutorialAccess,
        },
        totalSubscriptions: {
          count: totalSubscriptions,
          delta: pctChange(totalSubscriptions, prevSubscriptions),
          previous: prevSubscriptions,
        },
        totalOrders: {
          count: totalOrders,
          delta: pctChange(totalOrders, prevOrders),
          previous: prevOrders,
        },
        paidOrders: {
          count: paidOrders,
          delta: pctChange(paidOrders, prevPaidOrders),
          previous: prevPaidOrders,
        },
        revenue: {
          total: totalRevenue,
          delta: pctChange(totalRevenue, prevRevenue),
          previous: prevRevenue,
          byProductType: revenueByProductType,
        },
        userRoleBreakdown,
        orderStatusBreakdown,
      },

      last24Hours: {
        workshopEnrollments: workshopEnrollments24h,
        classSubscriptions: classSubscriptions24h,
        tutorialAccess: tutorialAccess24h,
      },

      workshops: {
        total: totalWorkshops,
        topByEnrollments: topWorkshops,
        revenueBreakdown: workshopRevenueEnriched,
        enrollmentByCity,
      },

      regularClasses: {
        total: totalClasses,
        subscriptionBreakdown: classSubEnriched,
        revenueBreakdown: classRevenueEnriched,
        statusBreakdown: subStatusBreakdown,
      },

      tutorials: {
        total: totalTutorials,
        accessBreakdown: tutorialAccessEnriched,
        revenueBreakdown: tutorialRevenueEnriched,
      },

      recentActivity: {
        users: recentUsers,
        enrollments: recentEnrollments,
        orders: recentOrders,
        subscriptions: recentSubscriptions,
      },

      timeSeries,
    };
  } catch (error: any) {
    set.status = 500;
    return {
      success: false,
      message: error?.message ?? "Internal server error",
    };
  }
};