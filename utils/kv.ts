import { Passkey, User } from "./types.ts";

export const kv = await Deno.openKv();

export const KV_KEY = {
  users: (id: string) => ["users", id],
  usersByUsername: (username: string) => ["users_by_username", username],
  passkeys: (id: string) => ["passkeys", id],
  passkeysByUser: (id: string) => ["passkeys", id],
  sessions: (id: string) => ["sessions", id],
  regSessions: (id: string) => ["reg_session", id],
};

export function setUser(user: User) {
  return kv.atomic()
    .set(KV_KEY.users(user.id), user)
    .set(KV_KEY.usersByUsername(user.username), user)
    .commit();
}

export function setPasskey(passkey: Passkey) {
  return kv.atomic()
    .set(KV_KEY.passkeys(passkey.id), passkey)
    .set(KV_KEY.passkeysByUser(passkey.userId), passkey)
    .commit();
}
