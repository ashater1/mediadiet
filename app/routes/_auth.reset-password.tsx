import {
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { usePasswordValidator } from "~/features/auth/hooks";
import { motion } from "framer-motion";
import classNames from "classnames";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import Spinner from "~/components/spinner";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@vercel/remix";
import { passwordSchema, resetPassword } from "~/features/auth/passwords";
import { Logo } from "~/components/logo";
import { getUserDetails } from "~/features/auth/user.server";
import { setToast } from "~/features/toasts/toast.server";

function Indicator({ status }: { status: boolean }) {
  return status ? (
    <CheckIcon className="stroke-green-600 h-3 w-3 stroke-2" />
  ) : (
    <XMarkIcon className="stroke-red-600 h-3 w-3 stroke-2" />
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });
  console.log({ user });
  return json(null, { headers: response.headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const userDetails = await getUserDetails({ request, response });

  if (!userDetails) {
    console.log("User not found");
    throw redirect("/login", { headers: response.headers });
  }

  const submission = Object.fromEntries(await request.formData());
  const result = passwordSchema.safeParse(submission);

  if (!result.success) {
    console.log({ result });
    return json({ success: false, data: result.error.flatten().fieldErrors });
  }

  const { data, error } = await resetPassword({
    request,
    response,
    password: result.data.password,
  });

  console.log({ data, error });

  if (error) {
    throw new Error(error.message);
  }

  await setToast({
    request,
    response,
    toast: {
      type: "success",
      title: "Your password has been successfully reset",
    },
  });

  throw redirect(`/${userDetails.username}`, {
    headers: response.headers,
  });
}

export default function ResetPassword() {
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

  const navigation = useNavigation();
  const loading =
    navigation.state !== "idle" &&
    navigation.formData?.get("actionId") === "signup";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const actionData = useActionData<typeof action>();

  return (
    <div className="relative flex flex-col gap-y-2 rounded-md">
      <Logo />
      <h2 className="mb-3 self-start text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Set your new password
      </h2>
      <Form className="flex flex-col gap-y-3" method="post">
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
                <p
                  className={!includesUppercase ? "opacity-60" : "opacity-100"}
                >
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

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={!isValidPassword}
              className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
              placeholder="Confirm password"
            />
            <div
              className={classNames(
                isValidPassword && "cursor-pointer",
                "select-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              )}
              onClick={() =>
                isValidPassword && setShowConfirmPassword((s) => !s)
              }
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </div>
          </div>

          {isValidPassword && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 text-sm items-center flex gap-3">
                <Indicator status={isMatching} />
                <p className={!isMatching ? "opacity-60" : "opacity-100"}>
                  Passwords match
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <button
          name="actionId"
          value="resetPassword"
          type="submit"
          disabled={!isMatching || loading}
          className={classNames(
            !isMatching || loading ? "bg-opacity-75" : "hover:bg-primary-700",
            "mt-4 flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
          )}
        >
          <div className="relative">
            {loading ? <Spinner className="w-5 h-5" /> : "Sign up"}
          </div>
        </button>
      </Form>
    </div>
  );
}
