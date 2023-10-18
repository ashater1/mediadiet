import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import React from "react";

function LoginTransition({
  show,
  children,
}: React.PropsWithChildren & { show: boolean }) {
  return (
    <Transition
      show={show}
      enter="transition-all duration-800"
      enterFrom="opacity-0 "
      enterTo="opacity-100"
      leave="transition-opacity duration-800"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
}

export function LoginAlert({
  message,
  takeUpSpace = true,
}: {
  message?: string | undefined | null;
  takeUpSpace?: boolean;
}) {
  if (takeUpSpace) {
    return (
      <LoginTransition show={!!message}>
        <div className="h-6">
          <LoginAlertBody message={message} />
        </div>
      </LoginTransition>
    );
  }

  return <LoginAlertBody message={message} />;
}

export function LoginAlertBody({
  message,
}: {
  message?: string | undefined | null;
}) {
  return (
    <Transition
      show={!!message}
      enter="transition-all duration-800"
      enterFrom="opacity-0 "
      enterTo="opacity-100"
      leave="transition-opacity duration-800"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="flex h-6 items-end gap-1 text-xs">
        <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />
        <p className="text-red-400">{message}</p>
      </div>
    </Transition>
  );
}

export function Help({ message, show }: { message?: string; show: boolean }) {
  return (
    <div className="h-6">
      <Transition
        show={!!show}
        enter="transition-all duration-600"
        enterFrom="opacity-0 "
        enterTo="opacity-100"
        leave="transition-opacity duration-800"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex h-6 items-end gap-1 text-xs">
          <p className="text-slate-600">{message}</p>
        </div>
      </Transition>
    </div>
  );
}
