"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import axios from "axios"

import { CourseCard } from "../_components/CourseCard"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { Input } from "@/components/ui/input"

import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}

const SubjectPage = () => {
  const { user } = useContext(UserContext)

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [courses, setCourses] = useState([]) // Define courses state

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      console.log("fetching courses")
      try {
        const { data } = await axios.get(`/api/courses`, {
          params: {
            departmentId: user?.departmentAdmin.id,
            userId: user?.id,
            page,
            sortColumn,
            sortDirection
          }
        })
        const newCourses = data?.courses || []
        setCourses((prev) =>
          page === 1 ? newCourses : [...prev, ...newCourses]
        )
        setHasMore(newCourses.length > 0)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user?.departmentAdmin.id, user?.id, page, sortColumn, sortDirection])

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(filter.toLowerCase())
  )

  const {
    data: queryCourses,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["courses", user?.departmentAdmin.id, user?.id],
    queryFn: () => fetchCourses(user?.departmentAdmin.id, user?.id as string),
    enabled: !!user?.departmentAdmin?.id && !!user?.id
  })

  useEffect(() => {
    if (queryCourses) {
      setCourses(queryCourses)
    }
  }, [queryCourses])

  if (isLoading || loading) {
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
      <h2 className="text-sm text-gray-500 font-bold mb-4">
        Add subject to your course
      </h2>
      <div className="flex items-center py-4 justify-between mb-4">
        <Input
          placeholder="Filter courses..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      {loading && page === 1 ? (
        <CoursesSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="flex justify-center mt-4">
          {/* <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button> */}
        </div>
      )}
    </div>
  )
}

export default SubjectPage
