import { Signal } from "@preact/signals";
import { Ref, useLayoutEffect } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import regCeremony from "../(_utils)/regCeremony.ts";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
  USERNAME_PATTERN_DESC,
} from "../(_utils)/regConsts.ts";
import { RegStatus } from "../(_utils)/regTypes.ts";

interface RegFormProps extends JSX.HTMLAttributes<HTMLFormElement> {
  statusSignal: Signal<RegStatus>;
  usernameRef: Ref<HTMLInputElement>;
}

export default function RegForm(props: RegFormProps) {
  const { statusSignal, usernameRef, ...formAttr } = props;

  useLayoutEffect(() => {
    if (!globalThis.PublicKeyCredential) {
      statusSignal.value === RegStatus.WebAuthnUnsupported;
    }
  }, []);

  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    statusSignal.value = RegStatus.Pending;
    statusSignal.value = await regCeremony(usernameRef.current!.value);
  };

  return (
    <form
      {...formAttr}
      class={`${formAttr.class || ""} flex flex-wrap items-center gap-3`}
      onSubmit={onSubmit}
    >
      <label for="username">Username:</label>
      <input
        class="min-w-0 basis-20 shrink grow"
        ref={usernameRef}
        id="username"
        name="username"
        type="text"
        minlength={USERNAME_MIN_LENGTH}
        maxlength={USERNAME_MAX_LENGTH}
        pattern={USERNAME_PATTERN}
        title={USERNAME_PATTERN_DESC}
        autocomplete="off"
        autocapitalize="off"
        spellcheck={false}
        required
      />
      <button>Create Account</button>
    </form>
  );
}
