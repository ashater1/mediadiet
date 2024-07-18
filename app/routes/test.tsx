import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { PageFrame } from "~/components/frames";

function Indicator({ status }: { status: boolean }) {
  return status ? (
    <CheckIcon className="stroke-green-600 h-3 w-3 stroke-2" />
  ) : (
    <XMarkIcon className="stroke-red-600 h-3 w-3 stroke-2" />
  );
}

export default function Test() {
  const [password, setPassword] = useState("");

  return (
    <PageFrame>
      <div className="qoverflow-hidden w-80 relative rounded-md">
        <input
          id="username"
          name="username"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
          placeholder="Username"
        />
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <Indicator status={password.length >= 8} />
              <p>8 character minimum</p>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <Indicator status={/\d/.test(password)} />
              <p>One number</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <Indicator status={password.toLowerCase() !== password} />
              <p>One uppercase letter</p>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <Indicator
                status={/[\?\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\,\.\<\>\/\|\`\~]/.test(
                  password
                )}
              />
              <p>One symbol</p>
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  );
}
