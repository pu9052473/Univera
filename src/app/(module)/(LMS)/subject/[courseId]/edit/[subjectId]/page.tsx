"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */

import { SubjectForm } from "@/app/(module)/(LMS)/_components/SubjectForm"
import Left from "@/components/icons/Left"
import { UserContext } from "@/context/user"
import { Course, Subject } from "@prisma/client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import DeleteButton from "@/components/(commnon)/DeleteButton"

const initForm = {
  name: "",
  code: "",
  credit: 0,
  semister: 0
}

export default function EditSubjectPage() {
  const { user } = useContext(UserContext)
  const { subjectId, courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [defaults, setDefaults] = useState<any>(initForm)
  const router = useRouter()

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await axios.get(
        `/api/courses/${courseId}?courseId=${courseId}`
      )
      if (res.status !== 200) {
        toast.error("error while getting course details")
      }
      setCourse(res.data.course)

      setDefaults(
        res.data.course.subjects.find((s: Subject) => s.id == Number(subjectId))
      )
    }
    fetchSubjects()
  }, [subjectId])

  async function handleDeleteClick() {
    try {
      const res = await axios.delete(
        `/api/subjects/${subjectId}?subjectId=${subjectId}`
      )
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/subject/${courseId}`)
      }
    } catch (error) {
      toast.error("Internal server error")
    }
  }

  return (
    <section className="mt-8 max-w-lg mx-auto">
      <div className="mt-8 flex">
        <Link
          className=" flex justify-center gap-2 w-full border font-semibold rounded-lg px-6 py-2"
          href={`/subject/${courseId}`}
        >
          <Left />
          Show all Subject
        </Link>
      </div>
      {course && (
        <div className="">
          <SubjectForm
            subject={defaults}
            submitBtnId="subject-update"
            courseId={Number(courseId)}
            department={user?.departmentAdmin}
            courseName={course?.name}
            departmentName={user?.departmentAdmin.name}
            submitBtnLabel={"Update"}
          />
          <div className="max-w-2xl mx-auto mt-1">
            <div className="">
              <DeleteButton
                label="Delete this item"
                onDelete={handleDeleteClick}
                className="bg-primary text-white w-full mt-4 hover:bg-red-500 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
