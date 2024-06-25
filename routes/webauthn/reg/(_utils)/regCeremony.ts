import { signal } from "@preact/signals";
import {
  startRegistration,
  WebAuthnAbortService,
} from "simplewebauthn/browser";
import { VerifiedRegRespJson } from "../verify.ts";
import { isAuthenticatorError, isRegStatus } from "./regHelpers.ts";
import { RegStatus } from "./regTypes.ts";

export const regAbortController = signal<AbortController | null>(null);

export default async function regCeremony(
  username: string,
): Promise<RegStatus> {
  if (!PublicKeyCredential) return RegStatus.WebAuthnUnsupported;
  try {
    return await ceremony(username);
  } catch (err) {
    console.error(err);
    if (err.name === "AbortError") return RegStatus.Aborted;
    if (isAuthenticatorError(err)) return RegStatus.AuthenticatorError;
    return RegStatus.GeneralError;
  }
}

async function ceremony(username: string): Promise<RegStatus> {
  regAbortController.value?.abort("Started new reg ceremony");
  regAbortController.value = new AbortController();
  regAbortController.value.signal.addEventListener("abort", () => {
    WebAuthnAbortService.cancelCeremony();
  });

  const optionsResp = await fetch("/webauthn/reg/options", {
    method: "POST",
    body: username,
    signal: regAbortController.value.signal,
  });

  if (!optionsResp.ok) {
    const text = await optionsResp.text();
    if (isRegStatus(text)) return text;
    throw new Error(`"options" response not ok: "${text}"`);
  }

  const registrationRespJson = await startRegistration(
    await optionsResp.json(),
  );

  const verifiedRegResp = await fetch("/webauthn/reg/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationRespJson),
    signal: regAbortController.value.signal,
  });

  if (!verifiedRegResp.ok) {
    const text = await optionsResp.text();
    throw new Error(`"verify" response not ok: "${text}"`);
  }

  const { verified } = await verifiedRegResp.json() as VerifiedRegRespJson;
  if (!verified) throw new Error("Verification negative");
  return RegStatus.Success;
}
