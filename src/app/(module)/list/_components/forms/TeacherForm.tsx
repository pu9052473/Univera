"use client"
import React, { useContext, useState } from "react"
import UserForm from "./UserForm"
import WorkForm from "./WorkForm"
import RoleForm from "./RoleForm"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { RotateCcw } from "lucide-react"

const fetchCourses = async (departmentId: string, userId: string) => {
  const { data } = await axios.get(`/api/courses`, {
    params: { departmentId, userId }
  })
  return data?.courses || []
}
async function fetchRoles() {
  const { data } = await axios.get("/api/roles")
  console.log("data: ", data)
  return data.roles
}
export function TeacherForm() {
  const [fName, setFName] = useState<string>("")
  const [fEmail, setFEmail] = useState<string>("")
  const [fPassword, setFPassword] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([])
  const [step, setStep] = useState(1)
  const { user } = useContext(UserContext)

  const {
    data: courses,
    error: coursesError,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ["courses", user?.departmentAdmin.id, user?.id],
    queryFn: () => fetchCourses(user?.departmentAdmin.id, user?.id as string),
    enabled: !!user?.departmentAdmin?.id && !!user?.id
  })
  const {
    data: roles,
    error: rolesError,
    refetch: rolesRefetch
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: true
  })

  // Handle errors or loading states
  if (coursesError || rolesError) {
    return (
      <div className="text-red-500">
        {coursesError && (
          <div>
            <p>Failed to load courses. Please try again later.</p>
            <p className="text-sm text-gray-500">
              {coursesError?.message || "An unexpected error occurred."}
            </p>
            <ButtonV1
              icon={RotateCcw}
              label="Retry Courses"
              onClick={() => refetchCourses()}
            />
          </div>
        )}
        {rolesError && (
          <div>
            <p>Failed to load roles. Please try again later.</p>
            <p className="text-sm text-gray-500">
              {rolesError?.message || "An unexpected error occurred."}
            </p>
            <ButtonV1
              icon={RotateCcw}
              label="Retry Courses"
              onClick={() => rolesRefetch()}
            />
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="mt-8 max-w-2xl">
      {step == 1 && (
        <UserForm
          setStep={setStep}
          name={fName}
          setName={setFName}
          email={fEmail}
          setEmail={setFEmail}
          password={fPassword}
          setPassword={setFPassword}
        />
      )}
      {step == 2 && (
        <WorkForm
          selectedSubjectIds={selectedSubjectIds}
          setSelectedSubjectIds={setSelectedSubjectIds}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          setStep={setStep}
          courses={courses}
          departmentId={user?.departmentAdmin.id}
          departmentName={user?.departmentAdmin.name}
        />
      )}
      {step == 3 && <RoleForm roles={roles} setStep={setStep} />}
    </div>
  )
}
