"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useState } from 'react'

function WorkshopView({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.workshop.getWorkshopAdmin.queryOptions({ id }))

  console.log(data,"check")
  const [activeTab, setActiveTab] = useState<'details' | 'enrollments'>('details')

  const enrollmentCount = data?.enrollment?.length ?? 0
  const eventDate = data?.eventDate ? new Date(data.eventDate) : null
  const revenue = (data?.price ?? 0) * enrollmentCount

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Workshops</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{data?.title ?? 'Workshop'}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Active
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="relative h-56 bg-gray-100">
            {data?.thumbnail ? (
              <img src={data.thumbnail} alt={data.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <span className="bg-white text-gray-900 font-bold text-sm px-4 py-1.5 rounded-full shadow-md border border-gray-100">
                ₹{data?.price?.toLocaleString('en-IN') ?? '—'}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-3">{data?.title ?? '—'}</h1>
            <div className="flex flex-wrap gap-2">
              {eventDate && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  &nbsp;·&nbsp;
                  {eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              {data?.location && (
                <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {data.location.name}, {data.location.city}
                </div>
              )}
              {data?.slug && (
                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-mono">
                  /{data.slug}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Ticket Price',
              value: `₹${data?.price?.toLocaleString('en-IN') ?? '0'}`,
              icon: (
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              ),
              bg: 'bg-indigo-50',
            },
            {
              label: 'Enrollments',
              value: String(enrollmentCount),
              icon: (
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              bg: 'bg-green-50',
            },
            {
              label: 'Total Revenue',
              value: `₹${revenue.toLocaleString('en-IN')}`,
              icon: (
                <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              bg: 'bg-yellow-50',
            },
            {
              label: 'Created',
              value: data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—',
              icon: (
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
              bg: 'bg-gray-100',
            },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
              <div className={`${s.bg} p-2 rounded-lg shrink-0`}>{s.icon}</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 leading-tight truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 px-6">
            {(['details', 'enrollments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 mr-6 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {tab === 'enrollments' && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${
                    activeTab === tab ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {enrollmentCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-6 grid md:grid-cols-5 gap-8">
              <div className="md:col-span-3 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Description</p>
                  <div className="text-gray-600 leading-relaxed text-sm">
                    <div dangerouslySetInnerHTML={{__html:data?.description ?? 'No description provided.'}}/>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Workshop ID</p>
                  <code className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg inline-block border border-gray-200">{data?.id}</code>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Location ID</p>
                  <code className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg inline-block border border-gray-200">{data?.locationId}</code>
                </div>
              </div>

              {data?.location && (
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Venue</p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {data.location.image && (
                      <Image height={100} width={100} src={data.location.image} alt={data.location.name} className="w-full h-56 object-cover" />
                    )}
                    <div className="p-4 space-y-1">
                      <p className="font-semibold text-gray-900 text-sm">{data.location.name}</p>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {data.location.address}
                        {data.location.place && `, ${data.location.place}`}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {data.location.city}, {data.location.state}, {data.location.country}
                        {data.location.pincode && ` — ${data.location.pincode}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === 'enrollments' && (
            <div>
              {enrollmentCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <svg className="w-10 h-10 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-500">No enrollments yet</p>
                  <p className="text-xs text-gray-400 mt-1">Participants will appear here once they register</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Participant</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Phone</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Role</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Enrolled On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.enrollment?.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            {e.user?.avatar ? (
                              <img src={e.user.avatar} alt={e.user.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-200">
                                {e.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{e.user?.name ?? '—'}</p>
                              <p className="text-gray-400 text-xs">{e.user?.email ?? '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-gray-500 text-sm hidden md:table-cell">{e.user?.phone ?? '—'}</td>
                        <td className="px-6 py-3.5 hidden md:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            e.user?.role === 'ADMIN'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {e.user?.role ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-400 text-xs">
                          {e.createdAt
                            ? new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default WorkshopView