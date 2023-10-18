import { createContext, useContext } from "react";
import { useAddNew } from "./useAddNew";

export const _AddNewContext = createContext<ReturnType<
  typeof useAddNew
> | null>(null);

export const useAddNewContext = () => {
  const context = useContext(_AddNewContext);

  if (!context) {
    throw new Error(
      "useAddNewContext must be used within a AddNewContextProvider"
    );
  }
  return context;
};

export const AddNewContext = ({ children }: { children: React.ReactNode }) => {
  const addNew = useAddNew();

  return (
    <_AddNewContext.Provider value={addNew}>{children}</_AddNewContext.Provider>
  );
};
