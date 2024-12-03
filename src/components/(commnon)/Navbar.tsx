"use client"
import { SignOutButton } from "@clerk/nextjs"
import React from "react"
import UserProfileBtn from "./UserProfileBtn"
import { LogOut, UserRoundPen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function Navbar() {
  return (
    <div className="flex justify-end p-4 gap-4">
      <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full">
              <UserProfileBtn SideBarOpen={true} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
            <DropdownMenuItem className="w-full">
              <div className="flex items-center gap-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <LogOut className="w-4 h-4" />
                <SignOutButton redirectUrl="/signin" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full">
              <Link
                className="flex items-center gap-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                href={"/profile"}
              >
                <UserRoundPen className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
