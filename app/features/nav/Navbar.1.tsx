import { Bars3Icon, UserIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link, NavLink } from "@remix-run/react";
import { NewEntryModal } from "../add/entryModal";
import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import classNames from "classnames";
import { Logo } from "~/features/brand/Logo";
import { useUserContext } from "../auth/context";
import { FallbackAvatar } from "~/components/avatar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const user = useUserContext();

  const navigation = useMemo(
    () => [
      { name: "Activity", to: user?.username || "" },
      { name: "Friends", to: "friends" },
      { name: "Lists", to: "lists" },
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
            <Logo size="lg" />
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
                  <button className="border border-primary-800/20 rounded-full p-1 overflow-hidden hover:bg-primary-800/10  w-12 h-12">
                    {/* <UserIcon className="w-7 h-7 stroke-[1px] " /> */}
                    <FallbackAvatar />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex h-10 items-center justify-center rounded border bg-primary-800 px-3 text-sm font-medium text-gray-100 hover:bg-primary-700 hover:text-gray-50 active:bg-primary-600"
                >
                  <span>Sign in</span>
                </Link>
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
          className="fixed top-0 left-0 h-full bg-white md:hidden"
        >
          <motion.div
            className="overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col py-3">
              {navigation.map((item) => (
                <NavLink
                  onClick={() => setOpen(false)}
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "border-l-purple-700 bg-purple-100"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "inline-flex items-center whitespace-nowrap  border-l-4 px-3 py-1.5 text-sm font-medium"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
