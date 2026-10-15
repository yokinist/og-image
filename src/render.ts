import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { card, HEIGHT, WIDTH } from "./card.js";
import { loadEmoji } from "./emoji.js";
import { loadFonts } from "./fonts.js";
import type { CardOptions } from "./options.js";

/** Draws the card as a PNG. */
export const render = async (options: CardOptions) => {
  const text = [
    options.title,
    options.siteTitle,
    options.description,
    options.author,
    options.date,
    "·",
  ].join("");
  const svg = await satori(card(options), {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(text),
    loadAdditionalAsset: async (code, segment) =>
      code === "emoji" ? loadEmoji(segment) : [],
  });
  return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
    .render()
    .asPng();
};
