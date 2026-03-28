"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Play, Clock, IndianRupee, BookOpen, Eye, EyeOff, ChevronRight, Film } from 'lucide-react'

function TutorialViewDashboard({ id }: { id: string }) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.tutorials.getTutorialAdmin.queryOptions({ id }))
  const [activeVideo, setActiveVideo] = useState(data.video[0] ?? null)
  const [isPlaying, setIsPlaying] = useState(false)

  const R2_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? ''
  const videoSrc = activeVideo ? `${R2_URL}/${activeVideo.videoKey}` : ''

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${data.isPublished ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                {data.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {data.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="text-gray-400 text-xs">ID: {data.id.slice(0, 8)}…</span>
            </div>
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900 leading-tight mb-2">
              {data.title}
            </h1>
            <p className="text-gray-400 text-sm">
              Created {new Date(data.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Stats pills — row on mobile, column on sm+ */}
          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm">
              <IndianRupee className="w-4 h-4 text-violet-500 shrink-0" />
              <span className="text-gray-900 font-bold text-base sm:text-lg">{data.price.toLocaleString('en-IN')}</span>
              <span className="text-gray-400 text-xs sm:text-sm">/ course</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm">
              <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="text-gray-900 font-semibold text-sm sm:text-base">{data.duration} min</span>
              <span className="text-gray-400 text-xs sm:text-sm">duration</span>
            </div>
          </div>
        </div>

        {/* ── Main grid: 1 col → 3 col at lg ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* ── Left 2/3: Player + Now Playing + Playlist ── */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">

            {/* Video Player */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-lg">
              {activeVideo ? (
                <video
                  key={videoSrc}
                  src={videoSrc}
                  controls
                  poster={data.thumbnail}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Film className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No video selected</p>
                  </div>
                </div>
              )}
              {!isPlaying && activeVideo && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              )}
            </div>

            {/* Now Playing bar */}
            {activeVideo && (
              <div className="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between shadow-sm gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Now Playing</p>
                  <p className="text-gray-900 font-semibold truncate">{activeVideo.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 mb-1">Size</p>
                  <p className="text-gray-600 font-medium">{activeVideo.size} MB</p>
                </div>
              </div>
            )}

            {/* Playlist */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-500 shrink-0" />
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Course Content</h2>
                <span className="ml-auto text-xs text-gray-400 shrink-0">
                  {data.video.length} lesson{data.video.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {data.video.map((vid) => {
                  const isActive = activeVideo?.id === vid.id
                  return (
                    <button
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 text-left transition-all duration-200 border-l-2 ${isActive ? 'bg-violet-50 border-violet-500' : 'hover:bg-gray-50 active:bg-gray-100 border-transparent'}`}
                    >
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-violet-600' : 'bg-gray-100'}`}>
                        {isActive ? (
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
                        ) : (
                          <span className="text-gray-500 text-xs sm:text-sm font-semibold">{vid.order}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate text-sm sm:text-base ${isActive ? 'text-violet-700' : 'text-gray-700'}`}>
                          {vid.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{vid.size} MB</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-gray-300'}`} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right 1/3: Thumbnail + Description + Details ── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Thumbnail — hidden on mobile (poster in player is enough) */}
            <div className="hidden sm:block rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="relative">
                <img
                  src={data.thumbnail}
                  alt={data.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                    Thumbnail Preview
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Description</h2>
              </div>
              <div
                className="px-4 sm:px-5 py-4 sm:py-5 prose prose-sm max-w-none
                  prose-headings:text-gray-800 prose-headings:font-semibold
                  prose-p:text-gray-500 prose-p:leading-relaxed
                  prose-h2:text-base prose-h2:mb-2 prose-h2:mt-4
                  prose-p:mb-2"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
                
            {/* Details */}
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-4 sm:py-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Details</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { label: 'Tutorial ID', value: data.id.slice(0, 16) + '…' },
                  { label: 'Videos', value: `${data.video.length} lesson${data.video.length !== 1 ? 's' : ''}` },
                  { label: 'Duration', value: `${data.duration} minutes` },
                  { label: 'Price', value: `₹${data.price.toLocaleString('en-IN')}` },
                  { label: 'Status', value: data.isPublished ? 'Published' : 'Draft' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-gray-400 text-sm shrink-0">{label}</span>
                    <span className="text-gray-700 text-sm font-medium text-right truncate">{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TutorialViewDashboard