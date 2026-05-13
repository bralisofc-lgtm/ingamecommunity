import { useEffect } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Minus,
  Link2,
  Image as ImageIcon,
  Youtube,
  EyeOff,
  Smile,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
}

type Action = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  apply: (sel: { before: string; selected: string; after: string }) => {
    text: string;
    cursor?: number;
  };
};

const wrap = (a: string, b: string = a) => (s: { before: string; selected: string; after: string }) => ({
  text: s.before + a + (s.selected || "texto") + b + s.after,
  cursor: s.before.length + a.length + (s.selected || "texto").length,
});

const linePrefix = (prefix: string) => (s: { before: string; selected: string; after: string }) => {
  const sel = s.selected || "texto";
  const out = sel
    .split("\n")
    .map((l) => prefix + l)
    .join("\n");
  return { text: s.before + out + s.after, cursor: (s.before + out).length };
};

const ACTIONS: Action[] = [
  { id: "bold", icon: Bold, label: "Negrito", shortcut: "Ctrl+B", apply: wrap("**") },
  { id: "italic", icon: Italic, label: "Itálico", shortcut: "Ctrl+I", apply: wrap("*") },
  {
    id: "h2",
    icon: Heading2,
    label: "Título",
    shortcut: "Ctrl+2",
    apply: linePrefix("## "),
  },
  {
    id: "h3",
    icon: Heading3,
    label: "Subtítulo",
    shortcut: "Ctrl+3",
    apply: linePrefix("### "),
  },
  { id: "quote", icon: Quote, label: "Citação", apply: linePrefix("> ") },
  { id: "list", icon: List, label: "Lista", apply: linePrefix("- ") },
  {
    id: "hr",
    icon: Minus,
    label: "Divisor",
    apply: (s) => ({ text: s.before + "\n\n---\n\n" + s.selected + s.after }),
  },
  {
    id: "link",
    icon: Link2,
    label: "Link",
    shortcut: "Ctrl+K",
    apply: (s) => ({
      text: s.before + `[${s.selected || "texto"}](https://)` + s.after,
      cursor: s.before.length + (s.selected || "texto").length + 3,
    }),
  },
  {
    id: "img",
    icon: ImageIcon,
    label: "Imagem",
    apply: (s) => ({
      text: s.before + `![](https://)` + s.after,
      cursor: s.before.length + 5,
    }),
  },
  {
    id: "yt",
    icon: Youtube,
    label: "YouTube",
    apply: (s) => ({
      text: s.before + `\n\n[YouTube](https://youtu.be/ID)\n\n` + s.after,
    }),
  },
  {
    id: "spoiler",
    icon: EyeOff,
    label: "Spoiler",
    apply: wrap("||"),
  },
  {
    id: "emoji",
    icon: Smile,
    label: "Emoji",
    apply: (s) => ({ text: s.before + "✨ " + s.selected + s.after }),
  },
];

const MarkdownToolbar = ({ textareaRef, value, onChange, visible }: Props) => {
  const run = (action: Action) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);
    const out = action.apply({ before, selected, after });
    onChange(out.text);
    requestAnimationFrame(() => {
      ta.focus();
      const cur = out.cursor ?? before.length + (selected.length || 0);
      ta.setSelectionRange(cur, cur);
    });
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      const map: Record<string, string> = {
        b: "bold",
        i: "italic",
        k: "link",
        "2": "h2",
        "3": "h3",
      };
      const id = map[k];
      if (!id) return;
      const action = ACTIONS.find((a) => a.id === id);
      if (!action) return;
      e.preventDefault();
      run(action);
    };
    ta.addEventListener("keydown", onKey);
    return () => ta.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 -top-12 transition-all duration-200 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1"
      }`}
    >
      <div className="admin-toolbar-anim admin-glass border border-white/10 rounded-xl px-1.5 py-1.5 flex items-center gap-0.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_24px_-6px_rgba(255,255,255,0.15)]">
        {ACTIONS.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.id} className="flex items-center">
              {(i === 2 || i === 6 || i === 9) && (
                <span className="w-px h-5 bg-white/10 mx-0.5" />
              )}
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => run(a)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label={a.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-black/90 border-white/10 text-white text-xs"
                >
                  <span>{a.label}</span>
                  {a.shortcut && (
                    <span className="ml-2 text-white/40">{a.shortcut}</span>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarkdownToolbar;
