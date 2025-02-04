import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import { motion } from "framer-motion";
import Spinner from "~/components/spinner";

import { Logo } from "~/components/logo";
import { loginSchema, signInWithPassword } from "~/features/auth/signIn.server";
import { findUser, getUserDetails } from "~/features/auth/user.server";
import { useState } from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserDetails({ request, response });

  if (user) {
    throw redirect(`/${user.username}`, { headers: response.headers });
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const submission = Object.fromEntries(await request.formData());

  const parsedLogin = loginSchema.safeParse({ ...submission });

  if (!parsedLogin.success) {
    return json(parsedLogin.error.flatten().fieldErrors);
  }

  const { email, password } = parsedLogin.data;
  const { data, error } = await signInWithPassword({
    email,
    password,
    request,
    response,
  });

  if (error || !data.user) {
    return json({ email: "Invalid email or password.", password: null });
  }

  const { username } = await findUser({ id: data.user.id });
  throw redirect(`/${username}`, { headers: response.headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const loading =
    navigation.state !== "idle" &&
    navigation.formData?.get("actionId") === "login";

  const emailError =
    actionData?.email && actionData.email !== "Invalid email or password.";

  const passwordError = actionData?.password;

  return (
    <div className="-mt-20 flex flex-col gap-5 w-full max-w-md">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Sign in
        </h2>
        <p className="flex items-baseline gap-1">
          to continue to <Logo />
        </p>
      </div>
      <Form className="flex flex-col gap-y-2" method="post">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-0 z-10 rounded-md oveflow-hidden ring-1 ring-inset ring-gray-300" />
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>

            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-b px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
              {emailError && (
                <div className="absolute right-0 top-1/2 mr-2 -translate-y-1/2">
                  <ExclamationCircleIcon className="h-6 w-6 animate-slideIn stroke-red-600" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 px-3 py-1.5 text-gray-900  placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                placeholder="Password"
              />
              <div
                className="z-50 select-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </div>

              {passwordError && !loading && (
                <motion.div
                  key="passwordError'"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-1/2 mr-2 -translate-y-1/2"
                >
                  <ExclamationCircleIcon className="h-6 w-6 animate-slideIn stroke-red-600" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {(actionData?.email || actionData?.password) && !loading && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="text-sm text-red-600 empty:hidden"
            id="email-error"
          >
            {actionData?.email
              ? actionData.email
              : actionData?.password
              ? actionData.password
              : null}
          </motion.p>
        )}

        <div className="mt-4 flex items-center justify-between"></div>

        <div>
          <button
            name="actionId"
            value="login"
            type="submit"
            disabled={loading}
            className={classNames(
              loading ? "mt-opacity-50" : "hover:bg-primary-700",
              "flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
            )}
          >
            <div className="relative">
              {loading ? <Spinner className="w-5 h-5" /> : "Sign in"}
            </div>
          </button>

          <div className="mt-3 flex items-center justify-center text-sm leading-6">
            <Link
              to="/forgot-password"
              className="text-primary-800 hover:text-primary-700"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </Form>
      <p className="text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link
          to="/signup"
          className="font-semibold leading-6 text-primary-800 hover:text-primary-700"
        >
          Sign up now. It's free!
        </Link>
      </p>
    </div>
  );
}
