import { describe, expect, it } from "vitest";
import { parseOptions } from "./options.js";

const parse = (path: string) => parseOptions(new URL(path, "https://og.test"));

describe("parseOptions", () => {
  it("keeps the old URLs working: the title in the path, colors and the site title", () => {
    const options = parse(
      `/${encodeURIComponent("マイボトルの思わぬ恩恵")}.png?md=1&fontSize=96px&background=%23040808&foreground=%23ffffff&siteTitle=yokinist&isTwitter=true`,
    );

    expect(options).toMatchObject({
      title: "マイボトルの思わぬ恩恵",
      siteTitle: "yokinist",
      background: "#040808",
      foreground: "#ffffff",
      fontSize: 96,
    });
  });

  it("takes the title from ?title= too, and keeps dots in it", () => {
    expect(parse("/?title=Hello").title).toBe("Hello");
    expect(parse(`/${encodeURIComponent("v1.2 is out")}.png`).title).toBe(
      "v1.2 is out",
    );
  });

  it("uses each theme's colors unless they are given", () => {
    expect(parse("/a.png")).toMatchObject({
      theme: "dark",
      layout: "standard",
    });
    const light = parse("/a.png?theme=light");
    const dark = parse("/a.png?theme=dark");
    expect(light.background).not.toBe(dark.background);
    expect(light.foreground).not.toBe(dark.foreground);
    expect(parse("/a.png?theme=light&background=%23fafafa").background).toBe(
      "#fafafa",
    );
  });

  it("reads the description, author, date, accent, layout and logo", () => {
    expect(
      parse(
        "/a.png?description=More&author=yokinist&date=2026-10-15&accent=%2306b6d4&layout=center&logo=https%3A%2F%2Fexample.com%2Flogo.png",
      ),
    ).toMatchObject({
      description: "More",
      author: "yokinist",
      date: "2026-10-15",
      accent: "#06b6d4",
      layout: "center",
      logo: "https://example.com/logo.png",
    });
  });

  it("falls back to defaults for values it does not accept", () => {
    const defaults = parse("/a.png");
    const options = parse(
      "/a.png?background=url(x)&accent=javascript%3A&layout=nope&logo=http%3A%2F%2Fexample.com%2Fa.png&fontSize=9999",
    );

    expect(options.background).toBe(defaults.background);
    expect(options.accent).toBe(defaults.accent);
    expect(options.layout).toBe("standard");
    expect(options.logo).toBeUndefined();
    expect(options.fontSize).toBe(128);
  });

  it("caps long text", () => {
    expect(
      parse(`/a.png?description=${"x".repeat(1000)}`).description,
    ).toHaveLength(200);
  });
});
