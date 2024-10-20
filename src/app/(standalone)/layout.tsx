"use client";

import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const StandaloneLayout = ({ children }: Props) => {
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href={"/"}>
            <Image src={"/logo.svg"} alt="logo" width={152} height={56} />
          </Link>
          <UserButton />
        </nav>
        <div className="items-center justify-center py-4 flex flex-col">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
