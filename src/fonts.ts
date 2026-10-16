import type { Font } from "satori";

/**
 * Which Noto family covers which characters. Inter draws everything that is
 * not listed here (Latin, Cyrillic, Greek, punctuation), so it comes first and
 * the rest are only fetched when the text actually needs them.
 */
const SCRIPTS: { families: string[]; ranges: [number, number][] }[] = [
  {
    // Han and kana. The ranges cannot tell Japanese from Chinese, so JP goes
    // first — satori prefers the earlier font — and SC fills in the characters
    // JP simply does not have (贴, 线, 简 ...).
    families: ["Noto Sans JP", "Noto Sans SC"],
    ranges: [
      [0x3000, 0x30ff], // CJK punctuation, hiragana, katakana
      [0x3400, 0x4dbf], // CJK extension A
      [0x4e00, 0x9fff], // CJK unified ideographs
      [0xf900, 0xfaff], // compatibility ideographs
      [0xff00, 0xffef], // full-width forms
      [0x20000, 0x2ffff], // CJK extensions B and up
    ],
  },
  {
    families: ["Noto Sans KR"],
    ranges: [
      [0x1100, 0x11ff], // jamo
      [0x3130, 0x318f], // compatibility jamo
      [0xa960, 0xa97f], // jamo extended A
      [0xac00, 0xd7ff], // syllables, jamo extended B
    ],
  },
  { families: ["Noto Sans Thai"], ranges: [[0x0e00, 0x0e7f]] },
  {
    families: ["Noto Sans Arabic"],
    ranges: [
      [0x0600, 0x06ff],
      [0x0750, 0x077f],
      [0x08a0, 0x08ff],
      [0xfb50, 0xfdff], // presentation forms A
      [0xfe70, 0xfeff], // presentation forms B
    ],
  },
  { families: ["Noto Sans Devanagari"], ranges: [[0x0900, 0x097f]] },
];

const ORDER = ["Inter", ...SCRIPTS.flatMap((script) => script.families)];
const WEIGHTS = [400, 700] as const;

/**
 * The families `text` needs, in the order satori should try them, each mapped
 * to the characters to ask Google Fonts for. A family only appears when some
 * character wants it, which keeps the requests down and keeps us from asking
 * for a subset that would come back without a single glyph.
 */
export const subsets = (text: string): Map<string, string> => {
  const chars = new Map<string, Set<string>>();
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    const script = SCRIPTS.find(({ ranges }) =>
      ranges.some(([from, to]) => code >= from && code <= to),
    );
    for (const family of script ? script.families : ["Inter"]) {
      const set = chars.get(family) ?? new Set();
      chars.set(family, set.add(char));
    }
  }
  return new Map(
    ORDER.filter((family) => chars.has(family)).map((family) => [
      family,
      [...(chars.get(family) ?? [])].join(""),
    ]),
  );
};

const loadFont = async (
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | undefined> => {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`,
    )
  ).text();
  const url = css.match(
    /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/,
  )?.[1];
  if (!url) return undefined;
  return (await fetch(url)).arrayBuffer();
};

/** The fonts satori needs to draw `text`, fetched as one subset per family. */
export const loadFonts = async (text: string): Promise<Font[]> => {
  const fonts = await Promise.all(
    [...subsets(text)].flatMap(([name, chars]) =>
      WEIGHTS.map(async (weight) => {
        const data = await loadFont(name, weight, chars);
        return data
          ? { name, data, weight, style: "normal" as const }
          : undefined;
      }),
    ),
  );
  return fonts.filter((font) => font !== undefined);
};
