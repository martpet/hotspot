import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from "simplewebauthn/server";
import { kv, KV_KEY } from "../../../utils/kv.ts";
import {
  CEREMONY_TIMEOUT,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "./(_utils)/regConsts.ts";
import { RegSession, setRegSession } from "./(_utils)/regSession.ts";
import { RegStatus } from "./(_utils)/regTypes.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const username = await req.text();
    if (
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      return new Response(RegStatus.UsernameBadLength, {
        status: STATUS_CODE.BadRequest,
      });
    }

    if (!username.match(USERNAME_PATTERN)) {
      return new Response(RegStatus.UsernamePatternMismatch, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const userEntry = await kv.get(KV_KEY.usersByUsername(username));

    if (userEntry.value) {
      return new Response(RegStatus.UsernameAlreadyExists, {
        status: STATUS_CODE.BadRequest,
      });
    }

    const genRegOptionsOpts: GenerateRegistrationOptionsOpts = {
      rpName: "Hotspot",
      rpID: ctx.url.hostname,
      userName: username,
      timeout: CEREMONY_TIMEOUT,
    };

    let regOptions;
    try {
      regOptions = await generateRegistrationOptions(genRegOptionsOpts);
    } catch (err) {
      console.error(err);
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    }

    const resp = new Response(JSON.stringify(regOptions));

    const regSession: RegSession = {
      id: crypto.randomUUID(),
      challenge: regOptions.challenge,
      webAuthnUserId: regOptions.user.id,
      username,
    };

    const regSessionCommitResult = await setRegSession(
      resp.headers,
      regSession,
    );

    if (!regSessionCommitResult.ok) {
      console.error("Failed to save reg session");
      return new Response(null, { status: STATUS_CODE.InternalServerError });
    }

    return resp;
  },
};
