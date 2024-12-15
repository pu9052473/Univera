"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import { DataTable } from "../_components/dataTable"
import { columns } from "../_components/columns"
import { UserContext } from "@/context/user"
import axios from "axios"

const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Optional: Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axios.get(`/api/courses`, {
          params: {
            departmentId: user?.departmentAdmin.id,
            userId: user?.id,
            page
          }
        })
        // Safeguard against undefined or unexpected response structure
        const courses = data?.courses || []
        setCourses((prev) => (page === 1 ? courses : [...prev, ...courses]))

        // Check if there are more courses to load
        setHasMore(courses.length > 0)
      } catch (error) {
        console.error("Error fetching courses:", error)
        // setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user?.department?.id])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <DataTable columns={columns} data={courses} />
    </div>
  )
}

export default CoursesPage
