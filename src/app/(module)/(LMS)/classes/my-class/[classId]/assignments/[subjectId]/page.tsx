"use client"
import React, { useContext } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import toast from "react-hot-toast"
import { AssignmentTableComponent } from "../../_components/AssignmentTable"

async function fetchAssignments(classId: string, subjectId: string) {
  const res = await axios.get(
    `/api/classes/my-class/${classId}/assignments/${subjectId}`
  )
  return res.data.assignments
}

export default function AssignmentListPage() {
  const { user } = useContext(UserContext)
  const { classId, subjectId } = useParams()
  const roles = user?.roles?.map((role: any) => role.id)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["assignments", classId, subjectId],
    queryFn: () => fetchAssignments(classId as string, subjectId as string),
    enabled: !!user
  })
  async function deleteAssignment(id: string) {
    try {
      const res = await axios.delete(
        `/api/classes/my-class/${classId}/assignments/${subjectId}/${id}`
      )
      if (res.status == 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }
  return (
    <div>
      <AssignmentTableComponent
        data={data}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        roles={roles as number[]}
        classId={classId as string}
        subjectId={subjectId as string}
        deleteAssignment={deleteAssignment}
      />
    </div>
  )
}
