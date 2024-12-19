"use client"
import React, { useEffect, useState } from "react"
import { Course, Subject } from "@prisma/client"
import { DropdownInput } from "@/components/(commnon)/EditableInputField"
import Select from "react-select"
import { Button } from "@/components/ui/button"

interface CoursewithSubjects extends Course {
  subjects: Subject[]
}

interface WorkFormProps {
  setStep: (n: number) => void
  courses: CoursewithSubjects[]
  departmentName: string
  departmentId: number
  selectedCourse: string | null
  setSelectedCourse: (s: string) => void
  selectedSubjectIds: number[]
  setSelectedSubjectIds: (s: number[]) => void
}

export default function WorkForm({
  setStep,
  courses,
  departmentName,
  selectedCourse,
  setSelectedCourse,
  selectedSubjectIds,
  setSelectedSubjectIds
}: WorkFormProps) {
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([])
  const [courseOption, setCourseOption] = useState<
    { value: string; label: string }[]
  >([])

  // Update subject options when the selected course changes
  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.id === Number(selectedCourse))
      if (course) {
        setSubjectOptions(course.subjects)
      }
    } else {
      setSubjectOptions([]) // Clear options if no course selected
    }
  }, [selectedCourse, courses])
  useEffect(() => {
    const courseOptions = courses.map((c: Course) => ({
      value: `${c.id}`,
      label: c.name
    }))
    setCourseOption(courseOptions)
  }, [courses])

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    if (name === "courseId") {
      setSelectedCourse(value) // Update selected course
    }
  }

  const handleSubjectChange = (selectedOptions: any) => {
    const subjectIds = selectedOptions.map((option: any) => option.value)
    setSelectedSubjectIds(subjectIds) // Update selected subjects
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
        {courses && (
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

        {/* Multi-Select for Subjects */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Subjects
          </label>
          <Select
            isMulti
            options={subjectOptions.map((s) => ({
              value: s.id,
              label: s.name
            }))}
            onChange={handleSubjectChange}
            value={subjectOptions
              .filter((s) => selectedSubjectIds.includes(s.id))
              .map((s) => ({ value: s.id, label: s.name }))}
            className=""
          />
        </div>
      </div>

      {/* Debugging Output (Optional) */}
      {/* <div className="mt-4">
        <p>Selected Subject IDs: {JSON.stringify(selectedSubjectIds)}</p>
      </div> */}

      <div className="flex gap-4 mt-4">
        {/* Back Button */}
        <Button
          type="button"
          className="flex justify-end"
          onClick={() => setStep(1)}
        >
          Back
        </Button>

        {/* Next Button */}
        <Button
          type="button"
          className="flex justify-end"
          onClick={() => setStep(3)}
        >
          Next
        </Button>
      </div>
    </form>
  )
}
