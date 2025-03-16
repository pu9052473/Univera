"use client"
import React from "react"
import { useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Subject } from "@prisma/client"
import { UserContext } from "@/context/user"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"

const getSubjects = async (userId: string) => {
  const res = await axios.get("/api/subjects", {
    params: { userId }
  })

  return res.data.subjects
}

export default function CreateQuiz() {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { classId } = useParams<{ classId: string }>()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    tags: "",
    classId: classId || "",
    subjectId: "",
    topic: ""
  })
  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(user?.id as string),
    enabled: !!user?.id
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Handles text input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handles file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0])
  }
  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert("Please upload a document")
      return
    }

    setLoading(true)
    try {
      // const documentText = await extractTextFromPDF(file);

      const payload = {
        ...formData,
        universityId: `${user?.universityId}`,
        departmentId: `${user?.departmentId}`,
        // documentText,
        tags: formData.tags.split(",").map((tag) => tag.trim()) // Convert tags into an array
      }
      const res = await axios.post(
        `/api/classes/my-class/${classId}/quizzes`,
        payload
      )
      const result = res.data

      if (res.status == 201) {
        router.push(`/classes/my-class/${classId}/quizzes/${result.quiz.id}`)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.log(error)
      alert("An error occurred while generating the quiz.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Create a New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
            placeholder="Enter quiz title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            rows={3}
            placeholder="Enter a brief quiz description"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Topic </label>
          <textarea
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            rows={3}
            placeholder="Enter a quiz topic"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
              required
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
              required
              placeholder="e.g., Math, Science"
            />
          </div>
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-semibold">Subject</label>
          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select a subject</option>
            {subjectsLoading ? (
              <option disabled>Loading subjects...</option>
            ) : (
              subjects?.map((subject: Subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold">
            Upload Document (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 ease-in-out hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
      </form>
    </div>
  )
}
