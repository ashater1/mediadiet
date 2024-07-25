import { Outlet } from "@remix-run/react";
import { json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";

export async function loader() {
  const response = new Response();
  return json({ data: null }, { headers: response.headers });
}
export default function Movies() {
  return (
    <PageFrame>
      <Outlet />
    </PageFrame>
  );
}
