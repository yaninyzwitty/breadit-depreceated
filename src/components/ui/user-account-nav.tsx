"use client";
import {User} from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import UserAvatar from "./user-avatar";
import Link from "next/link";
import {signOut} from "next-auth/react";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

function UserAccountNav({user}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className="h-8 w-8 " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={"/"} prefetch={false}>
            Feed
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/r/create"} prefetch={false}>
            Create community
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={"/settings"} prefetch={false}>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserAccountNav;
