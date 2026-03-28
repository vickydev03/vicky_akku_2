"use client";

import React, { Suspense, useCallback, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  GripVertical,
  IndianRupee,
  Layers,
  Loader2,
  Plus,
  SendHorizontalIcon,
  Sparkles,
  Trash2,
  Video,
  Wifi,
  WifiOff,
  Pause,
  Play,
  RotateCcw,
  X,
  AlertCircle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "../component/TiptapEditor";
import { ThumbnailUploader } from "./RegistrationsView";

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

interface UploadItem {
  id: string;
  file: File;
  duration: number;
  status: UploadStatus;
  progress: number;
  uploadedBytes: number;
  speed: number;
  eta: number;
  errorMessage?: string;
  key?: string;
  startedAt?: number;
  xhr?: XMLHttpRequest;
  chunkOffset: number;
}

interface VideoItem {
  key: string;
  size: number;
  lastModified: string;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const videoEntrySchema = z.object({
  id: z.string().optional(),
  video: z.instanceof(File, { message: "Select a video file" }).optional(),
  videoKey: z.string().optional(),
  title: z
    .string()
    .min(1, "Video title is required")
    .max(120, "Max 120 characters"),
  duration: z.number().optional(),
  size: z.number().optional(),
});

const updateTutorialSchema = z.object({
  title: z
    .string()
    .min(3, "At least 3 characters")
    .max(120, "Max 120 characters"),
  description: z
    .string()
    .min(10, "Write at least 10 characters")
    .max(2000, "Max 2000 characters"),
  thumbnail: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Thumbnail is required")
    .optional(),
  price: z
    .number()
    .int("Whole number only")
    .nonnegative("Cannot be negative")
    .optional(),
  duration: z
    .number()
    .int("Whole number only")
    .positive("Must be greater than 0")
    .optional(),
  videos: z.array(videoEntrySchema).min(1, "Add at least one video"),
});

type CreateTutorialFormValues = {
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  duration?: number;
  videos: {
    id?: string;
    title: string;
    video?: File;
    videoKey?: string;
    duration?: number;
    size?: number;
  }[];
};

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

// ─── XHR Upload ───────────────────────────────────────────────────────────────

function uploadFileXHR(
  file: File,
  uploadUrl: string,
  offset: number,
  onProgress: (loaded: number, speed: number, eta: number) => void,
  onDone: () => void,
  onError: (msg: string) => void,
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

  const blob = file.slice(offset);
  xhr.open("PUT", uploadUrl);
  xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
  if (offset > 0) {
    xhr.setRequestHeader(
      "Content-Range",
      `bytes ${offset}-${file.size - 1}/${file.size}`,
    );
  }
  xhr.send(blob);
  return xhr;
}

// ─── Upload Progress Bar ──────────────────────────────────────────────────────

const UploadProgressBar = ({
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
    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorMap[status]} ${
          status === "uploading" ? "animate-pulse" : ""
        }`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      />
    </div>
  );
};

// ─── Inline Upload Status (shown inside VideoRow) ─────────────────────────────

const InlineUploadStatus = ({
  item,
  onPause,
  onResume,
  onRetry,
  onCancel,
}: {
  item: UploadItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
}) => {
  const isActive = item.status === "uploading";
  const isPaused = item.status === "paused";
  const isDone = item.status === "done";
  const isError = item.status === "error";
  const isQueued = item.status === "queued";

  const statusColor: Record<UploadStatus, string> = {
    queued: "text-neutral-400",
    uploading: "text-violet-600",
    paused: "text-amber-500",
    done: "text-emerald-600",
    error: "text-red-500",
    cancelled: "text-neutral-400",
  };

  const statusLabel: Record<UploadStatus, string> = {
    queued: "Queued",
    uploading: "Uploading…",
    paused: "Paused",
    done: "Uploaded",
    error: "Failed",
    cancelled: "Cancelled",
  };

  return (
    <div className="mt-2 space-y-1.5">
      {/* Progress bar */}
      {!isDone && item.status !== "cancelled" && (
        <UploadProgressBar progress={item.progress} status={item.status} />
      )}

      {/* Status row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-semibold ${statusColor[item.status]}`}
          >
            {statusLabel[item.status]}
          </span>

          {isActive && item.speed > 0 && (
            <>
              <span className="text-neutral-200 text-[11px]">·</span>
              <span className="text-[11px] text-violet-500 font-medium flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                {formatBytes(item.speed)}/s
              </span>
              <span className="text-neutral-200 text-[11px]">·</span>
              <span className="text-[11px] text-neutral-400">
                {formatTime(item.eta)} left
              </span>
            </>
          )}

          {isPaused && (
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              {formatBytes(item.uploadedBytes)} uploaded
            </span>
          )}

          {(isActive || isPaused) && (
            <span className="text-[11px] text-neutral-400">
              {formatBytes(item.uploadedBytes)} / {formatBytes(item.file.size)}{" "}
              · {Math.round(item.progress)}%
            </span>
          )}

          {isDone && (
            <span className="text-[11px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {formatBytes(item.file.size)}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {isActive && (
            <button
              type="button"
              onClick={() => onPause(item.id)}
              className="p-1 rounded-md bg-white border border-amber-200 text-amber-500 hover:bg-amber-50 transition-colors"
              title="Pause"
            >
              <Pause className="w-3 h-3" />
            </button>
          )}
          {isPaused && (
            <button
              type="button"
              onClick={() => onResume(item.id)}
              className="p-1 rounded-md bg-white border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors"
              title="Resume"
            >
              <Play className="w-3 h-3" />
            </button>
          )}
          {isError && (
            <button
              type="button"
              onClick={() => onRetry(item.id)}
              className="p-1 rounded-md bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
              title="Retry"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          {(isActive || isPaused || isQueued) && (
            <button
              type="button"
              onClick={() => onCancel(item.id)}
              className="p-1 rounded-md bg-white border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {isError && item.errorMessage && (
        <p className="text-[11px] text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {item.errorMessage}
        </p>
      )}
    </div>
  );
};

// ─── Shared primitives ────────────────────────────────────────────────────────

const fieldInput =
  "h-11 rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-400 transition-all shadow-sm";

function SectionTitle({
  step,
  label,
  subtitle,
}: {
  step: number;
  label: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-6 mb-6 border-b border-neutral-100">
      <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <h2 className="text-lg font-black text-neutral-900 tracking-tight">
          {label}
        </h2>
        <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Details", sub: "Title & description" },
  { label: "Media", sub: "Thumbnail & pricing" },
  { label: "Videos", sub: "Attach video lessons" },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-1 py-2 h-full">
      {STEPS.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
            i === current
              ? "bg-neutral-800"
              : i < current
                ? "opacity-70"
                : "opacity-40",
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
              i < current
                ? "bg-emerald-500 text-white"
                : i === current
                  ? "bg-white text-neutral-900"
                  : "bg-neutral-700 text-neutral-400",
            )}
          >
            {i < current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <div>
            <p
              className={cn(
                "text-xs font-bold leading-none",
                i === current ? "text-white" : "text-neutral-400",
              )}
            >
              {s.label}
            </p>
            <p
              className={cn(
                "text-[10px] mt-0.5",
                i === current ? "text-neutral-400" : "text-neutral-600",
              )}
            >
              {s.sub}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-auto pt-8">
        <div className="rounded-xl bg-neutral-800/50 border border-neutral-700/50 p-4">
          <Sparkles className="w-4 h-4 text-amber-400 mb-2" />
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Complete all three steps to publish your tutorial to the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── VideoRow ─────────────────────────────────────────────────────────────────

function VideoRow({
  index,
  isBusy,
  canRemove,
  onRemove,
  form,
  uploadItem,
  onPause,
  onResume,
  onRetry,
  onCancel,
  onFileSelected,
}: {
  index: number;
  isBusy: boolean;
  canRemove: boolean;
  onRemove: (i: number) => void;
  form: ReturnType<typeof useForm<CreateTutorialFormValues>>;
  uploadItem?: UploadItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onFileSelected: (file: File, index: number) => void;
}) {
  return (
    <div className="group relative rounded-xl border overflow-hidden border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50">
      {/* Row header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-neutral-300" />
          <Badge
            variant="secondary"
            className="rounded-md bg-white text-xs font-semibold text-neutral-500 shadow-sm border border-neutral-200"
          >
            Lesson {index + 1}
          </Badge>
        </div>
        {canRemove && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onRemove(index)}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-neutral-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all disabled:cursor-not-allowed"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Video file input */}
        <FormField
          control={form.control}
          name={`videos.${index}.video`}
          render={({ field }) => {
            const videoKey = form.getValues(`videos.${index}.videoKey`);

            return (
              <FormItem>
                <FormLabel className="text-xs font-semibold text-neutral-600">
                  Video File <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <label className="flex items-center justify-between h-10 px-4 rounded-xl border border-neutral-200 bg-white text-sm shadow-sm cursor-pointer hover:bg-neutral-50 transition">
                    <span className="truncate text-neutral-600">
                      {field.value instanceof File
                        ? field.value.name
                        : videoKey
                          ? "Video already uploaded"
                          : "Choose video file"}
                    </span>

                    <span className="text-xs text-neutral-400">
                      {field.value instanceof File
                        ? formatBytes(field.value.size)
                        : videoKey
                          ? "stored"
                          : "browse"}
                    </span>

                    <input
                      type="file"
                      accept="video/*"
                      disabled={isBusy}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        field.onChange(file ?? undefined);

                        if (file) {
                          onFileSelected(file, index);
                        }
                      }}
                    />
                  </label>
                </FormControl>

                <FormMessage className="text-xs text-red-500" />

                {/* Upload progress */}
                {uploadItem && (
                  <InlineUploadStatus
                    item={uploadItem}
                    onPause={onPause}
                    onResume={onResume}
                    onRetry={onRetry}
                    onCancel={onCancel}
                  />
                )}
              </FormItem>
            );
          }}
        />

        {/* Lesson title */}
        <FormField
          control={form.control}
          name={`videos.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold text-neutral-600">
                Lesson Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Introduction to TypeScript"
                  disabled={isBusy}
                  className="h-10 rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-400 shadow-sm transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

function TutorialFormInner({ id }: { id: string }) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tutorials.getVideos.queryOptions());

  // ── Upload state ──
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const xhrMapRef = useRef<Map<string, XMLHttpRequest>>(new Map());

  const getSignedUrls = useMutation(
    trpc.tutorials.getSignedUrl.mutationOptions(),
  );

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploadItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

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
          updateItem(item.id, { uploadedBytes: loaded, progress, speed, eta });
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
          updateItem(item.id, { status: "error", errorMessage: msg, speed: 0 });
        },
      );

      xhrMapRef.current.set(item.id, xhr);
      updateItem(item.id, { xhr });
    },
    [updateItem],
  );

  const getDuration = (file: File) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.src = URL.createObjectURL(file);
    });
  };
  // Map from form field index → upload item id
  const fieldUploadMap = useRef<Map<number, string>>(new Map());

  const handleFileSelected = useCallback(
    async (file: File, fieldIndex: number) => {
      const duration = await getDuration(file);

      console.log(file);
      // Cancel previous upload for this field index if any
      const prevId = fieldUploadMap.current.get(fieldIndex);
      if (prevId) {
        const xhr = xhrMapRef.current.get(prevId);
        if (xhr) {
          xhr.abort();
          xhrMapRef.current.delete(prevId);
        }
        setUploadItems((prev) => prev.filter((i) => i.id !== prevId));
        fieldUploadMap.current.delete(fieldIndex);
      }

      const newItem: UploadItem = {
        id: generateId(),
        file,
        duration: duration as number,
        status: "queued",
        progress: 0,
        uploadedBytes: 0,
        speed: 0,
        eta: Infinity,
        chunkOffset: 0,
      };

      setUploadItems((prev) => [...prev, newItem]);
      fieldUploadMap.current.set(fieldIndex, newItem.id);

      let urls: SignedUrlResult[];
      try {
        const res = await getSignedUrls.mutateAsync([
          { name: file.name, type: file.type, size: file.size },
        ]);
        urls = res.files;
      } catch {
        updateItem(newItem.id, {
          status: "error",
          errorMessage: "Failed to get upload URL. Please retry.",
        });
        return;
      }

      if (!urls[0]) {
        updateItem(newItem.id, {
          status: "error",
          errorMessage: "No upload URL returned.",
        });
        return;
      }

      startUpload(newItem, urls[0].uploadUrl, urls[0].key);
    },
    [getSignedUrls, startUpload, updateItem],
  );
  const handlePause = useCallback((id: string) => {
    const xhr = xhrMapRef.current.get(id);
    if (xhr) {
      xhr.abort();
      xhrMapRef.current.delete(id);
    }
    setUploadItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "paused", speed: 0 } : item,
      ),
    );
  }, []);

  const handleResume = useCallback(
    async (id: string) => {
      const item = uploadItems.find((i) => i.id === id);
      if (!item) return;
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
    [uploadItems, getSignedUrls, startUpload, updateItem],
  );

  const handleRetry = useCallback(
    async (id: string) => {
      const item = uploadItems.find((i) => i.id === id);
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
    [uploadItems, getSignedUrls, startUpload, updateItem],
  );

  const handleCancel = useCallback(
    (id: string) => {
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
    },
    [updateItem],
  );

  const availableVideos: VideoItem[] = data?.videos ?? [];
  const [step, setStep] = useState(0);

  const { data: classDetails } = useSuspenseQuery(
    trpc.tutorials.getTutorialAdmin.queryOptions({ id }),
  );
  // console.log(classDetails, "check classDetails");

  const form = useForm<CreateTutorialFormValues>({
    resolver: zodResolver(updateTutorialSchema),
    defaultValues: {
      title: classDetails.title,
      description: classDetails.description,
      thumbnail: classDetails.thumbnail,
      price: classDetails.price,
      duration: classDetails.duration,
      videos:
        classDetails.video?.length > 0
          ? classDetails.video.map((v) => ({
              id: v.id,
              title: v.title,
              videoKey: v.videoKey,
              duration: (v as any).duration ?? undefined,
              size: v.size ?? undefined,
            }))
          : [{ title: "", video: undefined as unknown as File }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videos",
  });

  const updateMutation = useMutation(
    trpc.tutorials.updateTutorial.mutationOptions({
      onSuccess: () => {
        toast.success("Tutorial Updated!");
        form.reset();
        setStep(0);
      },
      onError: () => {
        toast.error("Something went wrong.");
      },
    }),
  );

  const isBusy = form.formState.isSubmitting || updateMutation.isPending;

  const stepFields: (keyof CreateTutorialFormValues)[][] = [
    ["title", "description"],
    ["thumbnail", "price", "duration"],
    ["videos"],
  ];

  const goNext = async () => {
    const valid = await form.trigger(
      stepFields[step] as (keyof CreateTutorialFormValues)[],
    );
    if (valid) setStep((s) => Math.min(s + 1, 2));
  };

  const onSubmit = async (values: CreateTutorialFormValues) => {
    const videosWithKeys = values.videos.map((video, i) => {
      const uploadId = fieldUploadMap.current.get(i);
      const uploadItem = uploadItems.find((u) => u.id === uploadId);
      console.log(uploadItem?.file.size, "check");
      return {
        ...video,
        videoKey: uploadItem?.key ?? video.videoKey,
        duration: uploadItem?.duration ?? video.duration,
        size: uploadItem?.file.size ?? video.size,
      };
    });
    
    // console.log(values,"check values")
    // console.log(videosWithKeys, "check values");


    await updateMutation.mutateAsync({

      ...values,
      id:classDetails.id,
      videos: videosWithKeys,

    });
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
      <header className="h-14 bg-neutral-900 flex items-center px-6 gap-3">
        <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-neutral-900" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">
          Tutorial Studio
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-sm text-neutral-400">New Tutorial</span>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-52 flex-shrink-0 flex-col">
          <div className="bg-neutral-900 rounded-2xl p-3 sticky top-10">
            <Sidebar current={step} />
          </div>
        </aside>

        {/* Form card */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="p-8">
                  {/* ── Step 0: Details ── */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <SectionTitle
                        step={1}
                        label="Tutorial Details"
                        subtitle="Give your tutorial a clear title and an engaging description."
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-800">
                              Title <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Complete TypeScript Mastery"
                                className={fieldInput}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Label>Description</Label>
                            </FormLabel>
                            <FormControl>
                              <TiptapEditor
                                value={field.value}
                                onChange={field.onChange}
                                error={
                                  form.formState.errors.description?.message
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* ── Step 1: Media ── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <SectionTitle
                        step={2}
                        label="Media & Pricing"
                        subtitle="Set the cover image URL, price, and total duration."
                      />

                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-neutral-800">
                              Image
                            </FormLabel>
                            <FormControl>
                              <ThumbnailUploader
                                value={field.value ?? ""}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-neutral-800">
                                Price
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                    <IndianRupee className="w-4 h-4 text-neutral-400" />
                                  </div>
                                  <Input
                                    type="number"
                                    min={0}
                                    step={1}
                                    placeholder="2999"
                                    className={cn(fieldInput, "pl-14")}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : parseInt(e.target.value, 10),
                                      )
                                    }
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-neutral-400 mt-1">
                                In cents — 2999 = $29.99. Blank = free.
                              </p>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-neutral-800">
                                Duration{" "}
                                <span className="text-xs font-normal text-neutral-400">
                                  optional
                                </span>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-neutral-400" />
                                  </div>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="3600"
                                    className={cn(fieldInput, "pl-14")}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : parseInt(e.target.value, 10),
                                      )
                                    }
                                    value={field.value ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <p className="text-xs text-neutral-400 mt-1">
                                Total length in seconds.
                              </p>
                              <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── Step 2: Videos ── */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <SectionTitle
                        step={3}
                        label="Video Lessons"
                        subtitle="Attach one or more uploaded videos and give each lesson a title."
                      />

                      {/* Stats badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 border border-neutral-200">
                          <Layers className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-xs font-semibold text-neutral-600">
                            {availableVideos.length} file
                            {availableVideos.length !== 1 ? "s" : ""} in storage
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                          <Video className="w-3.5 h-3.5 text-neutral-300" />
                          <span className="text-xs font-semibold text-white">
                            {fields.length} lesson
                            {fields.length !== 1 ? "s" : ""} added
                          </span>
                        </div>
                      </div>

                      {/* Video rows */}
                      <div className="space-y-3">
                        {fields.map((f, i) => {
                          const uploadId = fieldUploadMap.current.get(i);
                          const uploadItem = uploadId
                            ? uploadItems.find((u) => u.id === uploadId)
                            : undefined;

                          return (
                            <VideoRow
                              key={f.id}
                              index={i}
                              isBusy={isBusy}
                              canRemove={fields.length > 1}
                              onRemove={remove}
                              form={form}
                              uploadItem={uploadItem}
                              onPause={handlePause}
                              onResume={handleResume}
                              onRetry={handleRetry}
                              onCancel={handleCancel}
                              onFileSelected={handleFileSelected}
                            />
                          );
                        })}
                      </div>

                      {/* Array-level error */}
                      {typeof (
                        form.formState.errors.videos as { message?: string }
                      )?.message === "string" && (
                        <p className="text-xs text-red-500">
                          {
                            (
                              form.formState.errors.videos as {
                                message?: string;
                              }
                            ).message
                          }
                        </p>
                      )}

                      {/* Add lesson */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          append({
                            video: undefined as unknown as File,
                            title: "",
                          })
                        }
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 text-sm font-semibold text-neutral-400 hover:border-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        Add another lesson
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer nav */}
                <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(s - 1, 0))}
                    disabled={step === 0}
                    className="h-10 px-5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                  >
                    ← Back
                  </button>

                  {/* Progress dots */}
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-full transition-all duration-300 bg-neutral-900",
                          i === step
                            ? "w-6 h-2"
                            : i < step
                              ? "w-2 h-2 opacity-40"
                              : "w-2 h-2 opacity-15",
                        )}
                      />
                    ))}
                  </div>

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={(e)=>{
                        e.stopPropagation()
                        e.preventDefault()
                        goNext()
                      }}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isBusy}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating…
                        </>
                      ) : (
                        <>
                          <SendHorizontalIcon className="w-4 h-4" />
                          Publish Tutorial
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Page Skeleton ────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      <div className="h-14 bg-neutral-900" />
      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <Skeleton className="h-72 w-full rounded-2xl bg-neutral-200" />
        </aside>
        <main className="flex-1">
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28 bg-neutral-100" />
                <Skeleton className="h-11 w-full bg-neutral-50" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Default Export ───────────────────────────────────────────────────────────

export default function TutorialEditView({ id }: { id: string }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <TutorialFormInner id={id} />
    </Suspense>
  );
}
