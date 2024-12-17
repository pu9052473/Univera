"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/user"
import axios from "axios"
import { SubjectTable } from "../_components/Table"
import { Scolumns } from "../_components/Scolumns"

const SubjectPage = () => {
  const [courses, setCourses] = useState([])
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  // Optional: Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      console.log("fetching courses")
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
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user?.department?.id])

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
