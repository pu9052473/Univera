import React, { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Building2, Tags } from "lucide-react"
import { Submit } from "@/components/(commnon)/ButtonV1"

export default function CreateDepartment({
  universityId
}: {
  universityId: number
}) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
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
        setLoading(false)
        router.push(`/departments/${department.id}`)
      } else {
        toast.error("Failed to create department")
        setLoading(false)
      }
    } catch (error) {
      console.error("Error creating department", error)
      toast.error("Failed to create department")
    }
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white border-Primary rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold my-4 text-Primary text-center">
          Create Department
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={20} className="text-ColorThree" />
              <span className="font-semibold text-TextTwo">
                Department Name
              </span>
            </div>
            <input
              type="text"
              value={name}
              placeholder="Eg. Btech"
              onChange={(e) => setName(e.target.value)}
              className="p-2 border transition-all ease-in-out duration-500 rounded-md w-full focus:ring-2 border-ColorOne bg-Secondary text-TextTwo outline-ColorThree"
              required
            />
          </label>
          <label className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <Tags size={20} className="text-ColorThree" />
              <span className="font-semibold text-TextTwo">
                Department Code
              </span>
            </div>
            <input
              type="text"
              value={code}
              placeholder="Eg. BT101"
              onChange={(e) => setCode(e.target.value)}
              className="p-2 border transition-all ease-in-out duration-500 rounded-md w-full focus:ring-2 border-ColorOne bg-Secondary text-TextTwo outline-ColorThree"
              required
            />
          </label>
          <Submit
            loading={loading}
            label="Create Department"
            className="w-full mt-4 bg-Primary text-white border-ColorThree"
          />
        </form>
      </div>
    </div>
  )
}
