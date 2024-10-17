import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigations";

export const Sidebar = () => {
  return (
    <aside className=" h-full bg-neutral-100 p-4 wfu">
      <Link href={"/"} className="text-2xl font-bold">
        <Image src={"/logo.svg"} alt="logo" width={140} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};
