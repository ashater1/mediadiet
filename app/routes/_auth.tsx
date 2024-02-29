import { Outlet } from "@remix-run/react";

export default function AuthPathlessRoute() {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
