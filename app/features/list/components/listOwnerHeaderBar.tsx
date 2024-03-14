import { useFetcher } from "@remix-run/react";
import { FallbackAvatar } from "~/components/avatar";
import { Button } from "~/components/button";

type UserHeaderBarProps = {
  isSelf: boolean;
  avatar: string | null;
  primaryName: string | null;
  secondaryName: string;
};

export function UserHeaderBar({
  isSelf,
  avatar,
  primaryName,
  secondaryName,
}: UserHeaderBarProps) {
  const { Form, data, formAction, formData } = useFetcher();

  console.log(formData && Object.fromEntries(formData));

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
            <Form method="post" action="/adam">
              <Button
                name="intent"
                value="follow"
                className="ml-3 font-normal text-sm h-auto py-1 px-3"
              >
                Follow
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
