import { FreshContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { kv, KV_KEY } from "./kv.ts";
import { State, User } from "./types.ts";

const SESSION_COOKIE = "session";

export function setSession(headers: Headers, user: User) {
  const sessionId = crypto.randomUUID();
  setCookie(headers, {
    name: SESSION_COOKIE,
    value: sessionId,
    httpOnly: true,
    path: "/",
  });
  return kv.set(KV_KEY.sessions(sessionId), user.id);
}

export async function sessionMiddleware(
  req: Request,
  ctx: FreshContext<State>,
) {
  const skip = req.method === "OPTIONS" ||
    ctx.url.pathname.startsWith("/static");

  if (skip) return ctx.next();
  ctx.state.user = null;
  const sessionId = getCookies(req.headers)[SESSION_COOKIE];
  if (sessionId) {
    const { value: userId } = await kv.get<string>(KV_KEY.sessions(sessionId));
    if (userId) {
      const userEntry = await kv.get<User>(KV_KEY.users(userId));
      ctx.state.user = userEntry.value;
    }
  }
  return ctx.next();
}
