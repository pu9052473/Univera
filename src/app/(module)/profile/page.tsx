"use client"
import Profile from "@/components/(commnon)/Profile"
import { useUser } from "@clerk/nextjs"
import { Faculty, Student } from "@prisma/client"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Page() {
  const user = useUser()
  const userRole = user.user?.publicMetadata.role as string
  const userId = user.user?.id
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
        body: JSON.stringify({ userId, updatedFields, role: userRole })
      })
      const data = await response.json()
      console.log(data)

      if (response.ok) {
        setDefaults(data.updatedUser)
      } else {
        console.error("Error updating profile", data)
      }
      toast.success("Profile updated sucessfully.")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userRole && userId) {
      const fetchData = async () => {
        const response = await fetch(
          `/api/profile?role=${userRole}&userId=${userId}`
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Fetched user data:", data.User)
        setDefaults(data.User)
      }
      fetchData()
    }
  }, [userId, userRole])
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex justify-center p-3">
        <Profile
          loading={loading}
          clerkUser={user.user}
          defaults={defaults}
          onSubmit={handleSubmit}
          fields={["name", "phone", "email"]}
        />
      </div>
    </div>
  )
}
