import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { Link, NavLink, useNavigation } from "@remix-run/react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { NewEntryModal } from "~/features/add/entryModal";
import { useUserContext } from "~/features/auth/context";
import { Logo } from "../../components/logo";
import { useAddNewContext } from "../add/context";
import Spinner from "~/components/spinner";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useUserContext();
  const { openModal } = useAddNewContext();

  const nav = useNavigation();
  const loggingOut =
    nav.location?.pathname === "/logout" ||
    (nav.state === "loading" && nav.location?.pathname === "/login");

  const navigation = useMemo(
    () => [
      { name: "Activity", to: user?.username || "" },
      { name: "Friends", to: "friends" },
      // { name: "Lists", to: "lists" },
      { name: "Saved", to: "saved" },
      { name: "Settings", to: "settings" },
    ],
    []
  );

  return (
    <Dialog.Root open={open} onOpenChange={() => setOpen((o) => !o)}>
      <div className="flex items-center justify-center py-2 mb-10">
        <div className="flex w-full max-w-5xl justify-between px-4">
          <div className="flex gap-3">
            <Link to={!!user ? `/${user.username}` : "/login"}>
              <Logo size="lg" />
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user?.username &&
              navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "rounded bg-primary-200 text-gray-900"
                        : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-900",
                      "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Dialog.Trigger asChild className="flex md:hidden">
              <button className="mr-4 flex h-10 w-10 items-center justify-center rounded p-1 hover:bg-primary-100 active:bg-primary-200 ">
                <Bars3Icon className="h-6 w-6 stroke-slate-900 stroke-2" />
              </button>
            </Dialog.Trigger>

            <div className="hidden h-full items-center justify-center gap-3 md:flex">
              {user?.username ? (
                <div className="flex gap-2 h-full items-center justify-center">
                  <NewEntryModal />
                  <Link to="/logout">
                    {loggingOut ? (
                      <Spinner className="w-6 h-6" />
                    ) : (
                      <ArrowLeftOnRectangleIcon className="w-6 h-6 rotate-180" />
                    )}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-5">
                  <Link
                    to="login"
                    className="text-slate-800 hover:text-slate-600 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="signup"
                    className="flex h-10 items-center justify-center rounded border bg-primary-800 px-3 text-sm font-medium text-gray-100 hover:bg-primary-700 hover:text-gray-50 active:bg-primary-600"
                  >
                    <span>Sign up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 100 }}
            className="fixed inset-0 bg-black/50"
            transition={{ duration: 0.3 }}
          />
        </Dialog.Overlay>

        <Dialog.Content
          asChild
          className="fixed w-full top-0 mt-20 left-0 h-full bg-white md:hidden"
        >
          <div className="overflow-hidden flex flex-col gap-6">
            <div className="flex flex-col gap-3 pt-3 px-3">
              {navigation.map((item) => (
                <NavLink
                  onClick={() => setOpen(false)}
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-primary-100"
                        : "hover:bg-primary-200 active:bg-primary-300",
                      "inline-flex items-center whitespace-nowrap px-3 py-2 rounded font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="mx-5 border-b-[1px] border-slate-300" />
            {!user?.username ? (
              <div className="w-full px-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="rounded w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-600 text-white flex items-center whitespace-nowrap py-1.5 justify-center flex-0"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="w-full px-2 flex flex-col gap-2 items-center">
                <button
                  onClick={() => {
                    openModal();
                    setOpen(false);
                  }}
                  className="gap-2 rounded w-full bg-primary-800 hover:bg-primary-700 active:bg-primary-600 text-white flex items-center whitespace-nowrap py-1.5 justify-center flex-0"
                >
                  <PlusIcon className="stroke-4 h-4 w-4" />
                  <span>Add</span>
                </button>
                <Link
                  to="/logout"
                  className="inline-flex items-center whitespace-nowrap font-medium text-primary-800 hover:text-primary-700 active:text-primary-600"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
