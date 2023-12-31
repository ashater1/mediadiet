import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@vercel/remix";
import classNames from "classnames";
import { motion } from "framer-motion";
import { z } from "zod";
import Spinner from "~/components/spinner";
import { getUser, getUserById, signUp } from "~/features/auth/auth.server";
import ConfirmEmailAddressEmail from "~/features/auth/emails/confirmSignup";
import { Logo } from "~/features/brand/logo";
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
      .max(50, { message: "Password is too long (maximum 50 characters)" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password is too short (minimum 8 characters)" })
      .max(50, { message: "Password is too long (maximum 50 characters)" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords dont match!",
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUser({ request, response });

  if (user) {
    const { username } = await getUserById(user.id);
    throw redirect(`/${username}`, { headers: request.headers });
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const response = new Response();
  const submission = Object.fromEntries(await request.formData());
  const data = SignUpSchema.safeParse(submission);

  if (!data.success) {
    return data.error.flatten().fieldErrors;
  }

  const { success, ...signUpResult } = await signUp({
    username: data.data.username,
    email: data.data.email,
    password: data.data.password,
  });

  if (success) {
    const emailResult = await resend.emails.send({
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
  }

  return signUpResult;
}

// export async function action({ request }: ActionFunctionArgs) {
//   console.log("Starting action!");

// const emailResult = await resend.emails.send({
//   from: "Adam <adam@mediadiet.app>",
//   to: ["mediadietapp@gmail.com"],
//   subject: "Confirm your email on mediadiet",
//   react: (
//     <ConfirmEmailAddressEmail
//       username="Adam"
//       inviteLink="https://www.mediadiet.app"
//     />
//   ),
// });

//   console.log("Done!", { emailResult });

//   return null;
// }

export default function SignUp() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const loading =
    navigation.state !== "idle" &&
    navigation.formData?.get("actionId") === "signup";

  return (
    <div className="flex max-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col  items-start">
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

              {data?.username && <Alert>{data?.username}</Alert>}
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
              {data?.email && <Alert>{data.email.at(0)}</Alert>}
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
                  className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                  placeholder="Password"
                />
              </div>
              {data?.password && <Alert>{data?.password}</Alert>}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-800 outline-none sm:text-sm sm:leading-6"
                  placeholder="Confirm password"
                />
              </div>
              {data?.confirmPassword && <Alert>{data?.confirmPassword}</Alert>}
            </div>
          </div>

          <div className="mt-4">
            <div>
              <button
                name="actionId"
                value="signup"
                type="submit"
                disabled={loading}
                className={classNames(
                  loading ? "mt-opacity-50" : "hover:bg-primary-700",
                  "mt-4 flex h-10 w-full items-center justify-center rounded-md bg-primary-800 text-sm font-semibold leading-6 text-white  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-800"
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
