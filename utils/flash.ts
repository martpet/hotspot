import { FreshContext } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/cookie.ts";
import type { Alert, State } from "../utils/types.ts";

const FLASH_COOKIE = "flash";

export function setFlash(headers: Headers, alert: Alert) {
  setCookie(headers, {
    name: FLASH_COOKIE,
    value: encodeURIComponent(JSON.stringify(alert)),
    httpOnly: true,
    path: "/",
  });
}

export async function flashMiddleware(
  req: Request,
  ctx: FreshContext<State>,
) {
  const flash = getCookies(req.headers)[FLASH_COOKIE];
  if (flash) {
    ctx.state.flash = JSON.parse(decodeURIComponent(flash));
  }
  const resp = await ctx.next();
  if (flash) {
    deleteCookie(resp.headers, FLASH_COOKIE);
  }
  return resp;
}
