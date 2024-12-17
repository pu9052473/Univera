"use client"
import Link from "next/link"
import toast from "react-hot-toast"
import { SubjectForm } from "../../../_components/SubjectForm"
import { UserContext } from "@/context/user"
import { useContext, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Course } from "@prisma/client"
import Left from "@/components/Icons/Left"

export default function NewSubjectPage() {
  const { user } = useContext(UserContext)
  const { courseId } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  async function fetchCourse() {
    try {
      const res = await axios.get(
        `/api/courses/${courseId}?courseId=${courseId}`
      )
      console.log("res: ", res)
      setCourse(res.data.course)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
    }
  }
  useEffect(() => {
    if (courseId) {
      fetchCourse()
    }
  }, [])
  return (
    <section className="mt-8 max-w-lg mx-auto">
      <div className="mt-8 flex">
        <Link
          className=" flex justify-center gap-2 w-full border font-semibold rounded-lg px-6 py-2"
          href={`/subject/${courseId}`}
        >
          <Left />
          Show all subject
        </Link>
      </div>
      {/* Form */}
      <SubjectForm
        courseId={Number(courseId)}
        department={user?.departmentAdmin}
        courseName={course?.name}
        departmentName={user?.departmentAdmin.name}
        submitBtnId="submit"
        submitBtnLabel={"Create"}
      />
    </section>
  )
}
