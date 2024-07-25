import { useLoaderData } from "@remix-run/react";
import { json } from "@vercel/remix";
import { Button } from "~/components/button";
import { PageFrame } from "~/components/frames";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/tooltip";
import { getFollowedThatHaveLogged } from "~/features/tvAndMovies/db";

export async function loader() {
  const response = new Response();
  const id = "96160289-b196-4245-91f3-655c9c83331a";
  const movie = "f0132db9-931b-4c5d-a4b7-ecd7acb1d96e";

  const test = await getFollowedThatHaveLogged({
    mediaItemId: movie,
    userId: id,
  });
  return json({ test }, { headers: response.headers });
}

export default function Test() {
  const data = useLoaderData<typeof loader>();

  return (
    <PageFrame>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Hover</button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PageFrame>
  );
}
