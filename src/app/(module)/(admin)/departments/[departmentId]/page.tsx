"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import DepartmentDetail from "../../_components/DepartmentDetail"

interface Department {
  id: number
  name: string
  code: string
  principalId: string | null
  adminId: string | null
  admin: { name: string }
  universityId: number
}
export default function Page() {
  const { departmentId } = useParams()
  const [department, setDepartment] = useState<Department | null>(null)

  useEffect(() => {
    const fetchDepartment = async () => {
      const response = await fetch(
        `/api/department/departmentId?departmentId=${departmentId}`
      )
      const data = await response.json()
      setDepartment(data.Department)
    }
    if (departmentId) {
      fetchDepartment()
    }
  }, [departmentId])

  return (
    <div>
      <DepartmentDetail department={department} />
    </div>
  )
}
