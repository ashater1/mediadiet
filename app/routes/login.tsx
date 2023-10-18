import { Logo } from "~/features/brand/logo";

export default function Login() {
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
        <form className="space-y-6" action="#" method="POST">
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
        </form>
      </div>
    </div>
  );
}
