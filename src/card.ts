import { type CSSProperties, createElement, type ReactNode } from "react";
import type { CardOptions } from "./options.js";

// Written without JSX: Vercel leaves .tsx files out of its functions

export const WIDTH = 1200;
export const HEIGHT = 630;
const PADDING = 72;

const box = (style: CSSProperties, ...children: ReactNode[]) =>
  createElement("div", { style: { display: "flex", ...style } }, ...children);

const image = (src: string, size: number, radius: number) =>
  createElement("img", {
    src,
    width: size,
    height: size,
    style: { borderRadius: radius, objectFit: "cover" },
    alt: "",
  });

// Rough width of a character in em: CJK and emoji are square, Latin narrower
const charWidth = (char: string) =>
  /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯]|\p{Extended_Pictographic}/u.test(char) ? 1 : 0.56;

/** The largest size, up to `max`, at which `text` fits `lines` lines of `width`. */
export const fitFontSize = (
  text: string,
  { max, width, lines }: { max: number; width: number; lines: number },
) => {
  const em = [...text].reduce((sum, char) => sum + charWidth(char), 0);
  for (let size = max; size > 32; size -= 2) {
    // Wrapping breaks at words, so leave some slack per line
    if (Math.ceil((em * size) / (width * 0.92)) <= lines) return size;
  }
  return 32;
};

const site = (options: CardOptions) =>
  options.siteTitle || options.logo
    ? box(
        { alignItems: "center", gap: 16, fontSize: 30 },
        options.logo
          ? image(options.logo, 48, 12)
          : box({
              width: 14,
              height: 14,
              borderRadius: 999,
              background: options.accent,
            }),
        options.siteTitle && box({ fontWeight: 700 }, options.siteTitle),
      )
    : null;

// An empty box keeps the title in the middle when there is no byline
const byline = (options: CardOptions) =>
  box(
    { fontSize: 26, opacity: 0.6 },
    [options.author, options.date].filter(Boolean).join("  ·  "),
  );

const title = (options: CardOptions, width: number, center = false) => {
  const lines = options.description ? 2 : 3;
  const fontSize = fitFontSize(options.title, {
    max: options.fontSize,
    width,
    lines,
  });
  return box(
    {
      flexDirection: "column",
      width,
      gap: 20,
      alignItems: center ? "center" : "flex-start",
      textAlign: center ? "center" : "left",
    },
    box(
      {
        display: "block",
        fontSize,
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        lineClamp: lines,
      },
      options.title,
    ),
    options.description &&
      box(
        {
          display: "block",
          fontSize: 30,
          lineHeight: 1.5,
          opacity: 0.6,
          lineClamp: 2,
        },
        options.description,
      ),
  );
};

const frame = (options: CardOptions): CSSProperties => ({
  width: WIDTH,
  height: HEIGHT,
  boxSizing: "border-box",
  color: options.foreground,
  background: options.background,
  fontFamily: "Inter, Noto Sans JP",
});

// Title on the left, the site above and the byline below; a glow of the
// accent color in the corner and a bar along the bottom
const standard = (options: CardOptions) =>
  box(
    {
      ...frame(options),
      flexDirection: "column",
      justifyContent: "space-between",
      padding: PADDING,
      backgroundImage: `radial-gradient(circle at 100% 0%, ${options.accent}33, transparent 55%)`,
    },
    site(options),
    title(options, WIDTH - PADDING * 2),
    box(
      { alignItems: "center", justifyContent: "space-between" },
      byline(options),
      box({
        width: 120,
        height: 8,
        borderRadius: 999,
        background: options.accent,
      }),
    ),
  );

// Everything centered inside a gradient frame
const center = (options: CardOptions) =>
  box(
    {
      ...frame(options),
      padding: 20,
      backgroundImage: `linear-gradient(135deg, ${options.accent}, ${options.background} 60%, ${options.accent})`,
    },
    box(
      {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        padding: PADDING - 20,
        borderRadius: 24,
        background: options.background,
      },
      title(options, WIDTH - PADDING * 2, true),
      box({ alignItems: "center", gap: 28 }, site(options), byline(options)),
    ),
  );

// Text on the left, a panel of the accent color on the right
const split = (options: CardOptions) => {
  const panel = 300;
  return box(
    frame(options),
    box(
      {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: PADDING,
      },
      site(options),
      title(options, WIDTH - panel - PADDING * 2),
      byline(options),
    ),
    box(
      {
        width: panel,
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(160deg, ${options.accent}, ${options.accent}55)`,
      },
      options.logo && image(options.logo, 140, 32),
    ),
  );
};

/** The card as a React element for satori. */
export const card = (options: CardOptions) =>
  ({ standard, center, split })[options.layout](options);
