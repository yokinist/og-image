// Twemoji, drawn as SVG images in place of emoji characters
const BASE = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/";

const codepoints = (emoji: string) =>
  [...emoji]
    .map((char) => char.codePointAt(0)?.toString(16))
    // Twemoji's file names leave out the variation selector
    .filter((code) => code && code !== "fe0f")
    .join("-");

export const loadEmoji = async (emoji: string) => {
  const response = await fetch(`${BASE}${codepoints(emoji)}.svg`);
  if (!response.ok) return "";
  const svg = await response.text();
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};
