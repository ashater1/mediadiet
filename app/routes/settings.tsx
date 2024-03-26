import {
  AdjustmentsHorizontalIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Outlet } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import classNames from "classnames";
import { PageFrame } from "~/components/frames";
import { getUserOrRedirect } from "~/features/auth/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  return null;
}

export default function Settings() {
  return (
    <PageFrame>
      <div className="flex md:gap-16 sm:flex-row flex-col w-full sm:w-auto">
        <div className="mb-8 flex flex-row sm:flex-col gap-4 w-full sm:w-32">
          <SettingsNavLink to="profile">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Profile</span>
          </SettingsNavLink>
          <SettingsNavLink to="avatar">
            <UserIcon className="w-5 h-5" />
            <span>Avatar</span>
          </SettingsNavLink>
        </div>
        <Outlet />
      </div>
    </PageFrame>
  );
}

function SettingsNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      className={({ isActive }) =>
        classNames(
          isActive
            ? "bg-primary-200 text-gray-900"
            : "border-transparent text-gray-700 active:bg-primary-300",
          "inline-flex gap-4 items-center px-2 py-1.5 font-medium hover:bg-primary-200 text-sm rounded"
        )
      }
      to={to}
    >
      {children}
    </NavLink>
  );
}
