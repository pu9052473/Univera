"use client"

import React, { useContext, Suspense } from "react"
import { DataTable } from "../_components/dataTable"
import { columns } from "../_components/columns"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}

const CoursesTable = () => {
  const { user } = useContext(UserContext)

  const {
    data: courses,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["courses", user?.departmentAdmin.id, user?.id],
    queryFn: () => fetchCourses(user?.departmentAdmin.id, user?.id as string),
    enabled: !!user?.departmentAdmin?.id && !!user?.id
  })

  if (isLoading) {
    return <CoursesSkeleton />
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load courses. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  return (
    <Suspense fallback={<CoursesSkeleton />}>
      <DataTable columns={columns} data={courses || []} />
    </Suspense>
  )
}

const CoursesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <CoursesTable />
    </div>
  )
}

export default CoursesPage
