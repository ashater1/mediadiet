import { CheckCircleIcon } from "@heroicons/react/20/solid";
import {
  CheckIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Logo } from "~/components/logo";
import Spinner from "~/components/spinner";
import ConfirmEmailAddressEmail from "~/features/auth/emails/confirmSignup";
import { usePasswordValidator } from "~/features/auth/hooks";
import { signUp } from "~/features/auth/signUp.server";
import { findUser, getSessionUser } from "~/features/auth/user.server";
import { resend } from "~/features/emails/resend.server";

const SignUpSchema = z
  .object({
    username: z
      .string()
      .max(50, { message: "Username is too long (maximum 50 characters)" }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password is too short (minimum 8 characters)" })
      .max(50, { message: "Password is too long (maximum 50 characters)" })
      .refine(
        (data) =>
          /[\?\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\;\:\'\"\,\.\<\>\/\|\`\~]/.test(
            data
          ) &&
          /\d/.test(data) &&
          data.toLowerCase() !== data,
        {
          path: ["password"],
          message: "Password does not meet minimum requirements",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords dont match!",
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getSessionUser({ request, response });

  if (user) {
    const { username } = await findUser({ id: user.id });
    throw redirect(`/${username}`, { headers: request.headers });
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const submission = Object.fromEntries(await request.formData());
  const data = SignUpSchema.safeParse(submission);

  if (!data.success) {
    return json({ success: false, data: data.error.flatten().fieldErrors });
  }

  const { success, ...signUpResult } = await signUp({
    username: data.data.username,
    email: data.data.email,
    password: data.data.password,
  });

  if (!success) {
    return json({ success: false, data: signUpResult });
  } else if (success) {
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Adam <adam@mediadiet.app>",
      to: data.data.email,
      subject: "Confirm your email on mediadiet",
      react: (
        <ConfirmEmailAddressEmail
          username={data.data.username}
          inviteLink={signUpResult.link}
        />
      ),
    });

    if (emailError) {
      throw new Error(emailError ? JSON.stringify(emailError) : "Email error");
    }
  }

  return json({ success: true, data: signUpResult });
}

export default function SignUp() {
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

  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const loading =
    navigation.state !== "idle" &&
    navigation.formData?.get("actionId") === "signup";

  return (
    <div className="flex max-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <AnimatePresence initial={false} mode="wait">
        {data?.success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
            key="success"
          >
            <Success />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm space-y-6"
          >
            <div className="flex flex-col items-start">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign up
              </h2>
              <div className="flex items-center gap-1 justify-center">
                <span>to join</span>
                <Logo />
              </div>
            </div>

            <Form className="flex flex-col gap-y-2" method="post">
              <div className="relative flex flex-col gap-y-3 rounded-md">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>

                  <div className="qoverflow-hidden  relative rounded-md">
                    <input
                      id="username"
                      name="username"
                      required
                      className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                      placeholder="Username"
                    />
                  </div>

                  {data && "username" in data.data && data.data.username && (
                    <Alert>{data.data.username}</Alert>
                  )}
                </div>

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
                      className="relative block w-full rounded  rounded-b-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                      placeholder="Email address"
                    />
                  </div>
                  {data && "email" in data.data && data.data.email && (
                    <Alert>{data.data.email.at(0)}</Alert>
                  )}
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
                        <p
                          className={
                            !isValidLength ? "opacity-60" : "opacity-100"
                          }
                        >
                          8 character minimum
                        </p>
                      </div>
                      <div className="flex gap-1 items-center text-sm ">
                        <Indicator status={includesNumber} />
                        <p
                          className={
                            !includesNumber ? "opacity-60" : "opacity-100"
                          }
                        >
                          One number
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-1 items-center text-sm ">
                        <Indicator status={includesUppercase} />
                        <p
                          className={
                            !includesUppercase ? "opacity-60" : "opacity-100"
                          }
                        >
                          One uppercase letter
                        </p>
                      </div>
                      <div className="flex gap-1 items-center text-sm ">
                        <Indicator status={includesSymbol} />
                        <p
                          className={
                            !includesSymbol ? "opacity-60" : "opacity-100"
                          }
                        >
                          One symbol
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
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
                  {data &&
                    !("password" in data.data) &&
                    "confirmPassword" in data.data &&
                    data.data.confirmPassword && (
                      <Alert>{data.data.confirmPassword}</Alert>
                    )}
                  {isValidPassword && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 text-sm items-center flex gap-3">
                        <Indicator status={isMatching} />
                        <p
                          className={!isMatching ? "opacity-60" : "opacity-100"}
                        >
                          Passwords match
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div>
                  <button
                    name="actionId"
                    value="signup"
                    type="submit"
                    disabled={!isMatching || loading}
                    className={classNames(
                      !isMatching || loading
                        ? "bg-opacity-75"
                        : "hover:bg-primary-700",
                      "mt-4 flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
                    )}
                  >
                    <div className="relative">
                      {loading ? <Spinner className="w-5 h-5" /> : "Sign up"}
                    </div>
                  </button>
                </div>
              </div>
            </Form>

            <p className="text-center text-sm leading-6 text-gray-500">
              Already a member?{" "}
              <Link
                prefetch="intent"
                to="/login"
                className="font-semibold text-primary-800 hover:text-primary-700"
              >
                Log in here
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Indicator({ status }: { status: boolean }) {
  return status ? (
    <CheckIcon className="stroke-green-600 h-3 w-3 stroke-2" />
  ) : (
    <XMarkIcon className="stroke-red-600 h-3 w-3 stroke-2" />
  );
}

function Success() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex gap-3 items-center">
        <CheckCircleIcon className="w-12 h-12 fill-green-500 stoke-white" />
        <div className="flex flex-col gap-3 w-96">
          <h2 className="text-xl font-light">Thanks for signing up!</h2>
          <div className="text-sm">
            To finish setting up your account, check your email for a
            confirmation link that we just sent.
          </div>
          <Link
            to="/login"
            className="hover:bg-primary-700 mt-4 flex h-10 w-full items-center justify-center font-semibold rounded-md bg-primary-800 text-sm leading-6 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

function Alert({ children }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <motion.p
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden stroke-red-600 text-sm text-red-600"
    >
      <div className="mt-1 flex items-center">
        <ExclamationCircleIcon className="mr-2 h-5 w-5" />
        {children}
      </div>
    </motion.p>
  );
}
