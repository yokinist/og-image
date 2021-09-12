import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const {
      fontSize,
      siteTitle,
      background,
      foreground,
      accentColor,
      md,
      isTwitter,
    } = query || {};

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
      fileType: extension === "jpeg" ? extension : "png",
      text: decodeURIComponent(text),
      md: md === "1" || md === "true",
      fontSize: fontSize || "96px",
      siteTitle: typeof siteTitle === "string" ? siteTitle : '',
      background: typeof background === "string" ? background : "#090719",
      foreground: typeof foreground === "string" ? foreground : "#FFFFFF",
      accentColor: typeof accentColor === "string" ? accentColor : "#5a67d8",
      isTwitter: isTwitter === "1" || isTwitter === "true",
    };
    return parsedRequest;
}