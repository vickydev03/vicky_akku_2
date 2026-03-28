"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  UploadCloud,
  FileVideo,
  X,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Film,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadStatus =
  | "queued"
  | "uploading"
  | "paused"
  | "done"
  | "error"
  | "cancelled";

interface SignedUrlResult {
  uploadUrl: string;
  key: string;
}

interface SignedUrlResponse {
  files: SignedUrlResult[];
}

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number; // 0–100
  uploadedBytes: number;
  speed: number; // bytes/sec
  eta: number; // seconds remaining
  errorMessage?: string;
  key?: string;
  startedAt?: number;
  // XHR handle for pause/cancel
  xhr?: XMLHttpRequest;
  // Chunk tracking for resumable uploads
  chunkOffset: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const formatTime = (secs: number): string => {
  if (!isFinite(secs) || secs <= 0) return "—";
  if (secs < 60) return `${Math.round(secs)}s`;
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return `${m}m ${s}s`;
};

const generateId = () => Math.random().toString(36).slice(2, 10);

const getFileExtension = (name: string) =>
  name.split(".").pop()?.toUpperCase() ?? "FILE";

// ─── Single Upload XHR (presigned PUT) ───────────────────────────────────────

function uploadFileXHR(
  file: File,
  uploadUrl: string,
  offset: number,
  onProgress: (loaded: number, speed: number, eta: number) => void,
  onDone: () => void,
  onError: (msg: string) => void
): XMLHttpRequest {
  const xhr = new XMLHttpRequest();
  let lastLoaded = 0;
  let lastTime = Date.now();

  xhr.upload.addEventListener("progress", (e) => {
    if (!e.lengthComputable) return;
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    const loaded = offset + e.loaded;
    const speed = dt > 0 ? (e.loaded - lastLoaded) / dt : 0;
    const remaining = file.size - loaded;
    const eta = speed > 0 ? remaining / speed : Infinity;
    lastLoaded = e.loaded;
    lastTime = now;
    onProgress(loaded, speed, eta);
  });

  xhr.addEventListener("load", () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      onDone();
    } else {
      onError(`Server responded with ${xhr.status}`);
    }
  });

  xhr.addEventListener("error", () => onError("Network error occurred"));
  xhr.addEventListener("abort", () => {
    // Intentional pause/cancel — handled externally
  });

  const blob = file.slice(offset);
  xhr.open("PUT", uploadUrl);
  xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
  if (offset > 0) {
    xhr.setRequestHeader(
      "Content-Range",
      `bytes ${offset}-${file.size - 1}/${file.size}`
    );
  }
  xhr.send(blob);
  return xhr;
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar = ({
  progress,
  status,
}: {
  progress: number;
  status: UploadStatus;
}) => {
  const colorMap: Record<UploadStatus, string> = {
    queued: "bg-slate-300",
    uploading: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
    paused: "bg-amber-400",
    done: "bg-emerald-500",
    error: "bg-red-500",
    cancelled: "bg-slate-300",
  };

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorMap[status]} ${
          status === "uploading" ? "animate-pulse" : ""
        }`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
};

// ─── Upload Card ──────────────────────────────────────────────────────────────

const UploadCard = ({
  item,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onRemove,
}: {
  item: UploadItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  const ext = getFileExtension(item.file.name);
  const isActive = item.status === "uploading";
  const isPaused = item.status === "paused";
  const isDone = item.status === "done";
  const isError = item.status === "error";
  const isQueued = item.status === "queued";
  const isCancelled = item.status === "cancelled";

  const statusLabel: Record<UploadStatus, string> = {
    queued: "Queued",
    uploading: "Uploading…",
    paused: "Paused",
    done: "Complete",
    error: "Failed",
    cancelled: "Cancelled",
  };

  const statusColor: Record<UploadStatus, string> = {
    queued: "text-slate-400",
    uploading: "text-violet-600",
    paused: "text-amber-500",
    done: "text-emerald-600",
    error: "text-red-500",
    cancelled: "text-slate-400",
  };

  return (
    <li
      className={`
        group relative flex flex-col gap-2 p-4 rounded-2xl border
        transition-all duration-200
        ${isDone ? "bg-emerald-50/60 border-emerald-100" : ""}
        ${isError ? "bg-red-50/60 border-red-100" : ""}
        ${isActive ? "bg-violet-50/40 border-violet-100 shadow-sm shadow-violet-100" : ""}
        ${isPaused ? "bg-amber-50/40 border-amber-100" : ""}
        ${isQueued || isCancelled ? "bg-slate-50 border-slate-100" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        {/* File type badge */}
        <div
          className={`
          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold tracking-wide
          ${isDone ? "bg-emerald-100 text-emerald-700" : ""}
          ${isError ? "bg-red-100 text-red-600" : ""}
          ${isActive ? "bg-violet-100 text-violet-700" : ""}
          ${isPaused ? "bg-amber-100 text-amber-700" : ""}
          ${isQueued || isCancelled ? "bg-slate-100 text-slate-500" : ""}
        `}
        >
          {ext}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
            {item.file.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-slate-400">
              {formatBytes(item.file.size)}
            </span>
            {isActive && item.speed > 0 && (
              <>
                <span className="text-slate-200">·</span>
                <span className="text-[11px] text-violet-500 font-medium flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  {formatBytes(item.speed)}/s
                </span>
                <span className="text-slate-200">·</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.eta)}
                </span>
              </>
            )}
            {isPaused && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <WifiOff className="w-3 h-3" />
                {formatBytes(item.uploadedBytes)} uploaded
              </span>
            )}
          </div>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[11px] font-semibold ${statusColor[item.status]}`}>
            {statusLabel[item.status]}
          </span>

          {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {isError && <AlertCircle className="w-4 h-4 text-red-500" />}

          {isActive && (
            <button
              type="button"
              onClick={() => onPause(item.id)}
              className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-500 hover:bg-amber-50 transition-colors"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              onClick={() => onResume(item.id)}
              className="p-1.5 rounded-lg bg-white border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
              title="Resume"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          {isError && (
            <button
              type="button"
              onClick={() => onRetry(item.id)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Retry"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {(isActive || isPaused || isQueued) && (
            <button
              type="button"
              onClick={() => onCancel(item.id)}
              className="p-1.5 rounded-lg bg-white border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {(isDone || isError || isCancelled) && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:bg-slate-50 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {!isDone && !isCancelled && (
        <div className="space-y-1">
          <ProgressBar progress={item.progress} status={item.status} />
          {(isActive || isPaused) && (
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-400">
                {formatBytes(item.uploadedBytes)} / {formatBytes(item.file.size)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {Math.round(item.progress)}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {isError && item.errorMessage && (
        <p className="text-[11px] text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
          {item.errorMessage}
        </p>
      )}
    </li>
  );
};

// ─── Drop Zone ────────────────────────────────────────────────────────────────

const DropZone = ({
  onFiles,
  isUploading,
}: {
  onFiles: (files: FileList) => void;
  isUploading: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-10
        flex flex-col items-center justify-center gap-4 select-none
        transition-all duration-300
        ${
          isDragging
            ? "border-violet-400 bg-violet-50 scale-[1.01]"
            : "border-slate-200 hover:border-violet-300 hover:bg-slate-50/80"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
        hidden
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      <div
        className={`
        w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
        ${isDragging ? "bg-violet-100 rotate-3" : "bg-slate-100"}
      `}
      >
        {isDragging ? (
          <UploadCloud className="w-8 h-8 text-violet-500" />
        ) : (
          <Film className="w-8 h-8 text-slate-400" />
        )}
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-slate-700">
          {isDragging ? "Release to add files" : "Drop videos here"}
        </p>
        <p className="text-xs text-slate-400">
          or{" "}
          <span className="text-violet-600 font-semibold underline underline-offset-2">
            browse files
          </span>
        </p>
        <p className="text-[11px] text-slate-300 pt-1">
          MP4 · MOV · AVI · MKV · WEBM · up to 200 MB each
        </p>
      </div>
    </div>
  );
};

// ─── Summary Bar ──────────────────────────────────────────────────────────────

const SummaryBar = ({ items }: { items: UploadItem[] }) => {
  const done = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const errors = items.filter((i) => i.status === "error").length;
  const active = items.filter((i) => i.status === "uploading").length;
  const totalBytes = items.reduce((a, b) => a + b.file.size, 0);
  const uploadedBytes = items.reduce((a, b) => a + b.uploadedBytes, 0);
  const overallProgress = totalBytes > 0 ? (uploadedBytes / totalBytes) * 100 : 0;

  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <span className="text-slate-600 font-semibold">
            {done}/{total} files
          </span>
          {active > 0 && (
            <span className="text-violet-600 font-semibold">
              {active} uploading
            </span>
          )}
          {errors > 0 && (
            <span className="text-red-500 font-semibold">{errors} failed</span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Completed Side Panel ─────────────────────────────────────────────────────

const CompletedPanel = ({ items }: { items: UploadItem[] }) => {
  const done = items.filter((i) => i.status === "done");
  const [expanded, setExpanded] = useState(true);

  if (done.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <FileVideo className="w-8 h-8 text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-400">
            No uploads yet
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Uploaded videos will appear here
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-3 h-full">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between px-1 group"
      >
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Uploaded ({done.length})
        </h3>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <ul className="space-y-2 overflow-y-auto flex-1">
          {done.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {item.file.name}
                </p>
                <p className="text-[10px] text-slate-400">{formatBytes(item.file.size)}</p>
              </div>
              {item.key && (
                <span
                  className="text-[9px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full truncate max-w-[80px]"
                  title={item.key}
                >
                  {item.key.split("/").pop()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const UploadManager = () => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const xhrMapRef = useRef<Map<string, XMLHttpRequest>>(new Map());

  const trpc = useTRPC();
  const getSignedUrls = useMutation(
    trpc.tutorials.getSignedUrl.mutationOptions()
  );

  // ── Update helper ──
  const updateItem = useCallback(
    (id: string, patch: Partial<UploadItem>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    []
  );

  // ── Start upload for one item ──
  const startUpload = useCallback(
    (item: UploadItem, uploadUrl: string, key: string, offset = 0) => {
      updateItem(item.id, {
        status: "uploading",
        startedAt: Date.now(),
        key,
        chunkOffset: offset,
      });

      const xhr = uploadFileXHR(
        item.file,
        uploadUrl,
        offset,
        (loaded, speed, eta) => {
          const progress = (loaded / item.file.size) * 100;
          updateItem(item.id, {
            uploadedBytes: loaded,
            progress,
            speed,
            eta,
          });
        },
        () => {
          xhrMapRef.current.delete(item.id);
          updateItem(item.id, {
            status: "done",
            progress: 100,
            uploadedBytes: item.file.size,
            speed: 0,
            eta: 0,
          });
        },
        (msg) => {
          xhrMapRef.current.delete(item.id);
          updateItem(item.id, {
            status: "error",
            errorMessage: msg,
            speed: 0,
          });
        }
      );

      xhrMapRef.current.set(item.id, xhr);
      updateItem(item.id, { xhr });
    },
    [updateItem]
  );

  // ── Add files ──
  const addFiles = useCallback(
    async (fileList: FileList) => {
      setGlobalError(null);
      const incoming = Array.from(fileList);
      const existingNames = new Set(
        items.map((i) => `${i.file.name}-${i.file.size}`)
      );
      const newFiles = incoming.filter(
        (f) => !existingNames.has(`${f.name}-${f.size}`)
      );
      if (newFiles.length === 0) return;

      const newItems: UploadItem[] = newFiles.map((file) => ({
        id: generateId(),
        file,
        status: "queued",
        progress: 0,
        uploadedBytes: 0,
        speed: 0,
        eta: Infinity,
        chunkOffset: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Get signed URLs
      let urls: SignedUrlResult[];
      try {
        const payload = newFiles.map((f) => ({
          name: f.name,
          type: f.type,
          size: f.size,
        }));
        const res = await getSignedUrls.mutateAsync(payload);
        urls = res.files;
      } catch (err: any) {
        newItems.forEach((item) =>
          updateItem(item.id, {
            status: "error",
            errorMessage: "Failed to get upload URL. Please retry.",
          })
        );
        setGlobalError("Could not connect to the server. Check your connection.");
        return;
      }

      // Start each upload
      newItems.forEach((item, idx) => {
        const urlResult = urls[idx];
        if (!urlResult) {
          updateItem(item.id, {
            status: "error",
            errorMessage: "No upload URL returned for this file.",
          });
          return;
        }
        startUpload(item, urlResult.uploadUrl, urlResult.key);
      });
    },
    [items, getSignedUrls, startUpload, updateItem]
  );
  
  // ── Pause ──
  const handlePause = useCallback((id: string) => {
    const xhr = xhrMapRef.current.get(id);
    if (xhr) {
      xhr.abort();
      xhrMapRef.current.delete(id);
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "paused", speed: 0 } : item
      )
    );
  }, []);

  // ── Resume ──
  const handleResume = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item || !item.key) return;

      // Re-request signed URL for resume
      let urls: SignedUrlResult[];
      try {
        const res = await getSignedUrls.mutateAsync([
          { name: item.file.name, type: item.file.type, size: item.file.size },
        ]);
        urls = res.files;
      } catch {
        updateItem(id, {
          status: "error",
          errorMessage: "Failed to refresh upload URL.",
        });
        return;
      }

      startUpload(item, urls[0].uploadUrl, urls[0].key, item.uploadedBytes);
    },
    [items, getSignedUrls, startUpload, updateItem]
  );

  // ── Retry ──
  const handleRetry = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      updateItem(id, {
        status: "queued",
        progress: 0,
        uploadedBytes: 0,
        errorMessage: undefined,
        chunkOffset: 0,
      });

      let urls: SignedUrlResult[];
      try {
        const res = await getSignedUrls.mutateAsync([
          { name: item.file.name, type: item.file.type, size: item.file.size },
        ]);
        urls = res.files;
      } catch {
        updateItem(id, {
          status: "error",
          errorMessage: "Failed to get upload URL.",
        });
        return;
      }

      startUpload(item, urls[0].uploadUrl, urls[0].key, 0);
    },
    [items, getSignedUrls, startUpload, updateItem]
  );

  // ── Cancel ──
  const handleCancel = useCallback((id: string) => {
    const xhr = xhrMapRef.current.get(id);
    if (xhr) {
      xhr.abort();
      xhrMapRef.current.delete(id);
    }
    updateItem(id, {
      status: "cancelled",
      speed: 0,
      progress: 0,
      uploadedBytes: 0,
    });
  }, [updateItem]);

  // ── Remove ──
  const handleRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // ── Pause all / Resume all ──
  const handlePauseAll = () => {
    items
      .filter((i) => i.status === "uploading")
      .forEach((i) => handlePause(i.id));
  };

  const handleResumeAll = async () => {
    for (const item of items.filter((i) => i.status === "paused")) {
      await handleResume(item.id);
    }
  };

  // ── Cleanup XHRs on unmount ──
  useEffect(() => {
    return () => {
      xhrMapRef.current.forEach((xhr) => xhr.abort());
    };
  }, []);

  const activeItems = items.filter(
    (i) => !["done", "cancelled"].includes(i.status)
  );
  const hasUploading = items.some((i) => i.status === "uploading");
  const hasPaused = items.some((i) => i.status === "paused");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Upload Panel */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Upload Videos
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload to your media library
              </p>
            </div>

            {/* Bulk controls */}
            {(hasUploading || hasPaused) && (
              <div className="flex gap-2">
                {hasUploading && (
                  <button
                    type="button"
                    onClick={handlePauseAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <Pause className="w-3 h-3" />
                    Pause All
                  </button>
                )}
                {hasPaused && (
                  <button
                    type="button"
                    onClick={handleResumeAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Resume All
                  </button>
                )}
              </div>
            )}
          </div>

          <DropZone onFiles={addFiles} isUploading={hasUploading} />

          {/* Global error */}
          {globalError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{globalError}</span>
              <button
                type="button"
                onClick={() => setGlobalError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Summary */}
          <SummaryBar items={items} />

          {/* Active + errored items */}
          {activeItems.length > 0 && (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-0.5">
              {activeItems.map((item) => (
                <UploadCard
                  key={item.id}
                  item={item}
                  onPause={handlePause}
                  onResume={handleResume}
                  onRetry={handleRetry}
                  onCancel={handleCancel}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Right: Completed Panel */}
        <div className="md:col-span-5 md:border-l border-slate-100 md:pl-6">
          <CompletedPanel items={items} />
        </div>
      </div>
    </div>
  );
};

// ─── Page Wrapper ─────────────────────────────────────────────────────────────

export default function UploadVideoView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="w-full px-5 lg:px-16 py-10 max-w-6xl mx-auto">
        <UploadManager />
      </div>
    </div>
  );
}