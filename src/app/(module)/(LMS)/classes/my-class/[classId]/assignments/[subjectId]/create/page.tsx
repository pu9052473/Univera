"use client"
import { useContext } from "react"
import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import AssignmentForm from "../../../_components/AssignmentForm"

export default function Page() {
  const { user } = useContext(UserContext)
  const { classId, subjectId } = useParams()

  return (
    <div className=" bg-lamaSkyLight p-4 md:p-6 overflow-auto">
      <AssignmentForm
        courseId={Number(user?.courseId)}
        userId={String(user?.id)}
        classId={String(classId)}
        subjectId={String(subjectId)}
        universityId={Number(user?.universityId)}
        departmentId={Number(user?.departmentId)}
        userName={String(user?.name)}
        assignment={null}
      />
    </div>
  )
}
