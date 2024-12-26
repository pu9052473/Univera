import { User } from "@prisma/client"
import Image from "next/image"
import React from "react"

interface UserCardProps {
  User: User
}

export default function UserCard({ User }: UserCardProps) {
  return (
    <div
      className="flex flex-col md:flex-row items-center md:items-start 
                         justify-between mb-10 space-y-6 md:space-y-0 
                         bg-gradient-to-br from-[#f4f5ff] to-[#e6e8f3] p-6 rounded-xl shadow-lg 
                         hover:bg-white/90 transition-all duration-300 
                         border border-Secondary"
    >
      <div className="flex flex-col items-center md:items-start">
        <h1
          className="text-2xl md:text-3xl font-extrabold mb-4 
                             text-Dark text-center md:text-left 
                             drop-shadow-md"
        >
          {User && User.name}&#39;s Profile
        </h1>
        <div
          className="relative h-28 w-28 rounded-full shadow-2xl 
                             overflow-hidden bg-ColorTwo/20 
                             transition-all duration-500 
                             hover:scale-105 hover:shadow-2xl 
                             hover:ring-4 hover:ring-ColorThree"
        >
          <Image
            src={"/user.jpg"}
            className="object-cover h-full w-full transition-transform duration-300 hover:scale-110"
            height={112}
            width={112}
            alt="Profile"
            priority
          />
        </div>
      </div>
      <div
        className="text-center md:text-right text-TextTwo/80 
                           space-y-2 text-sm md:text-base"
      >
        <p className="animate-pulse text-ColorThree">
          Last Updated:{" "}
          {User && new Date(User.updatedAt).toISOString().split("T")[0]}
        </p>
      </div>
    </div>
  )
}
