"use client"

import React, { useContext, useEffect, useState } from "react"
import axios from "axios"

import { useParams } from "next/navigation"
import { UserContext } from "@/context/user"
import { CourseDetials } from "../../_components/courseDetails"
import toast from "react-hot-toast"

//Schema
const initForm = {
  name: "",
  code: "",
  totalSemister: 0
}

const CreatePage = () => {
  const { user } = useContext(UserContext)

  const [defaults, setDefaults] = useState<any>(initForm)

  const { courseId } = useParams()
  // Our own data
  useEffect(() => {
    const fetchCourse = async () => {
      const res = await axios.get(
        `/api/courses/${courseId}?courseId=${courseId}`
      )
      if (res.status !== 200) {
        toast.error("error while getting course details")
      }
      setDefaults(res.data.course)
    }
    fetchCourse()
  }, [courseId])

  return <CourseDetials courseId={courseId} user={user} defaults={defaults} />
}

export default CreatePage
