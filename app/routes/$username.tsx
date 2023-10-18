import { Outlet } from "@remix-run/react";
import { PageFrame } from "~/features/ui/frames";

export default function User() {
  return (
    <PageFrame>
      <Outlet />
    </PageFrame>
  );
}
