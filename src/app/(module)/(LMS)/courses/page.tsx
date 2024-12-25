"use client"

import React, { useContext, Suspense } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw, PlusCircle } from "lucide-react"
import { Courcecard_c } from "../_components/Courcecard_c"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}

const CoursesGrid = () => {
  const { user } = useContext(UserContext)
  const [filter, setFilter] = React.useState("")

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

  const filteredCourses =
    courses?.filter((course) =>
      course.name.toLowerCase().includes(filter.toLowerCase())
    ) || []

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter courses..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Link href="/courses/create">
          <Button variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course: any) => (
          <Courcecard_c key={course.id} course={course} />
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No courses found.</p>
        </div>
      )}
    </div>
  )
}

const CoursesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesGrid />
      </Suspense>
    </div>
  )
}

export default CoursesPage
