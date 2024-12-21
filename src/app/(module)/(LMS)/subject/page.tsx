"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import axios from "axios"
import { SubjectTable } from "../_components/Table"
import { Scolumns } from "../_components/Scolumns"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}

const SubjectPage = () => {
  const { user } = useContext(UserContext)

  // // Optional: Pagination
  // const [page, setPage] = useState(1)
  // const [hasMore, setHasMore] = useState(true)

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
    <div className="p-6">
      <h1 className="text-2xl font-bold">Courses</h1>
      <h2 className="text-sm text-gray-500 font-bold">
        Add subject to your course
      </h2>
      <SubjectTable columns={Scolumns} data={courses} />
    </div>
  )
}

export default SubjectPage
