import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Loader2,
  Paperclip,
  Trash2,
  User
} from "lucide-react"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"

export default function AnnouncementCard({
  announcement,
  refetch
}: {
  announcement: any
  refetch: () => void
}) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
  const isLongText = announcement.description.length > 150

  const handleEdit = () => {
    router.push(`/announcements/form?announcementId=${announcement.id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/announcements`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: announcement.id })
      })

      if (!response.ok) {
        toast.error("Failed to delete announcement")
      }

      refetch() // Refetch announcements
    } catch (error) {
      if (error) toast.error("Failed to delete announcement")
    } finally {
      setIsDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div className="group p-3 mx-0.5 sm:p-4 md:p-6 bg-lamaSkyLight/50 hover:bg-white transition-all duration-300 rounded-lg shadow-sm hover:shadow-lg border border-ColorThree/20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-TextTwo group-hover:text-ColorThree transition-colors line-clamp-2">
          {announcement.title}
        </h2>
        <div className="text-base flex items-center gap-1.5 sm:text-xl font-semibold text-TextTwo group-hover:text-ColorThree transition-colors">
          <User size={18} className="shrink-0" />
          {announcement.announcerName}
        </div>
        <div className="flex items-center text-xs sm:text-sm text-TextTwo/70 whitespace-nowrap bg-lamaSkyLight px-3 py-1 rounded-full">
          <Clock size={14} className="mr-1.5 shrink-0" />
          {`${new Date(announcement.updatedAt).toLocaleString()}`}
        </div>
      </div>

      <div className="relative">
        <p
          className={`text-sm sm:text-base text-TextTwo/80 leading-relaxed ${
            isExpanded ? "whitespace-normal break-words" : "line-clamp-3"
          }`}
        >
          {announcement.description}
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

      {announcement.attachments?.length > 0 && (
        <div className="mt-4 sm:mt-5 space-y-2 bg-lamaSkyLight/50 p-3 rounded-lg">
          <div className="flex items-center text-xs sm:text-sm text-TextTwo/70">
            <Paperclip size={14} className="mr-1.5 shrink-0" />
            Attachments ({announcement.attachments.length})
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {announcement.attachments.map((attachment: any, index: number) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm 
                  bg-white text-ColorThree hover:bg-ColorThree hover:text-white
                  transition-all duration-200 hover:shadow-md w-fit truncate border border-ColorThree/20"
              >
                {attachment.fileName}
              </a>
            ))}
          </div>
        </div>
      )}

      {announcement.announcerId === user?.id && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
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
                w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 
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
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 
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
      )}
    </div>
  )
}
