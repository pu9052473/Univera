"use client"
import React, { useEffect, useState } from "react"
import { LinkItem, Menuitems } from "@/constant"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Roles } from "@/types/globals"

export default function SideBar() {
  const pathName = usePathname()
  const { user } = useUser()
  const userRole: Roles = (user?.publicMetadata.role as Roles) ?? "admin"
  const [userLinks, setUserLinks] = useState<LinkItem[]>([])
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    if (userRole) {
      setUserLinks(Menuitems[userRole] || [])
    }
  }, [userRole])

  useEffect(() => {
    const found = userLinks.find((link) => pathName.endsWith(link.url))
    setActive(found?.url || "")
  }, [userLinks])

  // Check if we are on the signin or signup page
  const isAuthPage =
    pathName.includes("/sign-in") || pathName.includes("/sign-up")

  if (isAuthPage) {
    // Don't render the sidebar on signin or signup pages
    return null
  }

  return (
    <div className="mt-2 text-sm flex flex-col h-full w-full" id="sideBar">
      <div
        className="text-md font-bold flex flex-col gap-1"
        id="sidebar-content"
      >
        {userLinks.map((item) => {
          const isActive = active === item.url
          return (
            <Link
              href={item.url}
              key={item.title}
              onClick={() => setActive(item.url)}
              className={`flex items-center justify-center lg:justify-start gap-4 transition-all duration-200 border-l-4 font-bold text-gray-500 py-2 rounded-md hover:bg-lamaSkyLight md:px-2 ${
                isActive
                  ? "bg-Secondary shadow-sm hover:bg-Secondary font-bold border-ColorTwo"
                  : "hover:bg-gray-100 hover:text-gray-900 border-white"
              }`}
            >
              <item.icon />
              <span className="hidden lg:block">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
