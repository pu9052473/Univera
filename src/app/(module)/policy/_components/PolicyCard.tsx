import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Loader2,
  Paperclip,
  Trash2
} from "lucide-react"
import toast from "react-hot-toast"

// Format date function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

export default function PolicyCard({
  policy,
  refetch,
  canCreatePolicy
}: {
  policy: any
  refetch: () => void
  canCreatePolicy: boolean
}) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
  const isLongText = policy.description.length > 150

  const handleEdit = () => {
    router.push(`/policy/form?policyId=${policy.id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/policy`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: policy.id })
      })

      if (!response.ok) {
        toast.error("Failed to delete policy")
      }

      refetch() // Refetch policys
    } catch (error) {
      if (error) toast.error("Failed to delete policy")
    } finally {
      setIsDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div className="group bg-white hover:bg-lamaSkyLight/30 transition-all duration-300 rounded-xl shadow-sm hover:shadow-lg border border-transparent hover:border-ColorThree/20 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-TextTwo group-hover:text-ColorThree transition-colors">
            {policy.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center text-xs sm:text-sm text-TextTwo/70 bg-lamaSkyLight/70 px-3 py-1 rounded-full">
              <Clock size={14} className="mr-1.5 shrink-0" />
              {formatDate(policy.createdAt)}
            </span>
          </div>
        </div>

        {/* Description Section */}
        <div className="relative">
          <p
            className={`text-sm sm:text-base text-TextTwo/80 leading-relaxed ${
              isExpanded ? "whitespace-normal break-words" : "line-clamp-3"
            }`}
          >
            {policy.description}
          </p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-ColorThree hover:text-ColorThree/80 text-sm font-medium flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show more <ChevronDown size={16} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Timeline Section */}
        <div className="bg-lamaSkyLight/40 rounded-lg p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-TextTwo/70">
                Timeline
              </span>
              <Calendar size={18} className="text-ColorThree" />
            </div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-2">
              <div className="flex-1">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-TextTwo/60 mb-1">
                    Effective From
                  </span>
                  <span className="text-sm font-semibold text-ColorThree">
                    {formatDate(policy.effectiveDate)}
                  </span>
                </div>
              </div>

              {policy.expiryDate && (
                <>
                  <div className="hidden sm:block h-0.5 w-[20%] mr-5 bg-gradient-to-r from-ColorThree to-red-400 rounded" />
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-TextTwo/60 mb-1">
                        Expires On
                      </span>
                      <span className="text-sm font-semibold text-red-500">
                        {formatDate(policy.expiryDate)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {policy.expiryDate && (
                <div className="sm:ml-4">
                  {new Date(policy.expiryDate) > new Date() ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                      Expired
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {policy.attachments?.length > 0 && (
          <div className="bg-white border border-ColorThree/10 rounded-lg p-4">
            <div className="flex items-center text-xs sm:text-sm text-TextTwo/70 mb-3">
              <Paperclip size={14} className="mr-1.5 shrink-0" />
              Attachments ({policy.attachments.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {policy.attachments.map((attachment: any, index: any) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm 
                    bg-lamaSkyLight/30 text-ColorThree hover:bg-ColorThree hover:text-white
                    transition-all duration-200 hover:shadow-md truncate border border-ColorThree/20"
                >
                  {attachment.fileName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions Section */}
      {canCreatePolicy && (
        <div className="px-4 sm:px-6 py-4 mt-2">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree 
              hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/edit w-full sm:w-auto"
            >
              <Edit
                size={16}
                className="transition-transform group-hover/edit:rotate-12"
              />
              Edit
            </button>

            {showConfirmDelete ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-red-600 border border-red-600
                  w-full sm:w-auto hover:bg-red-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 
                  transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Confirm Delete"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 
                transition-all duration-200 flex items-center justify-center gap-2 group/delete w-full sm:w-auto"
              >
                <Trash2
                  size={16}
                  className="transition-transform group-hover/delete:rotate-12"
                />
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
