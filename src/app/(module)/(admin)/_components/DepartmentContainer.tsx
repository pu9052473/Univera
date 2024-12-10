import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Department } from "@prisma/client"
import Link from "next/link"
import React from "react"

export default function DepartmentContainer({
  departments
}: {
  departments: Department[]
}) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departments</h1>
      <ul className="mb-4">
        {!departments && <>Loading departments</>}
        {departments && departments.length == 0 && <>No departments found</>}
        {departments &&
          departments.map((department) => (
            <Link href={`/departments/${department.id}`} key={department.id}>
              {department.name}
            </Link>
          ))}
      </ul>
      <ButtonV1
        className="max-w-fit rounded-md"
        href="/departments/create"
        label="Create Department"
      />
    </div>
  )
}
