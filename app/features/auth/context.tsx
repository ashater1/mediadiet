import { createContext, useContext } from "react";
import { Prisma } from "@prisma/client";

type User = Partial<Prisma.UserGetPayload<{}>>;

export const UserContext = createContext<User | null>(null);

export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}

export function getAvatarUrl(avatar: string | null | undefined) {
  if (!avatar) return null;
  return `https://cgoipxithucvtnbvyypv.supabase.co/storage/v1/object/public/public/avatars/${avatar}`;
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
