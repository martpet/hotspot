import { IS_BROWSER } from "$fresh/src/runtime/utils.ts";
import {
  Signal,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { ALERTS } from "../(_utils)/regConsts.ts";
import { RegStatus } from "../(_utils)/regTypes.ts";
import AlertDialog from "../../../../components/AlertDialog.tsx";
import RegForm from "./RegForm.tsx";
import ProgressDialog from "./RegProgressDialog.tsx";

interface RegDialogProps {
  dialogOpenSignal: Signal<boolean>;
}

export default function RegDialog({ dialogOpenSignal }: RegDialogProps) {
  if (!IS_BROWSER) return null;

  const statusSignal = useSignal(RegStatus.Idle);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const progressDialogRef = useRef<HTMLDialogElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const alert = ALERTS[statusSignal.value];

  useSignalEffect(() => {
    if (dialogOpenSignal.value) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
      if (usernameRef.current) usernameRef.current.value = "";
      if (statusSignal.peek() !== RegStatus.WebAuthnUnsupported) {
        statusSignal.value = RegStatus.Idle;
      }
    }
  });

  useSignalEffect(() => {
    if (statusSignal.value === RegStatus.Success) {
      location.reload();
    } else if (statusSignal.value === RegStatus.Pending) {
      dialogRef.current!.hidden = true;
      progressDialogRef.current!.showModal();
    } else {
      dialogRef.current!.hidden = false;
      progressDialogRef.current!.close();
    }
  });

  const onCancel: JSX.GenericEventHandler<HTMLDialogElement> = (ev) => {
    ev.preventDefault();
    if (statusSignal.value !== RegStatus.Pending) {
      dialogOpenSignal.value = false;
    }
  };

  const isFormHiddenSignal = useComputed(() =>
    [RegStatus.Success, RegStatus.WebAuthnUnsupported].includes(
      statusSignal.value,
    )
  );

  return (
    <>
      <dialog ref={dialogRef} class="w-auto max-w-sm" onCancel={onCancel}>
        <h2 class="mt-2">Register</h2>
        {alert && <AlertDialog class="mb-6" alert={alert} />}
        <RegForm
          class="mb-7"
          hidden={isFormHiddenSignal}
          usernameRef={usernameRef}
          statusSignal={statusSignal}
        />
        {statusSignal.value !== RegStatus.Success
          ? (
            <button onClick={() => dialogOpenSignal.value = false}>
              Close
            </button>
          )
          : (
            <div class="flex items-center gap-1">
              <img src="/static/spinner.svg" alt="spinner" />
              Redirecting
            </div>
          )}
      </dialog>
      <ProgressDialog dialogRef={progressDialogRef} />
    </>
  );
}
