import { createContext, useContext } from "react";

type User = {
  username: string | null;
  firstName: string | null;
  lastName: string | null;
};

export const UserContext = createContext<User>({
  username: null,
  firstName: null,
  lastName: null,
});

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
}

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useUserContext();

  return (
    <UserContext.Provider value={{ ...context }}>
      {children}
    </UserContext.Provider>
  );
}
