// Renders sample cards into preview/ to check the design without deploying
import { mkdir, writeFile } from "node:fs/promises";
import { parseOptions } from "../src/options.js";
import { render } from "../src/render.js";

const samples: Record<string, string> = {
  // The URL yokinist.me builds with the original service's parameters
  legacy:
    "/Next.js%20%E3%81%A8%20Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8A%E7%9B%B4%E3%81%97%E3%81%9F.png?md=1&fontSize=96px&background=%2318181b&foreground=%23fafafa&siteTitle=yokinist.me",
  standard:
    "/x.png?title=Next.js と Notion API でブログを作り直した 🚀&siteTitle=yokinist.me&description=react-notion-x から公式 API と React Server Components に移行した記録&author=yokinist&date=2026-10-15",
  "standard-light":
    "/x.png?title=Building a blog on the official Notion API with React Server Components&siteTitle=notion-kit&author=yokinist&date=Oct 15, 2026&theme=light",
  center:
    "/x.png?title=Next.js と Notion API でブログを作り直した 🚀&siteTitle=yokinist.me&author=yokinist&date=2026-10-15&layout=center",
  "center-light":
    "/x.png?title=Short title&siteTitle=notion-kit&layout=center&theme=light&accent=%23f97316",
  split:
    "/x.png?title=Next.js と Notion API でブログを作り直した 🚀&siteTitle=yokinist.me&description=react-notion-x から公式 API と RSC に移行した記録&date=2026-10-15&layout=split&logo=https://github.com/yokinist.png",
  "split-light":
    "/x.png?title=とても長いタイトルがどこまで小さくなって何行に収まるのかを確かめるための、わざと長くした記事のタイトルです&siteTitle=yokinist.me&layout=split&theme=light&accent=%2310b981",
};

await mkdir("preview", { recursive: true });
for (const [name, path] of Object.entries(samples)) {
  const png = await render(parseOptions(new URL(path, "https://og.test")));
  await writeFile(`preview/${name}.png`, png);
  console.log(`preview/${name}.png`);
}
