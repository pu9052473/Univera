"use client"
import Profile from "@/components/(commnon)/Profile"
import { UserContext } from "@/context/user"
import { useUser } from "@clerk/nextjs"
// import { User } from "@prisma/client"
import React, { useContext, useState } from "react"
import toast from "react-hot-toast"

export default function Page() {
  const { user, dispatch } = useContext(UserContext)
  const clerkUser = useUser()
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
          updatedFields
        })
      })
      const data = await response.json()

      if (response.ok) {
        dispatch({ type: "SET_USER", user: data.updatedUser })
        toast.success("Profile updated sucessfully.")
      } else {
        toast.error("Failed to update profile")
        console.error("Error updating profile", data)
      }
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
          defaults={user}
          onSubmit={handleSubmit}
          fields={[
            "name",
            "phone",
            "email",
            "address",
            "gender",
            "dob",
            "birthPlace"
          ]}
        />
      </div>
    </div>
  )
}
