import { UserMinusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { type User } from "@prisma/client";
import * as Tooltip from "@radix-ui/react-tooltip";
import { NavLink, useFetcher } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FallbackAvatar } from "~/components/avatar";
import { Button } from "~/components/button";
import { Counts } from "~/features/list/db";

type Follow = Pick<User, "avatar" | "firstName" | "lastName" | "username">;

export function UserStats({
  counts,
  isFollowing,
  isFollower,
  followerCount,
  followingCount,
  followers,
  following,
  isOther,
  user,
}: {
  counts: Counts;
  followers: Follow[];
  following: Follow[];
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isFollower: boolean;
  isOther?: boolean;
  user: User;
}) {
  return (
    <>
      <div className="hidden h-full w-80 flex-none flex-col border-r-gray-300/10 p-4 md:flex md:border-r">
        <div className="flex-none p-6 text-center">
          <FallbackAvatar
          // className="h-24 w-24 overflow-hidden"
          // imgSrc={user?.avatar ? getAvatarUrl(user.avatar) : null}
          />

          <div className="mt-4 flex items-center justify-center">
            <div className="flex flex-col">
              <div className="relative">
                {user?.firstName ||
                  (user?.lastName && (
                    <>
                      <span className="text-xl tracking-wide text-gray-300">{`${user.firstName}`}</span>
                      <span className="ml-1 truncate text-xl tracking-wide text-gray-300">{`${user.lastName}`}</span>
                    </>
                  ))}
                <span className="text-gray-400">{`@${user!.username}`}</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-2">
                {isOther && (
                  <FollowButton
                    username={user.username}
                    isFollowing={isFollowing}
                  />
                )}
                {isFollower && isOther && <FollowsYou />}
              </div>
            </div>
          </div>

          <span></span>
        </div>
        <div className="flex justify-between">
          <div className="flex w-full flex-col items-center border-r border-r-gray-300/20 px-4 py-5 shadow">
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">
                Movies
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-200">
                {counts.movies}
              </dd>
            </div>
          </div>

          <div className="flex w-full flex-col items-center border-r border-r-gray-300/20 px-4 py-5 shadow">
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">
                Books
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-200">
                {counts.books}
              </dd>
            </div>
          </div>

          <div className="flex w-full flex-col items-center px-4 py-5 shadow">
            <div>
              <dt className="truncate text-sm font-medium text-gray-400">TV</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-200">
                {counts.tv}
              </dd>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-8 px-4">
          <div>
            <div className="flex">
              <dt className="mb-2 truncate text-sm font-medium text-gray-400">
                Following
              </dt>
              <span className="ml-auto text-gray-200">{followingCount}</span>
            </div>
            <div className="flex -space-x-0.5">
              {following.length ? (
                following.map((followee, i) => (
                  <dd key={i}>
                    <FollowAvatar
                      avatar={followee.avatar}
                      firstName={followee.firstName}
                      lastName={followee.lastName}
                      username={followee.username}
                    />
                  </dd>
                ))
              ) : (
                <div className="text-sm text-white/80">
                  You're not following anyone yet
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex">
              <dt className="mb-2 truncate text-sm font-medium text-gray-400">
                Followers
              </dt>
              <span className="ml-auto text-gray-200">{followerCount}</span>
            </div>
            <div className="flex -space-x-0.5">
              {followers.length ? (
                followers.map((follower, i) => (
                  <dd key={i}>
                    <FollowAvatar
                      avatar={follower.avatar}
                      firstName={follower.firstName}
                      lastName={follower.lastName}
                      username={follower.username}
                    />
                  </dd>
                ))
              ) : (
                <div className="text-sm text-white/80">
                  You don't have any followers yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {isOther && (
        <div className="px-0-2 fixed left-0 top-0 flex px-3 py-2 sm:hidden">
          <div className="flex flex-col text-sm text-white/80">
            <span>{`${user?.firstName} ${user?.lastName}`}</span>
            <span className="text-xs text-white/60">@{user?.username}</span>
          </div>

          <FollowButton username={user.username} isFollowing={isFollowing} />
        </div>
      )} */}
    </>
  );
}

function FollowAvatar({ avatar, firstName, lastName, username }: Follow) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <NavLink to={`/${username}`} prefetch="intent">
            <FallbackAvatar
            // fallback={
            //   (firstName || lastName) && (
            //     <div className="flex h-full w-full items-center justify-center stroke-white/80 stroke-1">
            //       {firstName?.at(0) && <div>{firstName.at(0)}</div>}
            //       {lastName?.at(0) && <div>{lastName.at(0)}</div>}
            //     </div>
            //   )
            // }
            // className={
            //   "h-auto w-full max-w-[30px] stroke-2 p-1 [&>*]:stroke-2"
            // }
            // imgSrc={avatar && getAvatarUrl(avatar)}
            />
          </NavLink>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className="rounded-md bg-white px-2 py-1 text-sm text-black"
            sideOffset={7}
          >
            {`@${username}`}
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function FollowButton({
  isFollowing,
  username,
}: {
  isFollowing: boolean;
  username: string;
}) {
  const [_isFollowing, setIsFollowing] = useState(isFollowing);
  const { submit } = useFetcher();

  const onClick = () => {
    if (_isFollowing) {
      setIsFollowing(false);
      submit(
        { username: username },
        { method: "post", action: "/friends/unfollow" }
      );
      return;
    }
    if (!_isFollowing) {
      setIsFollowing(true);
      submit(
        { username: username },
        { method: "post", action: "/friends/follow" }
      );
      return;
    }
  };

  return (
    <Button
      onClick={onClick}
      className="relative flex w-32 items-center justify-center overflow-hidden whitespace-nowrap rounded px-8 py-4 text-white"
    >
      <AnimatePresence initial={false}>
        {_isFollowing ? (
          <motion.div
            key="unfollow"
            className="absolute flex h-full w-full items-center justify-center gap-3 hover:bg-red-500/20"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ spring: 0 }}
          >
            <UserMinusIcon className="h-5 w-5 stroke-white/80 " />
            <span className="font-normal">Unfollow</span>
          </motion.div>
        ) : (
          <motion.div
            key="follow"
            className="absolute flex h-full w-full items-center justify-center gap-3 hover:bg-green-500/20 "
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ spring: 0 }}
          >
            <UserPlusIcon className="h-5 w-5 stroke-white/80 " />
            <span className="text-sm font-medium">Follow</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

function FollowsYou() {
  return (
    <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
      Follows you
    </span>
  );
}
