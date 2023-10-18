import { CheckCircleIcon } from "@heroicons/react/24/outline";
import * as Toast from "@radix-ui/react-toast";

export function SuccessToast({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-3">
      <div className="flex">
        <CheckCircleIcon
          className="h-5 w-5 flex-shrink-0 text-green-400"
          aria-hidden="true"
        />
        <Toast.Title className="ml-3 text-sm font-medium text-green-800">
          {title}
        </Toast.Title>
      </div>
      <Toast.Description className="mt-2 text-sm text-green-700">
        {description}
      </Toast.Description>
    </div>
  );
}
