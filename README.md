# og-image

Open Graph images on the fly: put the title in the URL and get a 1200×630 PNG.

```
https://simple-og-image.vercel.app/<title>.png?siteTitle=yokinist.me
```

Try the parameters at [simple-og-image.vercel.app](https://simple-og-image.vercel.app). Drawn with [Satori](https://github.com/vercel/satori) and [resvg](https://github.com/yisibl/resvg-js), so no browser runs. Text is set in Inter and Noto Sans JP, fetched from Google Fonts with only the characters used, and emoji are [Twemoji](https://github.com/jdecked/twemoji).

## Parameters

| Parameter | Default | |
| --- | --- | --- |
| `title` | the path | The title, from `/<title>.png` or `?title=`. Long titles shrink to fit three lines (two with a description). |
| `siteTitle` | | Shown above the title, with a dot of the accent color or the logo. |
| `description` | | One or two lines under the title. |
| `author`, `date` | | Shown at the bottom, as given. |
| `logo` | | An `https` image next to the site title. |
| `layout` | `standard` | `standard`, `center` or `split`. |
| `theme` | `dark` | `dark` or `light`; sets the colors below. |
| `background`, `foreground`, `accent` | from the theme | A hex, `rgb()`/`hsl()` or color keyword. Encode `#` as `%23`. |
| `fontSize` | `72` | The largest the title gets, 32 to 128 (`96px` works too). |

Values that are invalid fall back to the defaults. `md` and `isTwitter`, from the original service, are accepted and ignored.

## Examples

Each image below is the URL above it, drawn by the live service. Try your own at [simple-og-image.vercel.app](https://simple-og-image.vercel.app).

### standard

The default: dark, with a description and a byline.

```
/Open Graph images from a URL 🖼️.png?siteTitle=og-image&description=Put the title in the path and get a 1200×630 PNG&author=yokinist&date=2026-10-15
```

<img src="https://simple-og-image.vercel.app/Open%20Graph%20images%20from%20a%20URL%20%F0%9F%96%BC%EF%B8%8F.png?siteTitle=og-image&description=Put%20the%20title%20in%20the%20path%20and%20get%20a%201200%C3%97630%20PNG&author=yokinist&date=2026-10-15" width="600" alt="standard">

### center

`layout=center`, `theme=light` and an orange `accent`.

```
/Notion API でブログを作る.png?layout=center&theme=light&accent=%23f97316&siteTitle=yokinist.me&author=yokinist&date=2026年10月15日
```

<img src="https://simple-og-image.vercel.app/Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8B.png?layout=center&theme=light&accent=%23f97316&siteTitle=yokinist.me&author=yokinist&date=2026%E5%B9%B410%E6%9C%8815%E6%97%A5" width="600" alt="center">

### split

`layout=split` with a `logo`, which also fills the panel on the right.

```
/Next.js と Notion API でブログを作り直した.png?layout=split&accent=%2310b981&logo=https://github.com/yokinist.png&siteTitle=yokinist.me&description=react-notion-x から公式 API に移行した記録&date=2026-10-15
```

<img src="https://simple-og-image.vercel.app/Next.js%20%E3%81%A8%20Notion%20API%20%E3%81%A7%E3%83%96%E3%83%AD%E3%82%B0%E3%82%92%E4%BD%9C%E3%82%8A%E7%9B%B4%E3%81%97%E3%81%9F.png?layout=split&accent=%2310b981&logo=https%3A%2F%2Fgithub.com%2Fyokinist.png&siteTitle=yokinist.me&description=react-notion-x%20%E3%81%8B%E3%82%89%E5%85%AC%E5%BC%8F%20API%20%E3%81%AB%E7%A7%BB%E8%A1%8C%E3%81%97%E3%81%9F%E8%A8%98%E9%8C%B2&date=2026-10-15" width="600" alt="split">

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
