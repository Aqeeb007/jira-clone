import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type Props = {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
};

export const ProjectAvatar = ({
  name,
  image,
  className,
  fallbackClassName,
}: Props) => {
  if (image) {
    return (
      <div
        className={cn("size-5 relative rounded-md overflow-hidden", className)}
      >
        <Image src={image} alt={name} fill />
      </div>
    );
  }

  return (
    <Avatar className={cn("size-10 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "text-white rounded-md bg-blue-600 font-semibold text-sm uppercase",
          fallbackClassName
        )}
      >
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
