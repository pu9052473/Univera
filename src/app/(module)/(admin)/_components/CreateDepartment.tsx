import React, { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Submit } from "@/components/(commnon)/ButtonV1"

export default function CreateDepartment({
  universityId
}: {
  universityId: number
}) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ universityId, name, code })
      })
      if (response.ok) {
        toast.success("Department created successfully")
        const data = await response.json()
        const department = data.Department
        console.log("department: ", department)
        router.push(`/admin/departments/${department.id}`)
      } else {
        toast.error("Failed to create department")
        console.error("Error creating department", await response.json())
      }
    } catch (error) {
      console.error("Error creating department", error)
      toast.error("Failed to create department")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Department Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Department Code:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>
      <Submit label="Create Department" />
    </form>
  )
}
