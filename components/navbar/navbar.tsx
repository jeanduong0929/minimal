"use client";
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { CommandIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SessionStatus = "unauthenticated" | "authenticated" | "loading";

const Navbar = () => {
  const {
    data: session,
    status,
  }: { data: Session | null; status: SessionStatus } = useSession();

  return (
    <>
      <nav className="flex items-center justify-between max-w-screen-lg mx-auto w-11/12 py-5">
        <Link href={"/"} className="flex items-center gap-2">
          <CommandIcon size="24" />
          <h1 className="text-xl font-bold">Minimal.</h1>
        </Link>

        <div className="flex items-center gap-5 min-w-[40px] min-h-[40px]">
          {status === "loading" ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : status === "authenticated" ? (
            <UserDropdown session={session} />
          ) : (
            <Link href={"/login"}>
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

interface UserDropdownProps {
  session: Session | null;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ session }) => {
  const getInitial = (): string => {
    const email = session?.user?.email as string;
    return (email[0] + email[1]).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session?.user?.image as string} />
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={"/dashboard"}>
            <DropdownMenuItem>Dashboard</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Navbar;
