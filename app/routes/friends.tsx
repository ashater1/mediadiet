import { LoaderFunctionArgs } from "@vercel/remix";
import { getUserOrRedirect } from "~/features/auth/auth.server";
import { getAvatarUrl, useUserContext } from "~/features/auth/context";
import {
  ItemsCountAndFilter,
  UserHeaderBar,
} from "~/features/list/components/listOwnerHeaderBar";
import { PageFrame } from "~/features/ui/frames";

export async function loader({ request }: LoaderFunctionArgs) {
  const response = new Response();
  await getUserOrRedirect({ request, response });
  return null;
}

export default function Friends() {
  const userContext = useUserContext();

  return (
    <PageFrame>
      <div className="w-full flex flex-col">
        <div className="flex">
          <UserHeaderBar
            avatar={getAvatarUrl(userContext?.avatar) ?? undefined}
            primaryText="Friends"
            secondaryText={`@${userContext?.username}`}
          />
          <ItemsCountAndFilter
            paramName="type"
            counts={[1, 2]}
            labels={[{ label: "following" }, { label: "followers" }]}
          />
        </div>

        <div className="mt-2.5 mb-2.5 border-b border-b-primary-800/20 md:mt-4 md:mb-4" />
      </div>
    </PageFrame>
  );
}
