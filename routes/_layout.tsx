import { PageProps } from "$fresh/server.ts";
import AlertDialog from "../components/AlertDialog.tsx";
import { State } from "../utils/types.ts";

export default function Layout(
  { Component, state }: PageProps<undefined, State>,
) {
  const { flash } = state;
  return (
    <>
      {flash && <AlertDialog closable alert={flash} />}
      <Component />
    </>
  );
}
