import { AnimatePresence, motion } from "framer-motion";
import * as Toast from "@radix-ui/react-toast";
import { SuccessToast } from "./success";

export type ToastType = {
  id: string;
  isOpen: boolean;
  title: string;
  description: string;
  type: "success" | "error" | "warning" | "info";
};

export function Toasts({ toastList }: { toastList: ToastType[] }) {
  return (
    <AnimatePresence>
      {toastList.map((toast, index) => (
        <Toast.Root
          asChild
          key={toast.id}
          className="rounded-md bg-green-50"
          open={true}
        >
          <motion.div
            initial={{ height: 0, opacity: 0, x: 500 }}
            animate={{ height: "auto", opacity: 1, x: 0 }}
            exit={{ x: 500 }}
            transition={{ duration: 0.3 }}
          >
            {toast.type === "success" && (
              <SuccessToast
                title={toast.title}
                description={toast.description}
              />
            )}
          </motion.div>
        </Toast.Root>
      ))}
    </AnimatePresence>
  );
}
