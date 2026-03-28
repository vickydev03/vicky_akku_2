import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";
import Link from "@tiptap/extension-link";

import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import React, { useCallback } from "react";
import { AlertCircle, AlignCenter, AlignLeft, AlignRight, Bold, Heading2, Heading3, Italic, LinkIcon, List, ListOrdered, Minus, Redo2, UnderlineIcon, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "p-1.5 rounded-md text-[13px] transition-all duration-150",
        // active
        //   ? "bg-neutral-900 text-white"
        //   : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
      )}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
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
      {/* Toolbar */}
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

      {/* Editor area */}
    <EditorContent
  editor={editor}
  className="
  [&_.ProseMirror]:outline-none
  [&_.ProseMirror]:px-3
  [&_.ProseMirror]:py-3
  [&_.ProseMirror]:sm:px-4
  [&_.ProseMirror]:sm:py-4
  [&_.ProseMirror]:min-h-[180px]
  [&_.ProseMirror]:text-sm
  [&_.ProseMirror]:leading-relaxed

  [&_.ProseMirror_h2]:text-lg
  [&_.ProseMirror_h2]:font-bold
  [&_.ProseMirror_h2]:mt-4

  [&_.ProseMirror_h3]:text-base
  [&_.ProseMirror_h3]:font-semibold
  [&_.ProseMirror_h3]:mt-3

  [&_.ProseMirror_ul]:list-disc
  [&_.ProseMirror_ul]:pl-6

  [&_.ProseMirror_ol]:list-decimal
  [&_.ProseMirror_ol]:pl-6

  [&_.ProseMirror_blockquote]:border-l-4
  [&_.ProseMirror_blockquote]:border-neutral-300
  [&_.ProseMirror_blockquote]:pl-4
  [&_.ProseMirror_blockquote]:italic
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