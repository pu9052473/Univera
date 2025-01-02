import {
  Home,
  FileText,
  Bell,
  Users,
  Calendar,
  BookOpen,
  ClipboardList,
  ScrollText
} from "lucide-react"

import React from "react"
import { type LucideIcon } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

export function ProfileBanner({ user }: { user: any }) {
  const { user: ClerkUser } = useUser()
  if (!user) return null
  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border-2 md:border-4 border-white">
        <div className="absolute inset-0">
          <Image
            height={100}
            width={100}
            src="/dashboard_background.jpg"
            alt="Background Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-row items-center justify-center space-y-3 space-x-2 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8">
            <div className="relative">
              <Image
                width={100}
                height={100}
                src={ClerkUser?.imageUrl ?? "/ladaki.jpg"}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 md:border-4 border-white shadow-lg object-cover"
              />
            </div>
            <div className="text-left items-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-Dark">
                {user.name}
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-TextTwo">
                {user.faculty?.position ?? "faculty"}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-TextTwo">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExploreItem({
  icon: Icon,
  title,
  desc
}: {
  icon: LucideIcon
  title: string
  desc: string
}) {
  return (
    <div className="w-full">
      <button className="w-full flex flex-col items-center p-4 sm:p-6 rounded-xl border bg-white hover:bg-gray-50 transition-colors group">
        <div className="flex gap-3 items-center">
          <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
            {title}
          </h4>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">{desc}</p>
      </button>
    </div>
  )
}

const exploreItems = [
  {
    icon: Home,
    title: "Home",
    desc: "description of that link will come here"
  },
  {
    icon: FileText,
    title: "Leave Section",
    desc: "description of that link will come here"
  },
  {
    icon: Bell,
    title: "Announcement",
    desc: "description of that link will come here"
  },
  {
    icon: Users,
    title: "My Team",
    desc: "description of that link will come here"
  },
  {
    icon: BookOpen,
    title: "Courses",
    desc: "description of that link will come here"
  },
  {
    icon: ClipboardList,
    title: "Exam Section",
    desc: "description of that link will come here"
  },
  {
    icon: Calendar,
    title: "Time-Table",
    desc: "description of that link will come here"
  },
  {
    icon: ScrollText,
    title: "Policies",
    desc: "description of that link will come here"
  }
]

export function ExploreGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {exploreItems.map((item, index) => (
        <ExploreItem
          key={index}
          icon={item.icon}
          title={item.title}
          desc={item.desc}
        />
      ))}
    </div>
  )
}
