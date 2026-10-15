# og-image

Open Graph images on the fly: put the title in the URL and get a 1200×630 PNG.

```
https://simple-og-image.vercel.app/<title>.png?siteTitle=yokinist.me
```

Drawn with [Satori](https://github.com/vercel/satori) and [resvg](https://github.com/yisibl/resvg-js), so no browser runs. Text is set in Inter and Noto Sans JP, fetched from Google Fonts with only the characters used, and emoji are [Twemoji](https://github.com/jdecked/twemoji).

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| `title` | the path | The title, from `/<title>.png` or `?title=`. Long titles shrink to fit three lines (two with a description). |
| `siteTitle` | | Shown above the title, with a dot of the accent color or the logo. |
| `description` | | One or two lines under the title. |
| `author`, `date` | | Shown at the bottom, as given. |
| `logo` | | An `https` image next to the site title. |
| `layout` | `split` | `split`, `standard` or `center`. |
| `theme` | `dark` | `dark` or `light`; sets the colors below. |
| `background`, `foreground`, `accent` | from the theme | A hex, `rgb()`/`hsl()` or color keyword. Encode `#` as `%23`. |
| `fontSize` | `72` | The largest the title gets, 32 to 128 (`96px` works too). |

Values that are invalid fall back to the defaults. `md` and `isTwitter`, from the original service, are accepted and ignored.

## Examples

```
/Hello%20world.png?siteTitle=yokinist.me&author=yokinist&date=2026-10-15
/x.png?title=Hello&layout=center&theme=light&accent=%23f97316
/x.png?title=Hello&layout=split&logo=https://github.com/yokinist.png
```

| standard | center | split |
| --- | --- | --- |
| ![](https://simple-og-image.vercel.app/Next.js%20%E3%81%A8%20Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8A%E7%9B%B4%E3%81%97%E3%81%9F.png?siteTitle=yokinist.me&author=yokinist&date=2026-10-15) | ![](https://simple-og-image.vercel.app/Next.js%20%E3%81%A8%20Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8A%E7%9B%B4%E3%81%97%E3%81%9F.png?siteTitle=yokinist.me&author=yokinist&date=2026-10-15&layout=center) | ![](https://simple-og-image.vercel.app/Next.js%20%E3%81%A8%20Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8A%E7%9B%B4%E3%81%97%E3%81%9F.png?siteTitle=yokinist.me&date=2026-10-15&layout=split&logo=https://github.com/yokinist.png) |

Responses are cached for a year, so a URL keeps its image. Change a parameter to get a new one.

## Development

```bash
npm install
npm run preview  # draws sample cards into preview/
npm test
vercel dev       # the API at localhost:3000
```

The card is `src/card.tsx`; the parameters are read in `src/options.ts`. Deploys to Vercel as is, on Node 24.

## License

MIT. Forked from [vercel/og-image](https://github.com/vercel/og-image).
