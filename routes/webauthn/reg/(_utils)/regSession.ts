import { setCookie } from "$std/http/cookie.ts";
import { kv, KV_KEY } from "../../../../utils/kv.ts";
import { CEREMONY_TIMEOUT } from "./regConsts.ts";

export const REG_SESSION_COOKIE = "reg_session";

export interface RegSession {
  id: string;
  challenge: string;
  username: string;
  webAuthnUserId: string;
}

export function setRegSession(headers: Headers, regSession: RegSession) {
  setCookie(headers, {
    name: REG_SESSION_COOKIE,
    value: regSession.id,
    path: "/",
    httpOnly: true,
    maxAge: CEREMONY_TIMEOUT / 1000,
  });
  return kv.set(
    KV_KEY.regSessions(regSession.id),
    regSession,
    { expireIn: CEREMONY_TIMEOUT },
  );
}
