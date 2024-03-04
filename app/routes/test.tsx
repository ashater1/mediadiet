import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix";
import { getUserDetails } from "~/features/auth/auth.server";
import { motion } from "framer-motion";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const response = new Response();
//   // const user = await getUserDetails({ request, response });
//   // if (user?.username !== "adam") {
//   //   throw redirect("/login", { headers: response.headers });
//   // }

//   const data = await fetch(
//     "https://api.letterboxd.com/api/v0/search?input=the+matrix&searchMethod=Autocomplete&include=FilmSearchItem"
//   );

//   return await data.json();
// }

export async function action() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json({ data: "data" });
}

export default function Test() {
  const { Form, data } = useFetcher();
  // const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="w-full items-center flex justify-center">
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: data ? 0 : 1 }}>
        Before
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: data ? 1 : 0 }}>
        After
      </motion.div>

      <Form method="POST">
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
  // return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
