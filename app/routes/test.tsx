import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@vercel/remix";
import { PageFrame } from "~/components/frames";
import { db } from "~/db.server";

import { getUserOrRedirect } from "~/features/auth/user.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  const user = await getUserOrRedirect({ request, response });
  const query = await db.review.groupBy({
    by: ["userId"],
    _min: {
      createdAt: true,
    },
  });
  return query;
}

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </PageFrame>
  );
}
