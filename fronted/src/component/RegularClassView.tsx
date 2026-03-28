"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  MapPin, Calendar, DollarSign, Users, Tag, ToggleRight,
  ToggleLeft, Mail, Phone, Shield, Clock, ChevronRight,
  ImageIcon, Hash
} from 'lucide-react'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar?: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

type Subscription = {
  id: string
  classId: string
  userId: string
  status: string
  createdAt: string
  user: User
  class?:{
    endDate?:string
  }
}

type RegularClassAdmin = {
  id: string
  title: string
  description: string
  thumbnail: string
  City: string
  price: number
  isActive: boolean
  perfectFor: { tag: string }[]
  startDate: string
  endDate: string
  createdAt: string
  subscriptions: Subscription[]
}

function StatCard({ icon: Icon, label, value, accent }: {
  icon: React.ElementType
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5 ${accent ?? 'bg-slate-900'}`} />
      <div className={`inline-flex items-center justify-center size-10 rounded-xl mb-3 ${accent ?? 'bg-slate-100'} bg-opacity-10`}>
        <Icon className="size-5 text-slate-700" />
      </div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xl font-bold text-slate-900 truncate">{value}</p>
    </div>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
      active
        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
        : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
    }`}>
      <span className={`size-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function SubscriptionRow({ sub, index }: { sub: Subscription; index: number }) {
  const statusColor: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    cancelled: 'bg-red-50 text-red-600 ring-red-200',
    expired: 'bg-slate-100 text-slate-500 ring-slate-200',
  }
  const isExpired =
  sub.class?.endDate &&
  new Date() > new Date(sub.class.endDate);
  
  console.log(isExpired,sub.class?.endDate,"singhsingh")
  const status=isExpired ? "EXPIRED":"ACTIVE"
  const color = statusColor[status.toLowerCase()] ?? 'bg-slate-100 text-slate-500 ring-slate-200'
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
      <span className="text-xs font-mono text-slate-300 w-5 shrink-0 text-right">{index + 1}</span>
      <div className="size-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0 overflow-hidden">
        {sub.user.avatar
          ? <img src={sub.user.avatar} alt={sub.user.name} className="size-full object-cover" />
          : <span className="text-sm font-bold text-slate-500">{sub.user.name[0]?.toUpperCase()}</span>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{sub.user.name}</p>
        <p className="text-xs text-slate-400 truncate">{sub.user.email}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
        <Phone className="size-3" />
        {sub.user.phone}
      </div>
      <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${color}`}>
        {status}
      </span>
      <span className="hidden lg:block text-xs text-slate-400 shrink-0">
        {format(new Date(sub.createdAt), 'MMM d, yyyy')}
      </span>
      <Link href={`/dashboard/users/${sub.userId}`}>
        <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
      </Link>  
      
    </div>
  )
}

function RegularClassView({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.regularClasses.getClassAdmin.queryOptions({ id }))
  const cls = data
  const [imgError, setImgError] = useState(false)

  const startDate = format(new Date(cls.startDate), 'MMM d, yyyy')
  const endDate = format(new Date(cls.endDate), 'MMM d, yyyy')
  const createdAt = format(new Date(cls.createdAt), 'MMM d, yyyy')

  const activeSubscriptions = cls.subscriptions.filter(s => s.status.toLowerCase() === 'active').length

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-slate-900">
        {!imgError ? (
          <img
            src={cls.thumbnail}
            alt={cls.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="size-16 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end justify-between gap-4 max-w-6xl mx-auto">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge active={cls.isActive} />
                <span className="text-slate-400 text-xs font-mono">#{cls.id.slice(0, 8)}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight truncate">{cls.title}</h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-slate-300 text-sm">
                <MapPin className="size-4 shrink-0" />
                <span>{cls.City}</span>
              </div>
            </div>
            <div className="shrink-0 text-right hidden sm:block">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
              <p className="text-3xl font-black text-white">₹{cls.price.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Enrolled" value={cls.subscriptions.length} accent="bg-blue-200" />
          <StatCard icon={ToggleRight} label="Active Members" value={activeSubscriptions} accent="bg-emerald-200" />
          <StatCard icon={DollarSign} label="Price" value={`₹${cls.price.toFixed(2)}`} accent="bg-amber-200" />
          <StatCard icon={Calendar} label="Duration" value={`${Math.ceil((new Date(cls.endDate).getTime() - new Date(cls.startDate).getTime()) / (1000 * 60 * 60 * 24))}d`} accent="bg-rose-200" />
        </div>

        {/* Two-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Details */}
          <div className="lg:col-span-1 space-y-5">

            {/* About */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">About</h3>
              <div className="text-sm text-slate-600 leading-relaxed">
                <div dangerouslySetInnerHTML={{__html:cls.description}}/>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Schedule</h3>
              <div className="space-y-3">
                {[
                  { label: 'Start Date', value: startDate, icon: Calendar },
                  { label: 'End Date', value: endDate, icon: Calendar },
                  { label: 'Created', value: createdAt, icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {cls.perfectFor?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {cls.perfectFor.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      <Tag className="size-3 text-slate-400" />
                      {t.name}
                      {/* {typeof t === 'string' ? t : (t as any).tag ?? t} */}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Subscriptions Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Enrolled Students</h3>
                <p className="text-xs text-slate-400 mt-0.5">{cls._count.subscriptions} total registrations</p>
              </div>
              <span className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">
                {cls.subscriptions.length}
              </span>
            </div>

            {cls.subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <Users className="size-10 mb-3 opacity-30" />
                <p className="text-sm font-medium">No students enrolled yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-[520px] overflow-y-auto">
                {cls.subscriptions.map((sub, i) => (
                  <SubscriptionRow key={sub.id} sub={sub} index={i} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default RegularClassView