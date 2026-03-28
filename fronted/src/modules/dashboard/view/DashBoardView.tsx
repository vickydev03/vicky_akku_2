"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IndianRupee,
  Users,
  GraduationCap,
  Loader2,
  TrendingUp,
  TrendingDown,
  BookOpen,
  CalendarDays,
  ShoppingCart,
  Activity,
  MapPin,
  RefreshCw,
  Minus,
  Layers,
  BarChart2,
  Zap,
  Clock,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { DatePickerWithRange } from "../component/DatePicker";
import { useDashboardUserFilters } from "../hooks/useDashboardClasses";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Filters {
  startDate: string;
  endDate: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const BRAND = {
  blue: "#2563eb",
  violet: "#7c3aed",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  indigo: "#4338ca",
  teal: "#0d9488",
  cyan: "#0891b2",
  fuchsia: "#a21caf",
  orange: "#ea580c",
};

const STATUS_CFG: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  PAID: { bg: "#f0fdf4", text: "#166534", dot: "#16a34a", border: "#bbf7d0" },
  PENDING: {
    bg: "#fffbeb",
    text: "#92400e",
    dot: "#d97706",
    border: "#fde68a",
  },
  FAILED: { bg: "#fff1f2", text: "#9f1239", dot: "#e11d48", border: "#fecdd3" },
  REFUNDED: {
    bg: "#f5f3ff",
    text: "#4c1d95",
    dot: "#7c3aed",
    border: "#ddd6fe",
  },
};

