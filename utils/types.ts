import { AuthenticatorTransportFuture } from "simplewebauthn/types";

export interface State {
  flash: Alert | null;
  user?: User | null;
}

export interface User {
  id: string;
  username: string;
}

export interface Passkey {
  id: string;
  pubKey: Uint8Array;
  userId: string;
  webAuthnUserId: string;
  counter: number;
  backedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
  createdAt: Date;
  lastUsed: Date;
}

export interface Alert {
  msg: string;
  type: "info" | "warning" | "error" | "success";
}
