import { useState } from "react";
import { type ToastType } from "./toast";

export const useToasts = () => {
  const [toastList, setToastList] = useState<ToastType[]>([]);

  const createToast = ({
    type,
    title,
    description,
    duration = 1000,
  }: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    duration?: number;
  }) => {
    const toast: ToastType = {
      type,
      id: new Date().toISOString(),
      description,
      isOpen: true,
      title,
    };

    setToastList((prevList) => [toast, ...prevList]);

    setTimeout(() => {
      closeToast(toast);
    }, duration);

    return toast;
  };

  const closeToast = (toast: ToastType) => {
    toast.isOpen = false;
    setToastList((toasts) => toasts.filter((toast) => toast.isOpen));
  };

  return { createToast, toastList };
};
