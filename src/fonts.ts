import type { Font } from "satori";

// Inter for Latin text, Noto Sans JP for Japanese; each is fetched from
// Google Fonts with only the characters the card uses, as TrueType
const FAMILIES = ["Inter", "Noto Sans JP"];
const WEIGHTS = [400, 700] as const;

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

/** The fonts satori needs to draw `text`. */
export const loadFonts = async (text: string): Promise<Font[]> => {
  const fonts = await Promise.all(
    FAMILIES.flatMap((name) =>
      WEIGHTS.map(async (weight) => {
        const data = await loadFont(name, weight, text);
        return data
          ? { name, data, weight, style: "normal" as const }
          : undefined;
      }),
    ),
  );
  return fonts.filter((font) => font !== undefined);
};
