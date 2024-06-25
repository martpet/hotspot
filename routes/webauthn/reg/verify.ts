import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import { verifyRegistrationResponse } from "simplewebauthn/server";
import { ulid } from "ulid";
import { kv, KV_KEY, setPasskey, setUser } from "../../../utils/kv.ts";
import { setSession } from "../../../utils/session.ts";
import { User } from "../../../utils/types.ts";
import { createPasskeyObj } from "./(_utils)/regHelpers.ts";
import { REG_SESSION_COOKIE, RegSession } from "./(_utils)/regSession.ts";

export interface VerifiedRegRespJson {
  verified: boolean;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const regRespJson = await req.json();
    const regSessionId = getCookies(req.headers)[REG_SESSION_COOKIE];

    if (!regSessionId) {
      console.error("Missing reg session id");
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    const [{ value: regSession }] = await Promise.all([
      kv.get<RegSession>(KV_KEY.regSessions(regSessionId)),
      kv.delete(KV_KEY.regSessions(regSessionId)),
    ]);

    if (!regSession) {
      console.error("Cannot find reg session", regSessionId);
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: regRespJson,
        expectedChallenge: regSession.challenge,
        expectedOrigin: ctx.url.origin,
        expectedRPID: ctx.url.hostname,
        expectedType: "webauthn.create",
      });
    } catch (err) {
      console.error(err);
      return new Response(err.message, { status: STATUS_CODE.BadRequest });
    }

    const { registrationInfo, verified } = verification;

    if (!registrationInfo) {
      console.error("Missing 'registrationInfo'", verification);
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    }

    const user: User = {
      id: ulid(),
      username: regSession.username,
    };

    const passkey = createPasskeyObj({
      userId: user.id,
      webAuthnUserId: regSession.webAuthnUserId,
      registrationInfo,
      transports: regRespJson.transports,
    });

    const respJson: VerifiedRegRespJson = { verified };
    const resp = new Response(JSON.stringify(respJson));
    deleteCookie(resp.headers, REG_SESSION_COOKIE, { path: "/" });

    const commitResults = await Promise.all([
      setUser(user),
      setPasskey(passkey),
      setSession(resp.headers, user),
    ]);

    for (let i = 0; i < commitResults.length; i++) {
      if (!commitResults[i].ok) {
        console.error(`Failed to save ${["user", "passkey", "session"][i]}`);
        return new Response(null, { status: STATUS_CODE.InternalServerError });
      }
    }

    return resp;
  },
};
