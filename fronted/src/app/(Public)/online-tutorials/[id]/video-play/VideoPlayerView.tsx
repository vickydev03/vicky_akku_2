"use client";
import Navbar from "@/component/Navbar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState, useCallback } from "react";

interface Video {
  id: string;
  tutorialId: string;
  title: string;
  videoKey: string;
  size: number;
  duration: number;
  order: number;
  createdAt: string;
}

interface Tutorial {
  title: string;
  thumbnail: string;
}

interface TutorialResponse {
  videos: Video[];
  tutorial: Tutorial;
}

const R2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

/* ─── Helpers ──────────────────────────────────────────── */
function fmtBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDuration(secs: number) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ─── Plyr injection ────────────────────────────────────── */
function usePlyr(videoEl: HTMLVideoElement | null, src: string) {
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoEl) return;

    const injectCSS = () => {
      if (!document.querySelector('link[href*="plyr"]')) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = "https://cdn.plyr.io/3.7.8/plyr.css";
        document.head.appendChild(l);
      }
      if (!document.querySelector("#plyr-theme")) {
        const s = document.createElement("style");
        s.id = "plyr-theme";
        s.textContent = `
          :root {
            --plyr-color-main: #e8a0b0;
            --plyr-range-fill-background: #e8a0b0;
            --plyr-video-control-color: #fff;
            --plyr-video-control-color-hover: #e8a0b0;
            --plyr-control-icon-size: 16px;
            --plyr-font-size-base: 11px;
            --plyr-control-radius: 4px;
            --plyr-video-controls-background: linear-gradient(transparent, rgba(0,0,0,0.85));
          }
          .plyr--video .plyr__controls { padding: 12px 16px 14px; gap: 8px; }
          .plyr--full-ui input[type=range] { color: #e8a0b0; }
          .plyr__progress__buffer { color: rgba(232,160,176,0.2); }
          .plyr__menu__container {
            background: rgba(10,6,12,0.97);
            border: 1px solid rgba(232,160,176,0.15);
            border-radius: 8px;
            backdrop-filter: blur(20px);
          }
          .plyr__menu__container .plyr__control { color: rgba(255,255,255,0.75); }
          .plyr__menu__container .plyr__control--back { color: #e8a0b0; }
          .plyr--video { border-radius: 0; }
        `;
        document.head.appendChild(s);
      }
    };

    const init = async () => {
      injectCSS();
      if (!window.Plyr) {
        await new Promise<void>((res, rej) => {
          const sc = document.createElement("script");
          sc.src = "https://cdn.plyr.io/3.7.8/plyr.polyfilled.js";
          sc.onload = () => res();
          sc.onerror = () => rej();
          document.head.appendChild(sc);
        });
      }
      if (playerRef.current) playerRef.current.destroy();
      playerRef.current = new (window as any).Plyr(videoEl, {
        controls: ["play-large", "play", "progress", "current-time", "duration", "mute", "volume", "settings", "pip", "fullscreen"],
        settings: ["quality", "speed"],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: false },
      });
    };

    init().catch(console.error);
    return () => { playerRef.current?.destroy(); playerRef.current = null; };
  }, [videoEl]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p || !src) return;
    p.source = { type: "video", sources: [{ src, type: "video/mp4" }] };
  }, [src]);
}

/* ─── Animated EQ bars ──────────────────────────────────── */
function EqBars() {
  return (
    <span className="flex items-end gap-[2px] h-3 w-4">
      {[0.1, 0.25, 0.15].map((delay, i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm bg-rose-300"
          style={{ animation: `eq 0.8s ease-in-out ${delay}s infinite`, height: "100%" }}
        />
      ))}
    </span>
  );
}

