"use client";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-worksapce-id";
import { cn } from "@/lib/utils";
import { SettingsIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";

const routes = [
  {
    label: "Home",
    href: "",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UserIcon,
    activeIcon: UserIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const href = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === href;
        console.log(isActive);
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link href={href} key={href} className="flex items-center gap-2 p-2">
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md w-full font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover: opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              <span className="">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
