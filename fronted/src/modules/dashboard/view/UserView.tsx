"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "STUDENT" | "ADMIN";
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  enrollments?: { id: string; workshopId: string; createdAt: string }[];
  userSubscription?: {
    id: string;
    classId: string;
    status: string;
    createdAt: string;
  }[];
  tutorialAccess?: { id: string; tutorialId: string; createdAt: string }[];
  orders?: { id: string; amount: number; status: string; createdAt: string }[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAID: "bg-green-100 text-green-700",
  EXPIRED: "bg-red-100 text-red-600",
  FAILED: "bg-red-100 text-red-600",
  CANCELLED: "bg-yellow-100 text-yellow-700",
  REFUNDED: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-600",
  Enrolled: "bg-purple-100 text-purple-700",
  Granted: "bg-purple-100 text-purple-700",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-1 hover:shadow-md transition-shadow duration-150">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-3xl font-extrabold text-gray-900 leading-none tracking-tight">
        {value}
      </span>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      {count !== undefined && (
        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-gray-300">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9h.01M15 9h.01M9 14s1 2 3 2 3-2 3-2" />
      </svg>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-sm text-gray-900 font-semibold font-mono">
        {value}
      </span>
    </div>
  );
}

function ListItem({
  primary,
  secondary,
  status,
}: {
  primary: string;
  secondary: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
      <div>
        <p className="text-xs font-semibold text-gray-800 font-mono">
          {primary}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{secondary}</p>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

function UserView({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.getUser.queryOptions({ id }));
  console.log(data, 556);
  const user = data;
  const isAdmin = user.role === "ADMIN";
  const totalSpent = (user.orders ?? [])
    .filter((o) => o.status === "PAID")
    .reduce((s, o) => s + o.amount, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Hero Card ── */}
      <div className="relative bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-6 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-white pointer-events-none" />

        {/* Avatar */}
        <div className="relative z-10 shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-violet-100"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center border-4 border-violet-100">
              <span className="text-2xl font-bold text-white tracking-wider">
                {getInitials(user.name)}
              </span>
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
        </div>

        {/* Name / badges */}
        <div className="relative z-10 flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
            {user.name}
          </h1>
          <p className="text-sm text-gray-400 mb-3">
            {user.email || "No email set"}
          </p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${isAdmin ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
            >
              {isAdmin ? "⭐ Admin" : "🎓 Student"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              📞 {user.phone}
            </span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="relative z-10 text-right flex flex-col gap-1.5 shrink-0">
          <p className="text-xs text-gray-400">
            Joined{" "}
            <span className="text-gray-700 font-semibold">
              {formatDate(user.createdAt)}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            Last login{" "}
            <span className="text-gray-700 font-semibold">
              {formatDateTime(user.lastLoginAt)}
            </span>
          </p>
          <p className="text-xs text-gray-400">
            Updated{" "}
            <span className="text-gray-700 font-semibold">
              {formatDate(user.updatedAt)}
            </span>
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Enrollments"
          value={user.enrollments?.length ?? 0}
          sub="workshops joined"
        />
        <StatCard
          label="Subscriptions"
          value={user.userSubscription?.length ?? 0}
          sub="active classes"
        />
        <StatCard
          label="Tutorial Access"
          value={user.tutorialAccess?.length ?? 0}
          sub="tutorials unlocked"
        />
        <StatCard
          label="Total Spent"
          value={`₹${totalSpent.toLocaleString("en-IN")}`}
          sub={`${user.orders?.length ?? 0} orders total`}
        />
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Account Details */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SectionHeader title="Account Details" />
          <div className="px-5 py-4">
            <InfoRow label="User ID" value={`${user.id.slice(0, 18)}…`} />
            <InfoRow label="Role" value={user.role} />
            <InfoRow label="Phone" value={user.phone} />
            <InfoRow label="Email" value={user.email || "—"} />
            <InfoRow label="Created" value={formatDateTime(user.createdAt)} />
            <InfoRow
              label="Last Login"
              value={formatDateTime(user.lastLoginAt)}
            />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SectionHeader title="Orders" count={user.orders?.length ?? 0} />
          <div className="px-5 py-4">
            {(user.orders?.length ?? 0) === 0 ? (
              <EmptyState message="No orders yet" />
            ) : (
              <div className="flex flex-col gap-2.5">
                {user.orders!.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl"
                  >
                    <div>
                      <p className="text-base font-extrabold text-gray-900">
                        ₹{o.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <StatusPill status={o.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enrollments */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SectionHeader
            title="Workshop Enrollments"
            count={user.enrollments?.length ?? 0}
          />
          <div className="px-5 py-4">
            {(user.enrollments?.length ?? 0) === 0 ? (
              <EmptyState message="No workshop enrollments" />
            ) : (
              <div className="flex flex-col gap-2.5">
                {user.enrollments!.map((e) => (
                  <ListItem
                    key={e.id}
                    primary={`${e.workshop&&e.workshop.title.slice(0, 22)}…`}
                    secondary={formatDate(e.createdAt)}
                    status="Enrolled"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <SectionHeader
            title=" Regular Class Subscriptions"
            count={user.userSubscription?.length ?? 0}
          />
          <div className="px-5 py-4">
            {(user.userSubscription?.length ?? 0) === 0 ? (
              <EmptyState message="No subscriptions" />
            ) : (
              <div className="flex flex-col gap-2.5">
                {user.userSubscription!.map((s) => {
                  console.log(s, 456);
                  const status =
                    new Date() > new Date(s.class.endDate)
                      ? "EXPIRED"
                      : "ACTIVE";
                  return (
                    <ListItem
                      key={s.id}
                      primary={`${s.class.title.slice(0, 22)}…`}
                      secondary={formatDate(s.createdAt)}
                      status={status}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tutorial Access — full width */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden lg:col-span-2">
          <SectionHeader
            title="Tutorial Access"
            count={user.tutorialAccess?.length ?? 0}
          />
          <div className="px-5 py-4">
            {(user.tutorialAccess?.length ?? 0) === 0 ? (
              <EmptyState message="No tutorial access granted" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {user.tutorialAccess!.map((t) => (
                  <ListItem
                    key={t.id}
                    primary={`${t.tutorialId.slice(0, 22)}…`}
                    secondary={`Granted ${formatDate(t.createdAt)}`}
                    status="Granted"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserView;
