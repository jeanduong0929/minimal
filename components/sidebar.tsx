"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileIcon, UserIcon } from "lucide-react";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col items-start gap-2 min-w-[230px]">
        {/* Dashboard */}
        <Link
          href={"/dashboard"}
          className={`flex items-center gap-3 p-5 py-2 rounded-md w-full hover:bg-[#202023] hover:text-white ease-in duration-200 transition cursor-pointer ${
            pathname === "/dashboard" && "bg-[#202023] text-white"
          }`}
        >
          <FileIcon size={24} />
          <p>Dashboard</p>
        </Link>

        {/* Profile */}
        <Link
          href={"/profile"}
          className={`flex items-center gap-3 p-5 py-2 rounded-md w-full hover:bg-[#202023] hover:text-white ease-in duration-200 transition cursor-pointer ${
            pathname === "/profile" && "bg-[#202023] text-white"
          }`}
        >
          <UserIcon size={24} />
          <p>Profile</p>
        </Link>
      </div>
    </>
  );
};

export default SideBar;
