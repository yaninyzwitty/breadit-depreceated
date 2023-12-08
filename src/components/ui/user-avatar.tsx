import {User} from "next-auth";
import React from "react";
import {Avatar, AvatarFallback} from "./avatar";
import Image from "next/image";
import {Icons} from "../icons";
import {AvatarProps} from "@radix-ui/react-avatar";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

function UserAvatar({user, ...props}: Props) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            src={user.image || "profile picture"}
            alt={user.name!}
            fill
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="w-4 h-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
