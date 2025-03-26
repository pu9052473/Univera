import React, { useContext } from "react"
import { UserContext } from "@/context/user"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Clock,
  Eye,
  EyeOff,
  FileText,
  Tag,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface QuizQuestion {
  id: number
  title: string
  description?: string | null
  options: string[]
  correctAnswer: number
  marks: number
}

interface Quiz {
  id: number
  title: string
  description: string
  documentUrl?: string | null
  tags: string[]
  createdByName: string
  creatorId: string
  duration: string
  numberOfQuestions: number
  totalMarks: number
  visibility: "public" | "private"
  status: "draft" | "published" | "completed"
  classId: number
  subjectId: number
  departmentId: number
  universityId: number
  questions: QuizQuestion[]
}

interface QuizReviewProps {
  quiz: Quiz
  onUpdateStatus: (quizId: number, newStatus: string) => void
  onUpdateVisibility: (quizId: number, newVisibility: string) => void
}

const QuizReview: React.FC<QuizReviewProps> = ({
  quiz,
  onUpdateStatus,
  onUpdateVisibility
}) => {
  const { user } = useContext(UserContext)
  const userRoles = user?.roles.map((role: any) => role.id)
  const isStudent = userRoles?.includes(7)

  if (!user || isStudent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 bg-lamaSkyLight rounded-lg border border-lamaSky">
          <AlertCircle className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-TextTwo font-medium">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    )
  }

  const isViewMode = quiz.status === "completed"
  const isPublished = quiz.status === "published"
  const isDraft = quiz.status === "draft"
  const isPrivate = quiz.visibility === "private"

  const handleStatusChange = () => {
    const newStatus = isDraft ? "published" : "draft"
    onUpdateStatus(quiz.id, newStatus)
  }

  const handleVisibilityChange = () => {
    const newVisibility = isPrivate ? "public" : "private"
    onUpdateVisibility(quiz.id, newVisibility)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Quiz Header */}
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-TextTwo">
              {quiz.title}
            </h1>
            <p className="text-gray-600 mt-1">{quiz.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
            <Badge
              className={`px-3 py-1 ${isDraft ? "bg-lamaYellow text-TextTwo" : isPublished ? "bg-ColorThree text-white" : "bg-green-500 text-white"}`}
            >
              {quiz.status}
            </Badge>
            <Badge
              className={`px-3 py-1 ${isPrivate ? "bg-lamaPurple text-TextTwo" : "bg-ColorOne text-TextTwo"}`}
            >
              {isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
        </div>

        {/* Quiz Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={18} />
            <span>Duration: {quiz.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText size={18} />
            <span>Questions: {quiz.numberOfQuestions}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle size={18} />
            <span>Total Marks: {quiz.totalMarks}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Tag size={16} className="text-TextTwo" />
          {quiz.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-lamaSkyLight text-TextTwo px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {!isViewMode && (
            <Button
              onClick={handleStatusChange}
              className={`px-4 py-2 ${isDraft ? "bg-ColorThree hover:bg-ColorThree/90" : "bg-lamaYellow text-TextTwo hover:bg-lamaYellow/90"}`}
            >
              {isDraft ? "Publish Quiz" : "Return to Draft"}
            </Button>
          )}
          <Button
            onClick={handleVisibilityChange}
            className="px-4 py-2 bg-lamaSky text-TextTwo hover:bg-lamaSky/90"
          >
            {isPrivate ? (
              <>
                <Eye size={16} className="mr-2" />
                Make Public
              </>
            ) : (
              <>
                <EyeOff size={16} className="mr-2" />
                Make Private
              </>
            )}
          </Button>
        </div>

        {/* Visibility explainer */}
        <div className="mt-4 text-sm text-gray-500 bg-lamaSkyLight p-3 rounded-lg">
          <p className="flex items-center">
            {isPrivate ? (
              <>
                <EyeOff size={14} className="mr-2 text-TextTwo" />
                <span>
                  This quiz is <strong>private</strong>. Only you can see it.
                </span>
              </>
            ) : (
              <>
                <Eye size={14} className="mr-2 text-TextTwo" />
                <span>
                  This quiz is <strong>public</strong>. All students can see it.
                </span>
              </>
            )}
          </p>
        </div>
      </Card>

      {/* Quiz Questions */}
      <h2 className="text-xl font-bold mb-4 text-TextTwo">Quiz Questions</h2>
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <Card
            key={index}
            className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 md:p-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mb-2 text-TextTwo">
                Q{index + 1}. {question.title}
              </h2>
              <Badge className="bg-ColorOne text-TextTwo">
                {question.marks} marks
              </Badge>
            </div>

            {question.description && (
              <p className="text-sm text-gray-600 mb-3 bg-lamaSkyLight p-2 rounded-lg">
                {question.description}
              </p>
            )}

            <ul className="space-y-2 mt-3">
              {question.options.map((option, optIndex) => (
                <li
                  key={optIndex}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    optIndex === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`font-medium ${optIndex === question.correctAnswer ? "text-green-600" : ""}`}
                  >
                    {String.fromCharCode(65 + optIndex)}.
                  </span>{" "}
                  {option}
                </li>
              ))}
            </ul>

            <div className="mt-3 text-sm text-gray-500 flex items-center">
              <CheckCircle size={16} className="mr-1 text-green-500" />
              <span>
                <strong>Correct Answer:</strong> Option{" "}
                {String.fromCharCode(65 + question.correctAnswer)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default QuizReview
