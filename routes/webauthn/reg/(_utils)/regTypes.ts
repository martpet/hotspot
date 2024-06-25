export enum RegStatus {
  Idle = "IDLE",
  Pending = "PENDING",
  Success = "SUCCESS",
  Aborted = "ABORTED",
  WebAuthnUnsupported = "WEBAUTHN_UNSUPPORTED",
  UsernameBadLength = "USERNAME_BAD_LENGTH",
  UsernamePatternMismatch = "USERNAME_PATTERN_MISMATCH",
  UsernameAlreadyExists = "USERNAME_ALREADY_EXISTS",
  AuthenticatorError = "AUTHENTICATOR_ERROR",
  GeneralError = "GENERAL_ERROR",
}
