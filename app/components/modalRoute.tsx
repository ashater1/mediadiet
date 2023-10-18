import { MouseEvent, PropsWithChildren } from "react";

export function ModalRouteContainer<
  OnOutsideClick extends (e: MouseEvent<HTMLInputElement>) => void
>({
  onOutsideClick,
  children,
  ...props
}: PropsWithChildren & { onOutsideClick?: OnOutsideClick }) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      <div
        onClick={onOutsideClick}
        className="fixed inset-0 cursor-pointer overflow-y-auto"
      >
        <div className="flex h-full items-center justify-center p-4 text-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-1/2 max-w-[600px] rounded-md bg-white"
          >
            <div className="h-full p-8">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
