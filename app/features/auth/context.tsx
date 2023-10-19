import { createContext, useContext } from "react";
import { Prisma } from "@prisma/client";

type User = Partial<Prisma.UserGetPayload<{}>>;

export const UserContext = createContext<User | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}

export function UserContextProvider({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
