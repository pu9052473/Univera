"use client"
import Profile from "@/components/(commnon)/Profile"
import { useUser } from "@clerk/nextjs"
import { Faculty, Student } from "@prisma/client"
import React, { useEffect, useState } from "react"

export default function Page() {
  const user = useUser()
  const userRole = user.user?.publicMetadata.role as string
  const userId = user.user?.id
  const [defaults, setDefaults] = useState<Faculty | Student | null>(null)

  const handleSubmit = async (updatedFields: any) => {
    console.log("updatedFields: ", updatedFields)
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
      if (response.ok) {
        console.log("Profile updated successfully", data)
      } else {
        console.error("Error updating profile", data)
      }
    } catch (error) {
      console.error("Error:", error)
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
  if (!defaults) return <>Loading...</>
  return (
    <div>
      {defaults && (
        <div className="w-full h-full flex justify-center p-3">
          <Profile
            clerkUser={user.user}
            defaults={defaults}
            onSubmit={handleSubmit}
            fields={["name", "phone"]}
          />
        </div>
      )}
    </div>
  )
}
