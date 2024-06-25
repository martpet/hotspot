import { JSX } from "preact";
import { MutableRef } from "preact/hooks";
import { regAbortController } from "../(_utils)/regCeremony.ts";

interface RegProgressDialogProps extends JSX.HTMLAttributes<HTMLDialogElement> {
  dialogRef: MutableRef<HTMLDialogElement | null>;
}

export default function RegProgressDialog(props: RegProgressDialogProps) {
  const { dialogRef, ...attr } = props;

  return (
    <dialog
      {...attr}
      ref={dialogRef}
      onCancel={(e) => e.preventDefault()}
    >
      <h2 class="italic">
        Creating account…
      </h2>
      <div class="flex flex-col items-center gap-5">
        <img
          class="dark:invert"
          alt="Loader"
          src="/spinner.svg"
        />
        <button onClick={() => regAbortController.value?.abort()}>
          Cancel
        </button>
      </div>
    </dialog>
  );
}
