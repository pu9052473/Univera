import React, { useContext } from "react"
import { UserContext } from "@/context/user"

interface QuizQuestion {
  title: string
  description?: string | null
  options: string[]
  correctAnswer: number
  marks: number
}

interface QuizReviewProps {
  quizData: QuizQuestion[]
}

const QuizReview: React.FC<QuizReviewProps> = ({ quizData }) => {
  const { user } = useContext(UserContext)
  const userRoles = user?.roles.map((role: any) => role.id)
  if (!user || userRoles?.includes(7)) {
    return (
      <p className="text-center text-gray-500">
        You are not authorized to view this page.
      </p>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Generated Quiz Questions
      </h1>
      <div className="space-y-6">
        {quizData.map((question, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5"
          >
            <h2 className="text-xl font-semibold mb-2">
              Q{index + 1}. {question.title}
            </h2>
            {question.description && (
              <p className="text-sm text-gray-600 mb-2">
                {question.description}
              </p>
            )}

            <ul className="space-y-2 mt-2">
              {question.options.map((option, optIndex) => (
                <li
                  key={optIndex}
                  className={`px-4 py-2 rounded-lg border ${
                    optIndex === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <span className="font-medium">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>{" "}
                  {option}
                </li>
              ))}
            </ul>

            <div className="mt-3 text-sm text-gray-500">
              <strong>Correct Answer:</strong> Option{" "}
              {String.fromCharCode(65 + question.correctAnswer)}
              <br />
              <strong>Marks:</strong> {question.marks}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuizReview
