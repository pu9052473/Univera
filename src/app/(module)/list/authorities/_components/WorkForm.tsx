"use client"
import React, { useEffect, useState } from "react"
import { Course, Subject } from "@prisma/client"
import { DropdownInput } from "@/components/(commnon)/EditableInputField"

interface CoursewithSubjects extends Course {
  subjects: Subject[]
}

interface WorkFormProps {
  courses: CoursewithSubjects[]
  departmentName: string
  departmentId: number
  selectedCourse: string | null
  setSelectedCourse: (s: string) => void
}

export default function WorkForm({
  courses,
  departmentName,
  selectedCourse,
  setSelectedCourse
}: WorkFormProps) {
  const [courseOption, setCourseOption] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    if (courses) {
      //disabling course which already has hod
      const enabledCourse = courses.filter((c) => {
        if (!c.hodId || c.id == Number(selectedCourse)) {
          return c
        }
      })
      if (enabledCourse) {
        // Map courses to dropdown options
        const courseOptions = enabledCourse.map((c: Course) => ({
          value: `${c.id}`,
          label: c.name
        }))
        setCourseOption(courseOptions)
      } else {
        setCourseOption([{ value: "", label: "No course available" }])
      }
    }
  }, [courses])

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    if (name === "courseId") {
      setSelectedCourse(value) // Update selected course
    }
  }

  return (
    <form>
      <div className="flex flex-col">
        {/* Department Name Field */}
        <label className="text-sm">Department Name</label>
        <input
          disabled
          value={departmentName}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
        />

        {/* Course Dropdown */}
        {courses && courses.length > 0 && (
          <DropdownInput
            className="max-w-2xl w-full"
            label="Select Course"
            onChange={handleChange}
            placeholder={
              courseOption.find(
                (option) => Number(option.value) === Number(selectedCourse)
              )?.label || ""
            }
            value={
              courseOption.find(
                (option) => Number(option.value) === Number(selectedCourse)
              )?.value || ""
            }
            name="courseId"
            options={courseOption}
          />
        )}
      </div>
    </form>
  )
}
