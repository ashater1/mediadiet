import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Test() {
  useEffect(
    () => {
      let timer1 = setTimeout(
        () =>
          toast.info("Hello world!", {
            icon: <TrashIcon />,
          }),
        1000
      );

      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        clearTimeout(timer1);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    []
  );

  return (
    <div className="p-20">
      <h1 className="text-4xl font-bold">Hello world!</h1>
    </div>
  );
}
