"use client"
import Profile from "@/components/(commnon)/Profile"
import { UserContext } from "@/context/user"
import { useUser } from "@clerk/nextjs"
import { Faculty, Student } from "@prisma/client"
import React, { useContext, useState } from "react"
import toast from "react-hot-toast"

export default function Page() {
  const { user } = useContext(UserContext)
  const clerkUser = useUser()
  const [defaults, setDefaults] = useState<Faculty | Student | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (updatedFields: any) => {
    setLoading(true)
    if (!updatedFields) return

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user?.id,
          updatedFields,
          role: clerkUser.user?.publicMetadata.role
        })
      })
      const data = await response.json()
      console.log(data)

      if (response.ok) {
        setDefaults(data.updatedUser)
      } else {
        toast.error("Failed to update profile")
        console.error("Error updating profile", data)
      }
      toast.success("Profile updated sucessfully.")
    } catch (error) {
      console.error("Error @/profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex justify-center p-3">
        <Profile
          loading={loading}
          clerkUser={clerkUser.user}
          defaults={defaults}
          onSubmit={handleSubmit}
          fields={["name", "phone", "email"]}
        />
      </div>
    </div>
  )
}
