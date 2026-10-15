import { parseOptions } from "../src/options.js";
import { render } from "../src/render.js";

export async function GET(request: Request) {
  const options = parseOptions(new URL(request.url));
  if (!options.title) {
    return new Response("Give a title: /<title>.png or ?title=", {
      status: 400,
    });
  }
  try {
    const png = await render(options);
    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, immutable, no-transform, s-maxage=31536000, max-age=31536000",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to draw the image", { status: 500 });
  }
}
