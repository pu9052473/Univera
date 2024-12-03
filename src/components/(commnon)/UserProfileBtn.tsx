"use client"
import React from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

interface UserProfileBtnProps {
  SideBarOpen: boolean
}

export default function UserProfileBtn({ SideBarOpen }: UserProfileBtnProps) {
  const { user, isLoaded } = useUser()
  return (
    <div
      className={`${
        SideBarOpen ? "w-full px-2" : "w-full p-1"
      } h-full cursor-pointer bg-Secondary text-TextTwo flex items-center justify-around rounded-xl hover:shadow-lg shadow-sm py-2`}
    >
      {SideBarOpen ? (
        <div className="w-full flex py-1 h-full items-center gap-2">
          {isLoaded ? (
            <div className="flex w-full items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-6 w-6 rounded-full"
                  }
                }}
              />
              <div className="text-sm font-bold font-roboto max-md:hidden">
                {user?.fullName ?? "User"}
              </div>
            </div>
          ) : (
            <Loader2 />
          )}
          <div className="">
            <ChevronDown />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between gap-2">
          <ChevronDown />
          {/* UserButton as a compact avatar-only version */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-6 w-6 rounded-full"
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
