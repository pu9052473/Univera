"use client"
import React, { useContext } from "react"
import ClassesCard from "../_components/ClassesCard"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ClassesCardSkeleton } from "@/components/(commnon)/Skeleton"

export async function fetchClasses(courseId: number) {
  const { data } = await axios.get(`/api/classes`, {
    params: { courseId }
  })
  return data?.classes || []
}

export default function ClassesPage() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((role: any) => role.id)
  const courseId = user?.faculty.courseId || user?.course.id
  const {
    data: classes,
    error,
    isLoading
  } = useQuery({
    queryKey: ["classes", courseId, user?.id],
    queryFn: () => fetchClasses(courseId),
    enabled: !!courseId && !!user?.id
  })

  if (error) {
    return <p>Failed to load classes. Please try again later.</p>
  }

  return (
    <div>
      <div className="flex justify-end p-6">
        {roles && (roles.includes(5) || roles.includes(11)) && (
          <ButtonV1 label="Create New Class" href="/classes/create" />
        )}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 ml-2">
        {isLoading && (
          <>
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
            <ClassesCardSkeleton />
          </>
        )}
        {classes &&
          classes.map((c: any) => <ClassesCard key={c.id} Class={c} />)}
      </div>
    </div>
  )
}
