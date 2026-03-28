"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// Tiptap
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

// Icons
import {
  CalendarIcon, MapPin, IndianRupee, UploadCloud, X,
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Minus, Undo2, Redo2,
  CheckCircle2, AlertCircle, Loader2, ChevronRight,
  ImageIcon, Sparkles,
  SendHorizontalIcon, Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  title:       z.string().min(3, "Title must be at least 3 characters").max(150),
  description: z.string().min(10, "Description is too short"),
  thumbnail:   z.string().url("Thumbnail must be a valid URL"),
  City:        z.string().min(2, "City is required"),
  price:       z.number().min(0, "Price must be positive"),
  startDate:   z.string(),
  endDate:     z.string(),
  perfectFor:  z.array(z.object({ name: z.string() })).min(1, "Select at least one tag"),
});

type FormValues = z.infer<typeof schema>;

// ─── Tiptap Rich Editor ───────────────────────────────────────────────────────

function ToolbarBtn({
  active, onClick, title, children,
}: {
  active?: boolean; onClick: () => void; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="p-1.5 rounded-md text-[13px] transition-all duration-150"
    >
      {children}
    </button>
  );
}

function TiptapEditor({
  value, onChange, error,
}: {
  value: string; onChange: (html: string) => void; error?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: "Describe what attendees will learn, who it's for, and what to expect…" }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-600 underline" } }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-neutral prose-sm max-w-none min-h-[160px] px-4 py-3 focus:outline-none",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const groups = [
    [
      { icon: <Bold className="w-3.5 h-3.5" />, title: "Bold", active: editor.isActive("bold"), action: () => editor.chain().focus().toggleBold().run() },
      { icon: <Italic className="w-3.5 h-3.5" />, title: "Italic", active: editor.isActive("italic"), action: () => editor.chain().focus().toggleItalic().run() },
      { icon: <UnderlineIcon className="w-3.5 h-3.5" />, title: "Underline", active: editor.isActive("underline"), action: () => editor.chain().focus().toggleUnderline().run() },
    ],
    [
      { icon: <Heading2 className="w-3.5 h-3.5" />, title: "Heading 2", active: editor.isActive("heading", { level: 2 }), action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
      { icon: <Heading3 className="w-3.5 h-3.5" />, title: "Heading 3", active: editor.isActive("heading", { level: 3 }), action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    ],
    [
      { icon: <List className="w-3.5 h-3.5" />, title: "Bullet list", active: editor.isActive("bulletList"), action: () => editor.chain().focus().toggleBulletList().run() },
      { icon: <ListOrdered className="w-3.5 h-3.5" />, title: "Ordered list", active: editor.isActive("orderedList"), action: () => editor.chain().focus().toggleOrderedList().run() },
    ],
    [
      { icon: <AlignLeft className="w-3.5 h-3.5" />, title: "Align left", active: editor.isActive({ textAlign: "left" }), action: () => editor.chain().focus().setTextAlign("left").run() },
      { icon: <AlignCenter className="w-3.5 h-3.5" />, title: "Align center", active: editor.isActive({ textAlign: "center" }), action: () => editor.chain().focus().setTextAlign("center").run() },
      { icon: <AlignRight className="w-3.5 h-3.5" />, title: "Align right", active: editor.isActive({ textAlign: "right" }), action: () => editor.chain().focus().setTextAlign("right").run() },
    ],
    [
      { icon: <LinkIcon className="w-3.5 h-3.5" />, title: "Link", active: editor.isActive("link"), action: setLink },
      { icon: <Minus className="w-3.5 h-3.5" />, title: "Divider", active: false, action: () => editor.chain().focus().setHorizontalRule().run() },
    ],
    [
      { icon: <Undo2 className="w-3.5 h-3.5" />, title: "Undo", active: false, action: () => editor.chain().focus().undo().run() },
      { icon: <Redo2 className="w-3.5 h-3.5" />, title: "Redo", active: false, action: () => editor.chain().focus().redo().run() },
    ],
  ];

  return (
    <div className={cn(
      "rounded-xl border bg-white overflow-hidden transition-colors",
      error ? "border-red-300 ring-1 ring-red-200" : "border-neutral-200 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-200"
    )}>
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50/80 flex-wrap">
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && <div className="w-px h-4 bg-neutral-200 mx-1" />}
            {group.map((btn) => (
              <ToolbarBtn key={btn.title} active={btn.active} onClick={btn.action} title={btn.title}>
                {btn.icon}
              </ToolbarBtn>
            ))}
          </React.Fragment>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-3
          [&_.ProseMirror]:sm:px-4 [&_.ProseMirror]:sm:py-4
          [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed
          [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-4
          [&_.ProseMirror_h3]:text-base [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-3
          [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6
          [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6
          [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-neutral-300
          [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic
        "
      />
      {error && (
        <div className="px-3 py-1.5 text-xs text-red-500 border-t border-red-100 bg-red-50 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}

// ─── Thumbnail Uploader ───────────────────────────────────────────────────────

type ThumbState =
  | { s: "idle" }
  | { s: "uploading"; pct: number }
  | { s: "done"; url: string }
  | { s: "error"; msg: string };

function ThumbnailUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ThumbState>(value ? { s: "done", url: value } : { s: "idle" });
  const [drag, setDrag] = useState(false);

  const trpc = useTRPC();
  const getUrls = useMutation(trpc.tutorials.getSignedUrl.mutationOptions());

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setState({ s: "error", msg: "Images only (JPG, PNG, WEBP)" }); return; }
    if (file.size > 10 * 1024 * 1024) { setState({ s: "error", msg: "Max file size is 10 MB" }); return; }

    setState({ s: "uploading", pct: 0 });
    let uploadUrl: string, key: string;

    try {
      const res = await getUrls.mutateAsync([{ name: file.name, type: file.type, size: file.size }]);
      uploadUrl = res.files[0].uploadUrl;
      key = res.files[0].key;
    } catch {
      setState({ s: "error", msg: "Could not get upload URL" }); return;
    }

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setState({ s: "uploading", pct: (e.loaded / e.total) * 100 }); };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
        setState({ s: "done", url });
        onChange(url);
      } else setState({ s: "error", msg: `Server error ${xhr.status}` });
    };
    xhr.onerror = () => setState({ s: "error", msg: "Network error" });
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  }, [getUrls, onChange]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
      className={cn("relative rounded-xl overflow-hidden border-2 border-dashed transition-all",
        drag ? "border-neutral-400 bg-neutral-50" : state.s === "done" ? "border-transparent" : "border-neutral-200 hover:border-neutral-300"
      )}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />

      {state.s === "idle" && (
        <button type="button" onClick={() => inputRef.current?.click()} className="w-full h-40 flex flex-col items-center justify-center gap-3 group">
          <div className="w-11 h-11 rounded-xl border border-neutral-200 bg-white flex items-center justify-center shadow-sm group-hover:border-neutral-300 transition-colors">
            <ImageIcon className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">Drop image or <span className="text-neutral-900 font-semibold underline underline-offset-2">choose file</span></p>
          <p className="text-xs text-neutral-400">JPG, PNG, WEBP · up to 10 MB</p>
        </button>
      )}

      {state.s === "uploading" && (
        <div className="h-40 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
          <div className="w-36 space-y-1.5">
            <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-800 rounded-full transition-all" style={{ width: `${state.pct}%` }} />
            </div>
            <p className="text-xs text-neutral-400 text-center">{Math.round(state.pct)}%</p>
          </div>
        </div>
      )}

      {state.s === "done" && (
        <div className="group relative">
          <div className="relative w-full aspect-video">
            <img src={state.url} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-semibold text-neutral-800 transition-colors flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" /> Replace
            </button>
            <button type="button" onClick={() => { setState({ s: "idle" }); onChange(""); }} className="px-3 py-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
        </div>
      )}

      {state.s === "error" && (
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-500">{state.msg}</p>
          <button type="button" onClick={() => setState({ s: "idle" })} className="text-xs text-neutral-500 underline underline-offset-2 mt-1">Try again</button>
        </div>
      )}
    </div>
  );
}

// ─── PerfectFor Tag Input ─────────────────────────────────────────────────────

function PerfectForInput({
  value,
  onChange,
  error,
}: {
  value: { name: string }[];
  onChange: (v: { name: string }[]) => void;
  error?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (value.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      return;
    }
    onChange([...value, { name: trimmed }]);
    setInput("");
  };

  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div className={cn(
      "rounded-xl border bg-white overflow-hidden transition-colors",
      error ? "border-red-300 ring-1 ring-red-200" : "border-neutral-200 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-200"
    )}>
      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 px-3 pt-3 pb-2 min-h-[44px]">
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-neutral-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {tag.name}
            <button type="button" onClick={() => remove(i)} className="hover:text-red-300 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {value.length === 0 && (
          <span className="text-xs text-neutral-400 self-center">No tags yet — type below and press Enter or +</span>
        )}
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2 px-3 pb-3 border-t border-neutral-100 pt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="e.g. Beginners, Yoga lovers, Athletes…"
          className="flex-1 text-sm bg-transparent outline-none placeholder:text-neutral-400"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center disabled:opacity-30 hover:bg-neutral-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="px-3 py-1.5 text-xs text-red-500 border-t border-red-100 bg-red-50 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const fieldInput = "h-11 rounded-xl border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-900/10 focus-visible:border-neutral-400 transition-all shadow-sm";

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-sm font-semibold text-neutral-800">{children}</span>
      {optional && <span className="text-xs text-neutral-400 font-normal">optional</span>}
    </div>
  );
}

function SectionTitle({ step, label, subtitle }: { step: number; label: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 pb-6 mb-6 border-b border-neutral-100">
      <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <h2 className="text-lg font-black text-neutral-900 tracking-tight">{label}</h2>
        <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Step Sidebar ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Content",    sub: "Title & description" },
  { label: "Media",      sub: "Thumbnail & pricing" },
  { label: "Scheduling", sub: "Dates, city & tags" },
];

function Sidebar({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      {STEPS.map((s, i) => (
        <div
          key={s.label}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
            i === current ? "bg-neutral-900" : i < current ? "opacity-70" : "opacity-40"
          )}
        >
          <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0",
            i < current ? "bg-emerald-500 text-white" : i === current ? "bg-white text-neutral-900" : "bg-neutral-700 text-neutral-400"
          )}>
            {i < current ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <div>
            <p className={cn("text-xs font-bold leading-none", i === current ? "text-white" : "text-neutral-400")}>{s.label}</p>
            <p className={cn("text-[10px] mt-0.5", i === current ? "text-neutral-400" : "text-neutral-600")}>{s.sub}</p>
          </div>
        </div>
      ))}
      <div className="mt-auto pt-8">
        <div className="rounded-xl bg-neutral-800/50 border border-neutral-700/50 p-4">
          <Sparkles className="w-4 h-4 text-amber-400 mb-2" />
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Fill in all three steps to publish your class to the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RegularClassesEditView({id}:{id:string}) {
  const trpc = useTRPC();
  const [step, setStep] = useState(0);

  const {data:classs}=useSuspenseQuery(trpc.regularClasses.getClass.queryOptions({id}))
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: classs.title,
      description: classs.description,
      thumbnail: classs.thumbnail,
      City: classs.City,
      price: classs.price,
      startDate: (classs.startDate),
      endDate: (classs.endDate),
      perfectFor: classs.perfectFor,
    },
  });

  const stepFields: (keyof FormValues)[][] = [
    ["title", "description"],
    ["thumbnail", "price"],
    ["startDate", "endDate", "City", "perfectFor"],
  ];

  const goNext = async () => {
    if (await form.trigger(stepFields[step])) setStep((s) => Math.min(s + 1, 2));
  };

  const mutate = useMutation(trpc.regularClasses.updateregularClasses.mutationOptions({
    onSuccess: () => toast.success("Regular Class Updated"),
    onError: () => toast.error("Something went wrong"),
  }));

  const onSubmit = async (v: FormValues) => mutate.mutateAsync({...v,id})
  
  return (
    <div className="min-h-screen bg-[#F5F4F0]">
      {/* Top bar */}
      <header className="h-14 bg-neutral-900 flex items-center px-6 gap-3">
        <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
        </div>
        <span className="text-sm font-bold text-white tracking-tight">Class Studio</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
        <span className="text-sm text-neutral-400">New Class</span>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">


        {/* ── Form card ── */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="p-8">

                  {/* ── Step 0: Content ── */}
                  {step === 0 && (
                    <div className="space-y-6">
                      <SectionTitle step={1} label="Class Content" subtitle="Give your class a compelling title and detailed description." />

                      {/* Title */}
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Class Title</Label></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Morning Vinyasa Flow" className={fieldInput} {...field} />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />

                      {/* Description — Tiptap */}
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Description</Label></FormLabel>
                          <FormControl>
                            <TiptapEditor
                              value={field.value}
                              onChange={field.onChange}
                              error={form.formState.errors.description?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* ── Step 1: Media & Pricing ── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <SectionTitle step={2} label="Media & Pricing" subtitle="Upload a cover thumbnail and set your ticket price." />

                      <FormField control={form.control} name="thumbnail" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Cover Thumbnail</Label></FormLabel>
                          <FormControl>
                            <ThumbnailUploader value={field.value} onChange={field.onChange} />
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="price" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Price</Label></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 text-neutral-500" />
                              </div>
                              <Input
                                type="number"
                                min={0}
                                step={1}
                                placeholder="0"
                                className={cn(fieldInput, "pl-14")}
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </div>
                          </FormControl>
                          <p className="text-xs text-neutral-400 mt-1">Set to 0 for a free class.</p>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />
                    </div>
                  )}

                  {/* ── Step 2: Scheduling ── */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <SectionTitle step={3} label="Scheduling & Details" subtitle="Set dates, city and who this class is perfect for." />

                      {/* Start Date */}
                      <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Start Date</Label></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-11 rounded-xl border-neutral-200 shadow-sm bg-white text-sm font-normal justify-start gap-2.5 hover:border-neutral-400 hover:bg-white transition-all",
                                    !field.value && "text-neutral-400"
                                  )}
                                >
                                  <CalendarIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                                  {field.value ? format(new Date(field.value), "EEEE, d MMMM yyyy") : "Select start date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-neutral-200 shadow-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(d) => field.onChange(d ? d.toISOString() : "")}
                                disabled={(d) => d < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />

                      {/* End Date */}
                      <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>End Date</Label></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full h-11 rounded-xl border-neutral-200 shadow-sm bg-white text-sm font-normal justify-start gap-2.5 hover:border-neutral-400 hover:bg-white transition-all",
                                    !field.value && "text-neutral-400"
                                  )}
                                >
                                  <CalendarIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                                  {field.value ? format(new Date(field.value), "EEEE, d MMMM yyyy") : "Select end date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-neutral-200 shadow-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(d) => field.onChange(d ? d.toISOString() : "")}
                                disabled={(d) => d < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />

                      {/* City */}
                      <FormField control={form.control} name="City" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>City</Label></FormLabel>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-0 top-0 bottom-0 w-11 bg-neutral-50 border-r border-neutral-200 rounded-l-xl flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-neutral-500" />
                              </div>
                              <Input placeholder="e.g. Mumbai" className={cn(fieldInput, "pl-14")} {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      )} />

                      {/* Perfect For */}
                      <FormField control={form.control} name="perfectFor" render={({ field }) => (
                        <FormItem>
                          <FormLabel><Label>Perfect For</Label></FormLabel>
                          <FormControl>
                            <PerfectForInput
                              value={field.value}
                              onChange={field.onChange}
                              error={form.formState.errors.perfectFor?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                  )}
                </div>

                {/* ── Footer nav ── */}
                <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(s - 1, 0))}
                    disabled={step === 0}
                    className="h-10 px-5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-sm"
                  >
                    ← Back
                  </button>

                  <div className="flex items-center gap-1.5">
                    {STEPS.map((_, i) => (
                      <div key={i} className={cn("rounded-full transition-all duration-300 bg-neutral-900", i === step ? "w-6 h-2" : i < step ? "w-2 h-2 opacity-40" : "w-2 h-2 opacity-15")} />
                    ))}
                  </div>

                  {step < 2 ? (
                    <button
                      type="button"
                       onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    goNext();
  }}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="h-10 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-sm font-bold text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {form.formState.isSubmitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                        : <><SendHorizontalIcon className="w-4 h-4" /> Publish Class</>
                      }
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