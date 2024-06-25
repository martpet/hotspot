import { MINUTE } from "https://deno.land/std@0.216.0/datetime/constants.ts";
import { WebAuthnErrorCode } from "simplewebauthn/browser";
import { Alert } from "../../../../utils/types.ts";
import { RegStatus } from "./regTypes.ts";

export const CEREMONY_TIMEOUT = MINUTE;

export const USERNAME_MIN_LENGTH = 4;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_PATTERN = "^[a-z0-9._-]+$";
export const USERNAME_PATTERN_DESC =
  "small letters, numbers, dots, hyphens, and underscores";

export const AUTHENTICATOR_ERROR_CODES: WebAuthnErrorCode[] = [
  "ERROR_AUTHENTICATOR_GENERAL_ERROR",
  "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
  "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
  "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
  "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
  "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
];

export const ALERTS: { [key in RegStatus]: Alert | null } = {
  [RegStatus.Idle]: null,
  [RegStatus.Pending]: null,
  [RegStatus.Success]: {
    msg: "Registration was successful.",
    type: "success",
  },
  [RegStatus.Aborted]: {
    msg: "Registration was canceled.",
    type: "error",
  },
  [RegStatus.WebAuthnUnsupported]: {
    msg: "Your browser doesn't support Passkeys.",
    type: "error",
  },
  [RegStatus.UsernameBadLength]: {
    msg:
      `Username length must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters.`,
    type: "error",
  },
  [RegStatus.UsernamePatternMismatch]: {
    msg: `Username can contain only ${USERNAME_PATTERN_DESC}.`,
    type: "error",
  },
  [RegStatus.UsernameAlreadyExists]: {
    msg: "Username is already registered.",
    type: "error",
  },
  [RegStatus.AuthenticatorError]: {
    msg: "Registration was not completed.",
    type: "error",
  },
  [RegStatus.GeneralError]: {
    msg: "Something went wrong!",
    type: "error",
  },
};
