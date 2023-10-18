import { createContext, useContext, useEffect } from "react";
import { useToasts } from "./useToasts";
import * as Toast from "@radix-ui/react-toast";
import { SuccessToast } from "./success";
import { AnimatePresence, motion } from "framer-motion";

const ToastsContext = createContext<{
  createToast: ReturnType<typeof useToasts>["createToast"];
  toastList: ReturnType<typeof useToasts>["toastList"];
} | null>(null);

export const useToastsContext = () => {
  const context = useContext(ToastsContext);

  if (!context) {
    throw new Error(
      "useToastsContext must be used within a ToastsContextProvider"
    );
  }
  return context;
};

export const ToastContext = ({ children }: { children: React.ReactNode }) => {
  const { createToast, toastList } = useToasts();

  return (
    <ToastsContext.Provider value={{ createToast, toastList }}>
      <Toast.Provider>
        <>
          {children}
          <AnimatePresence>
            {toastList.map((toast) => (
              <Toast.Root
                asChild
                key={toast.id}
                className="rounded-md bg-green-50"
                open={true}
              >
                <motion.div
                  initial={{ height: 0, opacity: 0, x: 700 }}
                  animate={{ height: "auto", opacity: 1, x: 0 }}
                  exit={{ x: 700 }}
                  transition={{ ease: "easeInOut", duration: 0.4 }}
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
          <Toast.Viewport className="fixed bottom-0 right-0 z-[1000] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-4 outline-none" />
        </>
      </Toast.Provider>
    </ToastsContext.Provider>
  );
};
