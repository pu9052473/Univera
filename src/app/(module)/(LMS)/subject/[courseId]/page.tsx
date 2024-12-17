"use client"
import Left from "@/components/icons/Left"
import Right from "@/components/icons/Right"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Subject } from "@prisma/client"
import axios from "axios"

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]) // State to hold subjects
  const { courseId } = useParams()

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await axios.get(`/api/subjects?courseId=${courseId}`)
        if (response.status === 200) {
          // Ensure successful status code
          setSubjects(response.data.subjects) // Set subjects state with fetched data
        } else {
          console.error("Error fetching subjects", response)
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }

    if (courseId) {
      fetchSubjects() // Fetch subjects for the specific course
    }
  }, [courseId])

  return (
    <section className="mt-8 max-w-lg mx-auto flex flex-col">
      <div className="mt-8 flex">
        <Link
          className="flex justify-center gap-2 border-2 w-full border-black font-semibold rounded-lg px-6 py-2"
          href={"/subject"}
        >
          Back
          <Left />
        </Link>
        <Link
          className="flex justify-center gap-2 border-2 w-full border-black font-semibold rounded-lg px-6 py-2"
          href={`/subject/${courseId}/new`}
        >
          Create new subject
          <Right />
        </Link>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <h1 className="text-xl text-gray-500 font-bold uppercase mt-8">
          Edit existing subject:
        </h1>
        <div className="h-full w-full flex flex-col gap-2">
          {subjects?.length > 0 ? (
            subjects.map((subject) => (
              <Link
                key={subject.id} // Use subject ID as the key
                href={`/subject/${courseId}/edit/${subject.id}`} // Dynamically generate the path
                className="border w-full bg-gray-200 hover:bg-white flex-col mb-1 rounded-lg p-4"
              >
                <div className="relative">
                  {/* Optional: Add subject image */}
                  {/* <Image
                      className="rounded-md"
                      src={subject.image || "/default-image.png"}
                      alt={subject.name || "Subject Image"}
                      width={500}
                      height={500}
                    /> */}
                </div>
                <div className="text-center mt-4 font-semibold">
                  {subject.name} {/* Display subject name */}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No subjects found.</p>
          )}
        </div>
      </div>
    </section>
  )
}
