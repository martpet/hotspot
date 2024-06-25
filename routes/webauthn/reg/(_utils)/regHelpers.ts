import { WebAuthnError } from "simplewebauthn/browser";
import { VerifiedRegistrationResponse } from "simplewebauthn/server";
import { Passkey } from "../../../../utils/types.ts";
import { AUTHENTICATOR_ERROR_CODES } from "./regConsts.ts";
import { RegStatus } from "./regTypes.ts";

export function isRegStatus(value: unknown): value is RegStatus {
  return typeof value === "string" &&
    Object.values(RegStatus).includes(value as RegStatus);
}

export function isAuthenticatorError(value: unknown): value is WebAuthnError {
  return value instanceof WebAuthnError &&
    AUTHENTICATOR_ERROR_CODES.includes(value.code);
}

export function createPasskeyObj(
  {
    userId,
    webAuthnUserId,
    registrationInfo,
    transports,
  }: {
    userId: string;
    webAuthnUserId: string;
    registrationInfo: NonNullable<
      VerifiedRegistrationResponse["registrationInfo"]
    >;
    transports?: AuthenticatorTransport[];
  },
): Passkey {
  const now = new Date();
  return {
    id: registrationInfo.credentialID,
    userId,
    webAuthnUserId,
    pubKey: registrationInfo.credentialPublicKey,
    counter: registrationInfo.counter,
    backedUp: registrationInfo.credentialBackedUp,
    transports,
    createdAt: now,
    lastUsed: now,
  };
}
