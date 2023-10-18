import { createContext, useContext } from "react";
import { useAddNew } from "./useAddNew";

export const AddNewContext = createContext<ReturnType<typeof useAddNew> | null>(
  null
);

export const useAddNewContext = () => {
  const context = useContext(AddNewContext);

  if (!context) {
    throw new Error(
      "useAddNewContext must be used within a AddNewContextProvider"
    );
  }
  return context;
};

export const AddNew = ({ children }: { children: React.ReactNode }) => {
  const addNew = useAddNew();

  return (
    <AddNewContext.Provider value={addNew}>{children}</AddNewContext.Provider>
  );
};
