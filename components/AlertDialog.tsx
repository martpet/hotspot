import { JSX } from "preact/jsx-runtime";
import { Alert } from "../utils/types.ts";

export interface AlertDialogProps
  extends JSX.HTMLAttributes<HTMLDialogElement> {
  alert: Alert;
  closable?: boolean;
}

export default function AlertDialog(props: AlertDialogProps) {
  const { alert, closable, ...dialogAttr } = props;

  return (
    <dialog
      open
      {...dialogAttr}
      class={`${
        dialogAttr.class || ""
      } static open:flex w-auto h-auto px-4 py-2 gap-3 items-center border-none ${
        {
          info: "bg-blue-700 text-white",
          warning: "bg-yellow-500 text-black",
          error: "bg-red-600 text-white",
          success: "bg-green-700 text-white",
        }[alert.type]
      }`}
    >
      {alert.msg}
      {closable &&
        (
          <form method="dialog">
            <button>OK</button>
          </form>
        )}
    </dialog>
  );
}
