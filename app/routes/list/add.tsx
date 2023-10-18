import { LoaderFunctionArgs } from "@vercel/remix";
import { Outlet, useNavigate } from "@remix-run/react";
import { ModalRouteContainer } from "~/components";
import { createSupabaseClient } from "~/utils/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const supabaseClient = createSupabaseClient({ request, response });
  return [];
}
export default function Add() {
  const navigate = useNavigate();

  return (
    <ModalRouteContainer onOutsideClick={() => navigate("/list")}>
      <Outlet />
    </ModalRouteContainer>
  );
}
