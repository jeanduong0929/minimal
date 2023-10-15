"use client";
import React from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { CommandIcon } from "lucide-react";
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
import Loader from "../loader";

const Navbar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <>
      <nav className="flex items-center justify-between max-w-screen-lg mx-auto w-11/12 py-5">
        <Link href={"/"} className="flex items-center gap-2">
          <CommandIcon size="24" />
          <h1 className="text-xl font-bold">Minimal.</h1>
        </Link>

        <div>
          {session ? (
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
          <Link href={"/profile"}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
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