const SUB_STATUS_CFG: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  ACTIVE: { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  EXPIRED: { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" },
  CANCELLED: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
];

const tsConfig: ChartConfig = {
  enrollments: { label: "Enrollments", color: BRAND.blue },
  revenue: { label: "Revenue (₹)", color: BRAND.emerald },
  users: { label: "New Users", color: BRAND.amber },
  subscriptions: { label: "Subscriptions", color: BRAND.violet },
};

// ─── Formatters ────────────────────────────────────────────────────────────────

const fmtN = (n: number) => new Intl.NumberFormat("en-IN").format(n);
const fmtRs = (n: number) => `₹${fmtN(Math.round(n))}`;
const fmtK = (n: number) =>
  n >= 100_000
    ? `₹${(n / 100_000).toFixed(1)}L`
    : n >= 1_000
      ? `₹${(n / 1_000).toFixed(1)}K`
      : `₹${fmtN(Math.round(n))}`;

// ─── Sub-components ────────────────────────────────────────────────────────────

function Delta({ value }: { value: number }) {
  if (value === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
        <Minus className="h-2.5 w-2.5" /> 0%
      </span>
    );
  const up = value > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
    >
      {up ? (
        <TrendingUp className="h-2.5 w-2.5" />
      ) : (
        <TrendingDown className="h-2.5 w-2.5" />
      )}
      {Math.abs(value)}%
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  const initials =
    name
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() ?? "?";
  const hue = ((name?.charCodeAt(0) ?? 0) * 37) % 360;
  return (
    <div
      className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
      style={{ background: `hsl(${hue} 60% 50%)` }}
    >
      {initials}
    </div>
  );
}

// ─── KPI Card ──────────────────────────────────────────────────────────────────

interface KPIProps {
  title: string;
  value: number;
  delta: number;
  previous: number;
  icon: React.ElementType;
  accent: string;
  prefix?: string;
  suffix?: string;
  large?: boolean;
}

function KPICard({
  title,
  value,
  delta,
  previous,
  icon: Icon,
  accent,
  prefix = "",
  suffix = "",
  large,
}: KPIProps) {
  return (
    <Card className="relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: accent }}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 truncate">
              {title}
            </p>
            <p
              className={`mt-1.5 font-bold tracking-tight text-slate-900 ${large ? "text-3xl" : "text-2xl"}`}
            >
              {prefix}
              {fmtN(value)}
              {suffix}
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <Delta value={delta} />
              <span className="text-[11px] text-slate-400">
                vs {prefix}
                {fmtN(previous)}
                {suffix}
              </span>
            </div>
          </div>
          <div
            className="shrink-0 rounded-2xl p-2.5"
            style={{ background: `${accent}18` }}
          >
            <Icon className="h-5 w-5" style={{ color: accent }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Revenue Highlight ─────────────────────────────────────────────────────────

function RevenueCard({
  total,
  delta,
  previous,
  byType,
}: {
  total: number;
  delta: number;
  previous: number;
  byType: any[];
}) {
  const productTypeColors: Record<string, string> = {
    WORKSHOP: BRAND.blue,
    CLASS: BRAND.violet,
    TUTORIAL: BRAND.emerald,
  };
  return (
    <Card className="relative overflow-hidden bg-slate-900 border-0 shadow-lg text-white">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, #2563eb 0%, transparent 60%), radial-gradient(circle at 20% 80%, #7c3aed 0%, transparent 60%)",
        }}
      />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Total Revenue
            </p>
            <p className="mt-1.5 text-3xl font-bold tracking-tight">
              {fmtRs(total)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${delta >= 0 ? "bg-emerald-900/50 text-emerald-300" : "bg-rose-900/50 text-rose-300"}`}
              >
                {delta >= 0 ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5" />
                )}
                {Math.abs(delta)}%
              </span>
              <span className="text-[11px] text-slate-400">
                vs {fmtRs(previous)}
              </span>
            </div>
          </div>
          <div className="rounded-2xl p-2.5 bg-white/10">
            <IndianRupee className="h-5 w-5 text-white" />
          </div>
        </div>
        {byType.length > 0 && (
          <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
            {byType.map((b: any) => {
              const color = productTypeColors[b.productType] ?? "#94a3b8";
              const pct =
                total > 0
                  ? Math.round(((b._sum.amount ?? 0) / total) * 100)
                  : 0;
              return (
                <div key={b.productType}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-slate-400">
                      {b.productType}
                    </span>
                    <span className="text-[11px] font-semibold text-white">
                      {fmtK(b._sum.amount ?? 0)} · {pct}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── 24h Live Strip ────────────────────────────────────────────────────────────

function Live24h({
  data,
}: {
  data: {
    workshopEnrollments: number;
    classSubscriptions: number;
    tutorialAccess: number;
  };
}) {
  const items = [
    {
      label: "Enrollments",
      value: data.workshopEnrollments,
      color: BRAND.blue,
      icon: GraduationCap,
    },
    {
      label: "Subscriptions",
      value: data.classSubscriptions,
      color: BRAND.violet,
      icon: CalendarDays,
    },
    {
      label: "Tutorial Views",
      value: data.tutorialAccess,
      color: BRAND.rose,
      icon: BookOpen,
    },
  ];
  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Live · Last 24 Hours
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3 flex flex-col gap-1.5 text-center"
              style={{
                background: `${item.color}0d`,
                border: `1px solid ${item.color}20`,
              }}
            >
              <item.icon
                className="mx-auto h-4 w-4"
                style={{ color: item.color }}
              />
              <div className="text-2xl font-bold text-slate-900">
                {fmtN(item.value)}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Filters Bar ───────────────────────────────────────────────────────────────

// function FiltersBar({ filters, onChange }: { filters: Filters; onChange: (f: Partial<Filters>) => void }) {
//   const applyPreset = (days: number) => onChange({
//     startDate: format(subDays(new Date(), days), "yyyy-MM-dd"),
//     endDate: format(new Date(), "yyyy-MM-dd"),
//   });
//   const active = PRESETS.find(p =>
//     filters.startDate === format(subDays(new Date(), p.days), "yyyy-MM-dd") &&
//     filters.endDate === format(new Date(), "yyyy-MM-dd")
//   );
//   return (
//     <div className="flex flex-wrap items-center gap-3">
//       <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
//         {PRESETS.map(p => (
//           <button key={p.days} onClick={() => applyPreset(p.days)}
//             className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all select-none ${
//               active?.days === p.days
//                 ? "bg-white text-slate-900 shadow-sm"
//                 : "text-slate-500 hover:text-slate-900"
//             }`}>{p.label}
//           </button>
//         ))}
//       </div>
//       <Separator orientation="vertical" className="h-6 hidden sm:block" />
//       <div className="flex items-center gap-2">
//         <input type="date" value={filters.startDate}
//           onChange={e => onChange({ startDate: e.target.value })}
//           className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
//         <span className="text-slate-400 text-xs">—</span>
//         <input type="date" value={filters.endDate}
//           onChange={e => onChange({ endDate: e.target.value })}
//           className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
//       </div>
//       <Separator orientation="vertical" className="h-6 hidden sm:block" />
//       <Select value={filters.granularity} onValueChange={v => onChange({ granularity: v as Filters["granularity"] })}>
//         <SelectTrigger className="h-8 w-[110px] text-xs border-slate-200 bg-white text-slate-900 focus:ring-blue-500/30">
//           <SelectValue />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="day"><span className="text-slate-900">Daily</span></SelectItem>
//           <SelectItem value="week"><span className="text-slate-900">Weekly</span></SelectItem>
//           <SelectItem value="month"><span className="text-slate-900">Monthly</span></SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// ─── Time Series ───────────────────────────────────────────────────────────────

function TimeSeriesChart({
  data,
  // granularity,
}: {
  data: any[];
  // granularity: string;
}) {
  const [active, setActive] = useState([
    "enrollments",
    "revenue",
    "users",
    "subscriptions",
  ]);
  const toggle = (k: string) =>
    setActive((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const seriesList = Object.entries(tsConfig) as [
    string,
    { label: string; color: string },
  ][];

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5 bg-blue-50">
              <BarChart2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-slate-900">
                Platform Activity
              </CardTitle>
              {/* <CardDescription className="text-xs text-slate-500">
                Bucketed 
              </CardDescription> */}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seriesList.map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  active.includes(key)
                    ? "text-slate-900 bg-white shadow-sm border-slate-200"
                    : "text-slate-400 border-slate-200 opacity-50"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: cfg.color }}
                />
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer
          config={tsConfig}
          className="h-[240px] sm:h-[280px] w-full"
        >
          <AreaChart
            data={data}
            margin={{ left: 4, right: 4, top: 4, bottom: 0 }}
          >
            <defs>
              {seriesList.map(([key, cfg]) => (
                <linearGradient
                  key={key}
                  id={`grad-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={cfg.color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={cfg.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(v) => {
                try {
                  return format(new Date(v), "dd MMM");
                } catch {
                  return v;
                }
              }}
            />
            <YAxis
              yAxisId="count"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              width={28}
            />
            <YAxis
              yAxisId="revenue"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              width={44}
              tickFormatter={(v) =>
                v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
              }
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            {active.includes("enrollments") && (
              <Area
                yAxisId="count"
                dataKey="enrollments"
                type="monotone"
                stroke={BRAND.blue}
                fill="url(#grad-enrollments)"
                strokeWidth={2}
                dot={false}
              />
            )}
            {active.includes("users") && (
              <Area
                yAxisId="count"
                dataKey="users"
                type="monotone"
                stroke={BRAND.amber}
                fill="url(#grad-users)"
                strokeWidth={2}
                dot={false}
              />
            )}
            {active.includes("subscriptions") && (
              <Area
                yAxisId="count"
                dataKey="subscriptions"
                type="monotone"
                stroke={BRAND.violet}
                fill="url(#grad-subscriptions)"
                strokeWidth={2}
                dot={false}
              />
            )}
            {active.includes("revenue") && (
              <Area
                yAxisId="revenue"
                dataKey="revenue"
                type="monotone"
                stroke={BRAND.emerald}
                fill="url(#grad-revenue)"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Order Status Donut ────────────────────────────────────────────────────────

function OrderStatusDonut({ data }: { data: any[] }) {
  const pieData = data.map((d) => ({
    name: d.status,
    value: d._count.id,
    amount: d._sum.amount ?? 0,
  }));
  const total = pieData.reduce((s, d) => s + d.value, 0);
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-violet-50">
            <Activity className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Order Status
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {total} orders total
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {pieData.map((e) => (
                    <Cell
                      key={e.name}
                      fill={STATUS_CFG[e.name]?.dot ?? "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, n: string) => [fmtN(v), n]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 11,
                    background: "#fff",
                    color: "#0f172a",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900">{total}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-wide">
                Total
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {pieData.map((d) => {
              const c = STATUS_CFG[d.name] ?? {
                bg: "#f8fafc",
                text: "#475569",
                dot: "#94a3b8",
                border: "#e2e8f0",
              };
              const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: c.dot }}
                      />
                      <span className="text-xs font-medium text-slate-700 truncate">
                        {d.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-slate-900">
                        {fmtN(d.value)}
                      </span>
                      <span className="text-[10px] text-slate-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: c.dot }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Workshop Revenue ──────────────────────────────────────────────────────────

function WorkshopRevenueList({ data }: { data: any[] }) {
  const max = Math.max(...data.map((w) => w.totalRevenue), 1);
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-emerald-50">
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Workshop Revenue
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Top by earnings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {data.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No data for selected period
          </p>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 6).map((w: any, i: number) => {
              const pct = Math.round((w.totalRevenue / max) * 100);
              return (
                <div key={w.productId ?? i}>
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs font-medium text-slate-800 truncate min-w-0 max-w-[55%]">
                      {w.workshop?.title ?? "—"}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">
                        {w.orderCount} orders
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        {fmtK(w.totalRevenue)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Top Workshops ─────────────────────────────────────────────────────────────

function TopWorkshopsBar({ data }: { data: any[] }) {
  const chartData = data.map((w) => ({
    name: w.title?.length > 16 ? w.title.slice(0, 16) + "…" : w.title,
    count: w._count?.enrollment ?? 0,
  }));
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-blue-50">
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Top Workshops
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              By enrollment count
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-4">
        <ChartContainer
          config={{ count: { label: "Enrollments", color: BRAND.blue } }}
          className="h-[160px] w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#0f172a" }}
              width={100}
            />
            <Tooltip
              formatter={(v: number) => [fmtN(v), "Enrollments"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 11,
                background: "#fff",
                color: "#0f172a",
              }}
            />
            <Bar dataKey="count" fill={BRAND.blue} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── City Enrollments ──────────────────────────────────────────────────────────

function CityBreakdown({ data }: { data: any[] }) {
  const max = Math.max(...data.map((c) => c.count), 1);
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-teal-50">
            <MapPin className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Enrollments by City
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Geographic distribution
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {data.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No location data available
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((c, i) => {
              const pct = Math.round((c.count / max) * 100);
              const color = [
                BRAND.teal,
                BRAND.blue,
                BRAND.violet,
                BRAND.amber,
                BRAND.orange,
              ][i % 5];
              return (
                <div key={c.city}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {c.city}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                        · {c.locationName}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 shrink-0">
                      {fmtN(c.count)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Tutorial Access ───────────────────────────────────────────────────────────

function TutorialAccessList({ data }: { data: any[] }) {
  const max = Math.max(...data.map((t) => t.accessCount), 1);
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-rose-50">
            <BookOpen className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Tutorial Access
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Most accessed tutorials
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {data.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No data for selected period
          </p>
        ) : (
          <div className="space-y-3">
            {data.slice(0, 6).map((t: any, i: number) => {
              const pct = Math.round((t.accessCount / max) * 100);
              return (
                <div key={t.tutorialId ?? i}>
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs font-medium text-slate-800 truncate min-w-0 max-w-[60%]">
                      {t.tutorial?.title ?? "—"}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {t.tutorial?.price != null && (
                        <span className="text-[10px] text-slate-400">
                          {fmtRs(t.tutorial.price)}
                        </span>
                      )}
                      <span className="text-xs font-bold text-rose-600">
                        {fmtN(t.accessCount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-rose-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── User Role Breakdown ───────────────────────────────────────────────────────

function UserRoleCard({ data }: { data: any[] }) {
  const total = data.reduce((s, d) => s + d._count.id, 0);
  const colors = [BRAND.blue, BRAND.violet, BRAND.amber, BRAND.teal];
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-indigo-50">
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              User Roles
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {total} total users
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ResponsiveContainer width={90} height={90}>
              <PieChart>
                <Pie
                  data={data.map((d) => ({ name: d.role, value: d._count.id }))}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={40}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {data.map((_: any, i: number) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-bold text-slate-900">
                {total}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            {data.map((d: any, i: number) => {
              const pct =
                total > 0 ? Math.round((d._count.id / total) * 100) : 0;
              return (
                <div
                  key={d.role}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ background: colors[i % colors.length] }}
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {d.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {d._count.id}
                    </span>
                    <span className="text-[10px] text-slate-400">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Subscription Status ───────────────────────────────────────────────────────

function SubStatusCard({ data, total }: { data: any[]; total: number }) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-amber-50">
            <CalendarDays className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Subscriptions
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {total} class subscriptions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {data.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No subscriptions yet
          </p>
        ) : (
          <div className="space-y-3">
            {data.map((s: any) => {
              const c = SUB_STATUS_CFG[s.status] ?? {
                bg: "#f8fafc",
                text: "#475569",
                border: "#e2e8f0",
              };
              const pct =
                total > 0 ? Math.round((s._count.id / total) * 100) : 0;
              return (
                <div
                  key={s.status}
                  className="flex items-center justify-between gap-3"
                >
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border"
                    style={{
                      background: c.bg,
                      color: c.text,
                      borderColor: c.border,
                    }}
                  >
                    {s.status}
                  </span>
                  <div className="flex-1 mx-2">
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-900 shrink-0">
                    {s._count.id}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Recent Activity ───────────────────────────────────────────────────────────

function RecentActivity({ data }: { data: any }) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-rose-50">
            <Activity className="h-4 w-4 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-900">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Latest 5 entries per section
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <Tabs defaultValue="enrollments" className="mt-4">
          <TabsList className="h-8 bg-slate-100 gap-0 p-0.5 rounded-lg">
            {["enrollments", "orders", "users", "subscriptions"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="h-7 px-3 text-[11px] font-semibold text-slate-500 rounded-md capitalize
                  data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="enrollments" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Student
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Workshop
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Price
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.enrollments ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-xs text-slate-400 py-8"
                    >
                      No recent enrollments
                    </TableCell>
                  </TableRow>
                ) : (
                  (data.enrollments ?? []).map((e: any) => (
                    <TableRow
                      key={e.id}
                      className="border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar name={e.user?.name ?? "?"} />
                          <span className="text-xs font-semibold text-slate-900">
                            {e.user?.name ?? "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 py-2.5 max-w-[140px] truncate">
                        {e.workshop?.title ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-600 py-2.5 text-right">
                        {e.workshop?.price != null
                          ? fmtRs(e.workshop.price)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-[11px] text-slate-400 py-2.5 text-right whitespace-nowrap">
                        {e.createdAt
                          ? format(new Date(e.createdAt), "dd MMM, h:mm a")
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="orders" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Customer
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Product
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Amount
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.orders ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-xs text-slate-400 py-8"
                    >
                      No recent orders
                    </TableCell>
                  </TableRow>
                ) : (
                  (data.orders ?? []).map((o: any) => {
                    const c = STATUS_CFG[o.status] ?? STATUS_CFG.PENDING;
                    return (
                      <TableRow
                        key={o.id}
                        className="border-slate-100 hover:bg-slate-50/60 transition-colors"
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar name={o.user?.name ?? "?"} />
                            <span className="text-xs font-semibold text-slate-900">
                              {o.user?.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700">
                            {o.productType ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-emerald-600 py-2.5 text-right">
                          {fmtRs(o.amount ?? 0)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border"
                            style={{
                              background: c.bg,
                              color: c.text,
                              borderColor: c.border,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: c.dot }}
                            />
                            {o.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="users" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    User
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Phone
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Role
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Joined
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.users ?? []).map((u: any) => (
                  <TableRow
                    key={u.id}
                    className="border-slate-100 hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={u.name ?? "?"} />
                        <span className="text-xs font-semibold text-slate-900">
                          {u.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-500 py-2.5">
                      {u.phone}
                    </TableCell>
                    <TableCell className="py-2.5 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border
                        ${
                          u.role === "ADMIN"
                            ? "bg-violet-50 text-violet-700 border-violet-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-400 py-2.5 text-right whitespace-nowrap">
                      {u.createdAt
                        ? format(new Date(u.createdAt), "dd MMM yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-3">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Student
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    Class
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8">
                    City
                  </TableHead>
                  <TableHead className="text-[11px] font-semibold text-slate-500 h-8 text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data.subscriptions ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-xs text-slate-400 py-8"
                    >
                      No recent subscriptions
                    </TableCell>
                  </TableRow>
                ) : (
                  (data.subscriptions ?? []).map((s: any) => {
                    const c =
                      SUB_STATUS_CFG[s.status] ?? SUB_STATUS_CFG.CANCELLED;
                    return (
                      <TableRow
                        key={s.id}
                        className="border-slate-100 hover:bg-slate-50/60 transition-colors"
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar name={s.user?.name ?? "?"} />
                            <span className="text-xs font-semibold text-slate-900">
                              {s.user?.name ?? "—"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 py-2.5 max-w-[120px] truncate">
                          {s.class?.title ?? "—"}
                        </TableCell>
                        <TableCell className="text-[11px] text-slate-500 py-2.5">
                          {s.class?.City ? (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                              {s.class.City}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <span
                            className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border"
                            style={{
                              background: c.bg,
                              color: c.text,
                              borderColor: c.border,
                            }}
                          >
                            {s.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ─── Inner ─────────────────────────────────────────────────────────────────────

function DashboardInner({ filters }: { filters: Filters }) {
  const trpc = useTRPC();

  const formatToYMD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const now = new Date();

  const defaultStartDate = new Date();
  defaultStartDate.setMonth(now.getMonth() - 1);

  const { data, isFetching } = useSuspenseQuery(
    trpc.dashboard.getDashboardStats.queryOptions({
      startDate: formatToYMD(
        filters.startDate ? new Date(filters.startDate) : defaultStartDate,
      ),
      endDate: formatToYMD(filters.endDate ? new Date(filters.endDate) : now),
    }),
  );

  if (!data?.success)
    return (
      <div className="flex items-center justify-center py-24 text-sm text-slate-500">
        No data available for the selected period.
      </div>
    );

  const ov = data.overview;
  const sub = data.regularClasses;

  console.log(ov, "test");
  return (
    <div className="space-y-5">
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 w-fit">
          <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
          <span>Refreshing data…</span>
        </div>
      )}

      {/* Row 1 — Revenue hero + KPIs + 24h */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <RevenueCard
            total={ov.revenue.total}
            delta={ov.revenue.delta}
            previous={ov.revenue.previous}
            byType={ov.revenue.byProductType ?? []}
          />
        </div>
        <KPICard
          title="New Users"
          value={ov.totalUsers.count}
          delta={ov.totalUsers.delta}
          previous={ov.totalUsers.previous}
          icon={Users}
          accent={BRAND.blue}
        />
        <KPICard
          title="Enrollments"
          value={ov.totalEnrollments.count}
          delta={ov.totalEnrollments.delta}
          previous={ov.totalEnrollments.previous}
          icon={GraduationCap}
          accent={BRAND.violet}
        />
        <KPICard
          title="Tutorial Views"
          value={ov.totalTutorialAccess.count}
          delta={ov.totalTutorialAccess.delta}
          previous={ov.totalTutorialAccess.previous}
          icon={BookOpen}
          accent={BRAND.rose}
        />
        <KPICard
          title="Subscriptions"
          value={ov.totalSubscriptions.count}
          delta={ov.totalSubscriptions.delta}
          previous={ov.totalSubscriptions.previous}
          icon={CalendarDays}
          accent={BRAND.amber}
        />
        <KPICard
          title="Total Orders"
          value={ov.totalOrders.count}
          delta={ov.totalOrders.delta}
          previous={ov.totalOrders.previous}
          icon={ShoppingCart}
          accent={BRAND.indigo}
        />
        <KPICard
          title="Paid Orders"
          value={ov.paidOrders.count}
          delta={ov.paidOrders.delta}
          previous={ov.paidOrders.previous}
          icon={Activity}
          accent={BRAND.teal}
        />
        <Live24h data={data.last24Hours} />
      </div>

      {/* Row 2 — Time series (full width) */}
      <TimeSeriesChart data={data.timeSeries} />

      {/* Row 3 — Workshop + Order status + User roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TopWorkshopsBar data={data.workshops.topByEnrollments} />
        <OrderStatusDonut data={ov.orderStatusBreakdown as any} />
        <UserRoleCard data={ov.userRoleBreakdown as any} />
      </div>

      {/* Row 4 — Revenue breakdown + Tutorial access + City + Subs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WorkshopRevenueList data={data.workshops.revenueBreakdown} />
        <TutorialAccessList data={data.tutorials.accessBreakdown} />
        <SubStatusCard
          data={sub.statusBreakdown}
          total={ov.totalSubscriptions.count}
        />
      </div>

      {/* Row 5 — Recent activity (full width) */}
      <RecentActivity data={data.recentActivity} />
    </div>
  );
}

// ─── Shell ─────────────────────────────────────────────────────────────────────

export default function DashboardView() {
  // const [filters, setFilters] = useState<Filters>({
  //   startDate:   format(subMonths(new Date(), 1), "yyyy-MM-dd"),
  //   endDate:     format(new Date(), "yyyy-MM-dd"),
  //   granularity: "day",
  //   page:        1,
  //   limit:       10,
  // });

  const [filters, setFilters] = useDashboardUserFilters();

  const update = (p: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...p }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Platform analytics ·{" "}
              {filters.startDate &&
                format(new Date(filters.startDate), "dd MMM")}{" "}
              –{" "}
              {filters.endDate &&
                format(new Date(filters.endDate), "dd MMM yyyy")}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl bg-white/50 border border-slate-200 flex justify-between items-center p-3 sm:p-4 shadow-sm m-0">
          <h3 className="text-md  font-semibold">Choose Date</h3>
          <DatePickerWithRange />
        </div>

        {/* Content */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <span className="text-sm text-slate-500">
                  Loading analytics…
                </span>
              </div>
            </div>
          }
        >
          <DashboardInner filters={filters} />
        </Suspense>
      </div>
    </div>
  );
}
