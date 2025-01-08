"use client"
import React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import "react-loading-skeleton/dist/skeleton.css"
import { useState } from "react"
import { Prisma } from "@prisma/client"

type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    user: true
  }
}>

interface StudentFormProps {
  student?: StudentWithRelations
  submitBtnId?: string
  submitBtnLabel?: string
  isEditable?: boolean
  courseId: number
  departmentId: number
  universityId: number
  refetch?: () => void
}

export default function StudentForm({
  student,
  submitBtnId,
  submitBtnLabel,
  isEditable,
  courseId,
  departmentId,
  universityId,
  refetch
}: StudentFormProps) {
  const [name, setName] = useState<string>(student?.user.name ?? "")
  const [email, setEmail] = useState<string>(student?.user.email ?? "")
  const [password, setPassword] = useState<string>("")
  const [rollno, setRollNo] = useState<number>(student?.rollNo ?? 0)
  const [prn, setPRN] = useState<string>(student?.prn ?? "")
  const [semester, setSemester] = useState<number>(student?.semester ?? 0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const buttonId = (e.nativeEvent as SubmitEvent).submitter?.id

    if (buttonId == "student-submit") {
      try {
        const createFormData = {
          name: name,
          email: email,
          password: password,
          rollNo: Number(rollno),
          prn: prn,
          semester: Number(semester),
          year: Math.ceil(Number(semester) / 2),
          courseId,
          departmentId,
          universityId
        }
        const res = await axios.post(`/api/list/student/create`, createFormData)
        if (res.status === 201) {
          toast.success(res.data.message)
          router.push(`/list/students`)
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
    } else if (buttonId == "student-update") {
      try {
        const updatedStudent = {
          rollNo: Number(rollno),
          prn: prn,
          semester: Number(semester)
        }
        const res = await axios.patch(
          `/api/list/student/${student?.id}`,
          updatedStudent
        )
        if (res.status === 200) {
          toast.success(res.data.message)
          if (refetch) refetch()
          router.push(`/list/students`)
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
  }
  return (
    <form className="mt-8 max-w-2xl" onSubmit={handleSubmit}>
      <div
        className="grid items-start gap-2"
        // style={{ gridTemplateColumns: '.3fr .7fr' }}
      >
        <label className="text-sm">Full Name</label>
        <input
          value={name}
          disabled={!!isEditable}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
          onChange={(e) => {
            setName(e.target.value)
          }}
        />

        <label className="text-sm">College Email</label>
        <input
          disabled={!!isEditable}
          value={email}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        {!isEditable && (
          <div className="">
            <label className="text-sm">Password</label>
            <input
              value={password}
              className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
              type="text"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </div>
        )}

        <label className="text-sm">Roll No</label>
        <input
          value={rollno}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="number"
          onChange={(e) => {
            setRollNo(Number(e.target.value))
          }}
        />

        <label className="text-sm">PRN</label>
        <input
          value={prn}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
          onChange={(e) => {
            setPRN(e.target.value)
          }}
        />

        <label className="text-sm">Semester</label>
        <input
          value={semester}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="number"
          onChange={(e) => {
            setSemester(Number(e.target.value))
          }}
        />

        <button
          id={submitBtnId ?? "submit"}
          type="submit"
          className="bg-Primary text-white w-full mt-4 hover:bg-blue-500 rounded-lg px-4 py-2"
        >
          {submitBtnLabel}
        </button>
      </div>
    </form>
  )
}
