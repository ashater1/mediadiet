import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePasswordValidator } from "../hooks";
import { useState } from "react";

function Indicator({ status }: { status: boolean }) {
  return status ? (
    <CheckIcon className="stroke-green-600 h-3 w-3 stroke-2" />
  ) : (
    <XMarkIcon className="stroke-red-600 h-3 w-3 stroke-2" />
  );
}

export function ConfirmPassword() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isMatching,
    includesNumber,
    isValidLength,
    includesUppercase,
    includesSymbol,
    isValidPassword,
  } = usePasswordValidator();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div>
      <label htmlFor="password" className="sr-only">
        Password
      </label>

      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
          placeholder="Password"
        />
        <div
          className="select-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
        </div>
      </div>
      {data && "password" in data.data && data.data.password && (
        <Alert>{data.data.password}</Alert>
      )}
      <div className="mt-2 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center text-sm ">
            <Indicator status={isValidLength} />
            <p className={!isValidLength ? "opacity-60" : "opacity-100"}>
              8 character minimum
            </p>
          </div>
          <div className="flex gap-1 items-center text-sm ">
            <Indicator status={includesNumber} />
            <p className={!includesNumber ? "opacity-60" : "opacity-100"}>
              One number
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center text-sm ">
            <Indicator status={includesUppercase} />
            <p className={!includesUppercase ? "opacity-60" : "opacity-100"}>
              One uppercase letter
            </p>
          </div>
          <div className="flex gap-1 items-center text-sm ">
            <Indicator status={includesSymbol} />
            <p className={!includesSymbol ? "opacity-60" : "opacity-100"}>
              One symbol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
