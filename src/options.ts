export type Theme = "dark" | "light";
export type Layout = "standard" | "center" | "split";

export type CardOptions = {
  title: string;
  siteTitle?: string;
  description?: string;
  author?: string;
  date?: string;
  /** An https image shown next to the site title */
  logo?: string;
  theme: Theme;
  layout: Layout;
  background: string;
  foreground: string;
  /** Lines, the site title's mark and gradients */
  accent: string;
  /** The largest the title gets; long titles shrink to fit */
  fontSize: number;
};

export const THEMES: Record<
  Theme,
  Pick<CardOptions, "background" | "foreground" | "accent">
> = {
  dark: { background: "#09090b", foreground: "#fafafa", accent: "#38bdf8" },
  light: { background: "#fafafa", foreground: "#18181b", accent: "#0284c7" },
};

const LAYOUTS: Layout[] = ["standard", "center", "split"];

// Hex, rgb()/hsl() with plain numbers, or a color keyword
const COLOR = /^(#[\da-f]{3,8}|(rgb|hsl)a?\(\s*[\d.%\s,/]+\)|[a-z]{3,20})$/i;

const color = (value: string | null) =>
  value && COLOR.test(value.trim()) ? value.trim() : undefined;

const text = (value: string | null, max = 200) =>
  value?.trim() ? value.trim().slice(0, max) : undefined;

const https = (value: string | null) => {
  try {
    return value && new URL(value).protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
};

// "96px", "96" -> 96, kept to a size that fits the card
const size = (value: string | null) => {
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? Math.min(128, Math.max(32, n)) : 72;
};

// The title comes from the path, "/<title>.png", as the original service
// took it, or from ?title=
const titleOf = (url: URL) => {
  const fromQuery = url.searchParams.get("title");
  if (fromQuery) return fromQuery;
  const name = decodeURIComponent(url.pathname.slice(1));
  return name.replace(/\.(png|jpe?g)$/i, "");
};

/** Reads card options from a request URL. Unknown or unsafe values fall back to defaults. */
export const parseOptions = (url: URL): CardOptions => {
  const q = url.searchParams;
  const theme: Theme = q.get("theme") === "light" ? "light" : "dark";
  const layout = q.get("layout") as Layout | null;
  const defaults = THEMES[theme];
  return {
    title: text(titleOf(url), 300) ?? "",
    siteTitle: text(q.get("siteTitle"), 80),
    description: text(q.get("description")),
    author: text(q.get("author"), 80),
    date: text(q.get("date"), 40),
    logo: https(q.get("logo")),
    theme,
    layout: layout && LAYOUTS.includes(layout) ? layout : "standard",
    background: color(q.get("background")) ?? defaults.background,
    foreground: color(q.get("foreground")) ?? defaults.foreground,
    accent: color(q.get("accent")) ?? defaults.accent,
    fontSize: size(q.get("fontSize")),
  };
};
