import { createContext, useContext } from "react";
import { findUser } from "./user.server";

export type User = Awaited<ReturnType<typeof findUser>>;

export const UserContext = createContext<User | null>(null);

export function useUserContext() {
  return useContext(UserContext);
}

export function UserContextProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user || null}>{children}</UserContext.Provider>
  );
}
