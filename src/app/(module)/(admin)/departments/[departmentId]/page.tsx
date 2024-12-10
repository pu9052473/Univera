"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Department } from "@prisma/client"
import DepartmentDetail from "../../_components/DepartmentDetail"

export default function Page() {
  const { departmentId } = useParams()
  const [department, setDepartment] = useState<Department | null>(null)

  useEffect(() => {
    const fetchDepartment = async () => {
      const response = await fetch(`/api/department/${departmentId}`)
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
