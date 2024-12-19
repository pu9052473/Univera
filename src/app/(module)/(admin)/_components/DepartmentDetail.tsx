import { assignAdmin, createUser } from "@/utils/clerk"
import React, { useState } from "react"

type DepartmentDetailProps = {
  department: {
    id: number
    name: string
    code: string
    principalId: string | null
    adminId: string | null
    admin: { name: string }
  } | null
}

function DepartmentDetail({ department }: DepartmentDetailProps) {
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateAdmin = () => {
    setIsCreating(true)
  }

  if (!department) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-2">Department Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <strong>ID:</strong> {department.id}
        </div>
        <div>
          <strong>Name:</strong> {department.name}
        </div>
        <div>
          <strong>Code:</strong> {department.code}
        </div>
        {department.adminId ? (
          <div>
            <strong>Admin ID:</strong> {department.admin.name}
          </div>
        ) : (
          <button
            onClick={handleCreateAdmin}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Department Admin
          </button>
        )}
      </div>
      {isCreating && <CreateAdminForm departmentId={department.id} />}
    </div>
  )
}

export default DepartmentDetail

type CreateAdminFormProps = {
  departmentId: number
}

function CreateAdminForm({ departmentId }: CreateAdminFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    const role = "department_admin"
    try {
      // Call the function to create a Clerk user
      const DAdmin = await createUser({
        name,
        email,
        phone,
        password,
        role,
        roleIds: [3]
      })
      if (!DAdmin) {
        throw new Error("Error creating user")
      }
      await assignAdmin(departmentId, DAdmin.id)
      setMessage("Admin created successfully!")
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border rounded shadow-sm">
      <h3 className="text-lg font-bold mb-2">Create Department Admin</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="">
          <label className="block font-medium mb-1">phone</label>
          <input
            type="phone"
            className="w-full p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Admin"}
        </button>
        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  )
}
