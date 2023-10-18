import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import { Logo } from "~/features/brand/Logo";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  getSession,
  getUserDetails,
  loginSchema,
  signInWithPassword,
} from "~/features/auth/authv2.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const session = await getSession({ request, response });

  if (!!session) {
    throw redirect(`/`, { headers: response.headers });
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const submission = Object.fromEntries(await request.formData());
  const parsedLogin = loginSchema.safeParse({ ...submission });

  console.log(parsedLogin.success ? "null" : parsedLogin.error);

  if (!parsedLogin.success) {
    return json(parsedLogin.error.flatten().fieldErrors, {
      headers: request.headers,
    });
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

  const { username } = await getUserDetails(data.user.id);
  throw redirect(`/${username}`, { headers: response.headers });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const transition = useNavigation();

  const loggingIn = transition.state !== "idle" && !!transition.formData;

  const emailError =
    actionData?.email && actionData.email !== "Invalid email or password.";

  const passwordError = actionData?.password;

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className="-mt-20 flex flex-col gap-10 w-full max-w-md">
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
            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>

              <div className="qoverflow-hidden  relative rounded-md">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-b-none border-b px-3 py-1.5 text-gray-900 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 sm:text-sm sm:leading-6"
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
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 px-3 py-1.5 text-gray-900  placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 sm:text-sm sm:leading-6"
                  placeholder="Password"
                />

                {passwordError && !loggingIn && (
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

          {(actionData?.email || actionData?.password) && !loggingIn && (
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

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-800 focus:ring-primary-800"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm leading-6 text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm leading-6">
              <a
                href="#"
                className="font-semibold text-primary-800 hover:text-primary-700"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loggingIn}
              className={classNames(
                loggingIn ? "opacity-50" : "hover:bg-primary-700",
                "flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
              )}
            >
              <div className="relative">
                <span>Sign in</span>
              </div>
            </button>
          </div>
        </Form>
        {/* <form className="space-y-6" action="#" method="POST">
          <div className="relative -space-y-px rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="px-2 outline-0 relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800/50 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="px-2 outline-0 relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800/50 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="rounded-md outline-none bg-primary h-4 w-4 border-gray-300 text-primary  focus:ring-2 focus:ring-inset focus:ring-primary-800/50"
              />
              <label
                htmlFor="remember-me"
                className="ml-3 block text-sm leading-6 text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm leading-6">
              <a
                href="#"
                className="py-1 px-2 font-semibold text-primary hover:text-pink-800 rounded focus:ring-2 focus:ring-inset focus:ring-primary-800/50 outline-none"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-primary-700 active:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
            >
              Sign in
            </button>
          </div>
        </form> */}
      </div>
    </div>
  );
}
