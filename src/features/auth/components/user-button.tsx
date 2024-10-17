"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, LogOut } from "lucide-react";
import { useCurrent } from "../api/use-current";
import { useLogout } from "../api/use-logout";

export const UserButton = () => {
  const { mutate: logout } = useLogout();
  const { data: user, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-300">
        <Loader className="size-4 text-muted-foreground animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;
  const avatarFallback = name
    ? name[0].toUpperCase()
    : email?.[0].toUpperCase() ?? "U";

  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="size-10 hover:opacity-75 transition border-neutral-300 border">
            <AvatarFallback className="bg-neutral-200 font-medium text-neutral-50 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="w-60"
          sideOffset={10}
        >
          <div className=" flex flex-col items-center justify-center gap-2 px-2.5 py-4">
            <Avatar className="size-[52px] border-neutral-300 border">
              <AvatarFallback className="bg-neutral-200 text-xl font-medium text-neutral-50 flex items-center justify-center">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-900">{email}</p>
          </div>
          <DottedSeparator className="my-1" />
          <DropdownMenuItem
            onClick={logout}
            className=" h-10 items-center justify-center text-amber-700 cursor-pointer font-medium"
          >
            <LogOut className=" size-4 mr-2" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