/* ─── Lesson row ────────────────────────────────────────── */
function LessonRow({
  video, index, isActive, isCompleted, onClick,
}: {
  video: Video; index: number; isActive: boolean; isCompleted: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 flex items-center gap-3 group
        transition-all duration-200 border-b border-white/[0.04] last:border-0
        ${isActive ? "bg-rose-400/10" : "hover:bg-white/[0.03]"}
      `}
    >
      {/* number / state indicator */}
      <div className={`
        shrink-0 w-7 h-7 rounded-full flex items-center justify-center
        transition-all duration-200 text-[10px] font-bold
        ${isActive
          ? "bg-rose-400/20 border border-rose-400/50"
          : isCompleted
          ? "bg-rose-400/10 border border-rose-400/20"
          : "bg-white/[0.04] border border-white/10"
        }
      `}>
        {isActive ? <EqBars /> : isCompleted ? (
          <svg width="12" height="12" fill="none" viewBox="0 0 14 14">
            <path d="M2.5 7l3.5 3.5 5.5-6.5" stroke="#e8a0b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="text-white/30">{index + 1}</span>
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium leading-tight truncate transition-colors duration-150 ${isActive ? "text-rose-300" : "text-white/75 group-hover:text-white/90"}`}>
          {video.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {video.duration > 0 && (
            <span className="text-[10px] text-white/30 tabular-nums">{fmtDuration(video.duration)}</span>
          )}
          <span className="text-[10px] text-white/20">{fmtBytes(video.size)}</span>
        </div>
      </div>

      {/* arrow */}
      <svg
        width="12" height="12" fill="none" viewBox="0 0 14 14"
        className="shrink-0 text-rose-300 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"
      >
        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ─── Main component ────────────────────────────────────── */
function VideoPlayerView({ tutorialId, userId }: { userId: string; tutorialId: string }) {
  const trpc = useTRPC();
  const { data: datas,error } = useSuspenseQuery(
    trpc.tutorials.playVideos.queryOptions({ tutorialId, userId })
  );

  const data = datas as TutorialResponse;
  const sortedVideos = [...data.videos].sort((a, b) => a.order - b.order);

  const [activeIdx, setActiveIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const activeVideo = sortedVideos[activeIdx];
  const activeSrc = activeVideo ? `${R2}/${activeVideo.videoKey}` : "";

  const callbackRef = useCallback((el: HTMLVideoElement | null) => setVideoEl(el), []);
  usePlyr(videoEl, activeSrc);

  const selectLesson = (idx: number) => {
    if (activeIdx !== idx) {
      setCompleted(prev => new Set([...prev, sortedVideos[activeIdx].id]));
    }
    setActiveIdx(idx);
  };

  const completedCount = completed.size;
  const progress = sortedVideos.length ? Math.round((completedCount / sortedVideos.length) * 100) : 0;

  
  return (
    <div className="bg-hero min-h-screen w-full overflow-hidden relative">
      {/* Noise texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

      {/* Navbar */}
      <div className="absolute z-50 w-full top-5">
        <Navbar />
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4 md:px-8 max-w-screen-xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 bg-rose-400/60" />
            <p className="text-rose-300/70 text-[10px] uppercase tracking-[0.25em] font-semibold">Course</p>
          </div>
          <h1 className="font-passion-one text-[#977dae] text-4xl md:text-6xl  uppercase tracking-wider leading-none">
            {data.tutorial.title}
          </h1>

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3 max-w-sm">
            <div className="flex-1 h-[2px] rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#e8a0b0,#c06070)" }}
              />
            </div>
            <span className="text-[#977dae] text-[10px] tabular-nums shrink-0 ">
              {completedCount}/{sortedVideos.length} done
            </span>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-0 rounded-xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/60">

          {/* LEFT — video + controls */}
          {/* LEFT — video + controls */}
<div className="flex flex-col bg-black/60 backdrop-blur-2xl">
  
  {/* Added 'relative' and ensured Plyr takes up full height */}
  <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
    <div className="w-full h-full [&>.plyr]:h-full [&>.plyr]:w-full"> 
      <video
        ref={callbackRef}
        className="max-w-full max-h-full w-full h-full object-contain"
        playsInline
        src={activeSrc}
      />
    </div>
  </div>
  
  {/* ... rest of code */}
</div>

          {/* RIGHT — lesson list */}
          <div className="flex flex-col border-l border-white/[0.07] bg-black/50 backdrop-blur-2xl">
            {/* list header */}
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between shrink-0">
              <p className="text-[10px] text-white/35 uppercase tracking-[0.2em] font-semibold">Lessons</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-400/10 text-rose-300/70">
                {sortedVideos.length}
              </span>
            </div>

            {/* scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain" style={{ maxHeight: "calc(9/16 * (100vw - 340px) + 120px)", minHeight: "260px" }}>
              {sortedVideos.map((v, i) => (
                <LessonRow
                  key={v.id}
                  video={v}
                  index={i}
                  isActive={i === activeIdx}
                  isCompleted={completed.has(v.id)}
                  onClick={() => selectLesson(i)}
                />
              ))}
            </div>

            {/* thumbnail */}
            {data.tutorial.thumbnail && (
              <div className="p-3 border-t border-white/[0.06] shrink-0">
                <img
                  src={data.tutorial.thumbnail}
                  alt={data.tutorial.title}
                  className="w-full rounded-lg object-cover opacity-50"
                  style={{ aspectRatio: "16/9" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EQ keyframe */}
      <style>{`
        @keyframes eq {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default VideoPlayerView;