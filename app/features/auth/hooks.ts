import { useLocation } from "@remix-run/react";

export function useIsAuthPage() {
  const location = useLocation();
  const authPaths = ["/login", "/signup"];
  return authPaths.includes(location.pathname);
}
