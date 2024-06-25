import { useSignal } from "@preact/signals";
import RegDialog from "./RegDialog.tsx";

export default function RegButton() {
  const dialogOpenSignal = useSignal(false);

  return (
    <>
      <RegDialog dialogOpenSignal={dialogOpenSignal} />
      <button onClick={() => dialogOpenSignal.value = true}>
        Register
      </button>
    </>
  );
}
