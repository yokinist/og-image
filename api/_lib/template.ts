import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);


const noto = readFileSync(
  `${__dirname}/../_fonts/NotoSansCJKjp-Regular.woff2`
).toString("base64");

const notoBold = readFileSync(
  `${__dirname}/../_fonts/NotoSansCJKjp-Bold.woff2`
).toString("base64");

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

function getCss({
  background,
  foreground,
  accentColor,
  fontSize
}: Pick<ParsedRequest, 'background' | 'foreground' | 'accentColor' | 'fontSize'>) {
  let currentBackground = background ?? "white";
  let currentForeground = foreground ?? "black";
  return `
    @font-face {
        font-family: 'noto-sans-cjk-jp';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${noto}) format('woff2');
    }
    @font-face {
        font-family: 'noto-sans-cjk-jp';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${notoBold}) format('woff2');
    }
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${currentBackground};
        height: calc(100vh - 90px);
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        border: 45px solid ${accentColor};
        padding: 0;
    }

    body.twitter {
      height: calc(100vh - 220px);
      border: solid ${accentColor};
      border-width: 110px 45px 110px 45px;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }
    code:before, code:after {
        content: '\`';
    }
    .logo {
        margin: 0 75px;
    }
    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }
    .spacer {
        margin: 150px;
    }
    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .wrapper {
      width: 80%;
    }

    .heading {
        font-family: 'noto-sans-cjk-jp', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-weight: bold;
        font-style: normal;
        color: ${currentForeground};
        line-height: 1.8;
        width: 100%;
        margin: 0 auto;
    }

    .footer {
      display: flex;
      font-family: 'noto-sans-cjk-jp', 'Inter', sans-serif;
      color: ${foreground};
      line-height: 1.8;
      font-size: 64px;
      width: 100%;
      margin: 0 auto;
      justify-content: between;
    }

    .site {
      display: inline-block;
      font-weight: bold;
      margin: 0 auto;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, background, foreground, md, fontSize, siteTitle, accentColor, isTwitter } =
    parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss({
          background,
          foreground,
          accentColor,
          fontSize
        })}
    </style>
    <body class=${isTwitter ? 'twitter' : ''}>
      <div class="wrapper">
        <div class="heading">${emojify(
          md ? marked(text) : sanitizeHtml(text)
        )}
        </div>
        <div class="footer">
          <p class="site">${siteTitle ?? ''}</p>
        </div>
      </div>
    </body>
</html>`;
}