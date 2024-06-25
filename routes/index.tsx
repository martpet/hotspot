import { defineRoute } from "$fresh/server.ts";
import { kv } from "../utils/kv.ts";
import { User } from "../utils/types.ts";
import RegButton from "./webauthn/reg/(_islands)/RegButton.tsx";

export default defineRoute(async () => {
  const entries = await kv.list<User>({ prefix: ["users"] });
  const users = [];
  for await (const entry of entries) users.push(entry.value);

  return (
    <header>
      <header>
        <RegButton />
      </header>
      <h1>Hotspot</h1>
      <section>
        <h2>Users</h2>
        <ul>
          {users.reverse().map((user) => <li>{user.username}</li>)}
        </ul>
      </section>
    </header>
  );
});
