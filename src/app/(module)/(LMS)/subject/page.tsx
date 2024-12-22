"use client"

import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import axios from "axios"
import { SubjectCard } from "../_components/SubjectCard"
import { CoursesSkeleton } from "@/components/(commnon)/Skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

const SubjectPage = () => {
  const [courses, setCourses] = useState([])
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState("")
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

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
  }, [user?.department?.id, page, sortColumn, sortDirection])

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(filter.toLowerCase())
  )

  const toggleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
    setPage(1)
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
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={() => toggleSort("name")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => toggleSort("code")}>
            Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={() => toggleSort("subject")}>
            Total subjects
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      {loading && page === 1 ? (
        <CoursesSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <SubjectCard key={course.id} course={course} />
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
