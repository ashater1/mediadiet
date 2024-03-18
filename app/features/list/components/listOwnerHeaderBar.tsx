import { useFetcher, useParams } from "@remix-run/react";
import { FallbackAvatar } from "~/components/avatar";
import { Button } from "~/components/button";
import Spinner from "~/components/spinner";
import { cn } from "~/components/utils";

type UserHeaderBarProps = {
  avatar: string | null;
  isFollowing: boolean;
  isSelf: boolean;
  primaryName: string | null;
  secondaryName: string;
};

export function UserHeaderBar({
  avatar,
  isFollowing,
  isSelf,
  primaryName,
  secondaryName,
}: UserHeaderBarProps) {
  const params = useParams();

  const { Form, data, formAction, formData } = useFetcher();

  const isSubmittingFollow =
    formData?.get("intent") === "follow" ||
    formData?.get("intent") === "unfollow";

  return (
    <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
      <div className="hidden h-16 w-16 overflow-hidden rounded-full bg-gray-100 md:block">
        {avatar ? (
          <img className="h-full w-full" src={avatar} />
        ) : (
          <FallbackAvatar />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <h2 className="text-lg font-bold tracking-tight text-gray-900 md:text-xl">
            {primaryName ? primaryName : secondaryName}
          </h2>

          {!isSelf && (
            <Form method="post" action={`/${params.username}`}>
              <Button
                name="intent"
                disabled={isSubmittingFollow}
                value={isFollowing ? "unfollow" : "follow"}
                className={cn(
                  isFollowing
                    ? "bg-green-500 hover:bg-orange-400 active:bg-orange-500 group w-24"
                    : "bg-gray-400 hover:bg-gray-500 active:bg-gray-600 w-20",
                  "ml-3 font-normal text-sm h-7 flex items-center justify-center"
                )}
              >
                {isSubmittingFollow ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <>
                    <div className="block group-hover:hidden">
                      {isFollowing ? "Following" : "Follow"}
                    </div>
                    <div className="hidden group-hover:block">Unfollow</div>
                  </>
                )}
              </Button>
            </Form>
          )}
        </div>

        {primaryName && (
          <span className="text-sm text-gray-500">{secondaryName}</span>
        )}
      </div>
    </div>
  );
}
