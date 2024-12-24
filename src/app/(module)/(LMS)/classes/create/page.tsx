"use client"
import React, { useContext } from "react"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import ClassForm from "../../_components/ClassForm"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { fetchCourses } from "../../_helper"

export default function CreateClassPage() {
  const { user } = useContext(UserContext)
  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses", user?.Department.id, user?.id],
    queryFn: () => fetchCourses(user?.Department.id, user?.id as string),
    enabled: !!user?.Department?.id && !!user?.id
  })

  const courseId = user?.faculty.courseId || (user?.course.id as number)

  return (
    <section className="mt-8 max-w-lg mx-auto">
      <div className="mt-8 flex">
        <Link
          className=" flex justify-center gap-2 w-full border font-semibold rounded-lg px-6 py-2"
          href={`/classes`}
        >
          <Left />
          Back
        </Link>
      </div>
      {isLoading && <p>Loading...</p>}
      {courses && (
        <ClassForm
          courseId={courseId}
          courses={courses}
          departmentId={user?.Department.id}
          universityId={user?.Department.universityId}
        />
      )}
    </section>
  )
}
