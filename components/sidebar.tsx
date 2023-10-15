"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileIcon, UserIcon } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="w-[280px]">
        <div className="flex flex-col items-start gap-2 w-[230px]">
          {/* Dashboard */}
          <Link
            href={"/dashboard"}
            className={`flex items-center gap-3 p-5 py-2 rounded-md w-full hover:bg-slate-300 ease-in duration-300 transition cursor-pointer ${
              pathname === "/dashboard" && "bg-slate-300"
            }`}
          >
            <FileIcon size={24} />
            <p>Dashboard</p>
          </Link>

          {/* Profile */}
          <Link
            href={"/profile"}
            className={`flex items-center gap-3 p-5 py-2 rounded-md w-full hover:bg-slate-300 ease-in duration-300 transition cursor-pointer ${
              pathname === "/profile" && "bg-slate-300"
            }`}
          >
            <UserIcon size={24} />
            <p>profile</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SideBar;
