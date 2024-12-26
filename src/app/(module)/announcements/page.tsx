"use client"

import { UserContext } from "@/context/user"
import React, { useContext, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  FilePlus,
  Loader2,
  Paperclip,
  RotateCcw,
  Trash2
} from "lucide-react"
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@radix-ui/react-tabs"
import { useRouter } from "next/navigation"

// Format date function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

async function fetchAnnouncements(departmentId: string, universityId: string) {
  const response = await fetch(
    `/api/announcements?route=findMany&&departmentId=${departmentId}&&universityId=${universityId}`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch the announcements")
  }
  return response.json()
}

export default function AnnouncementsPage() {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const isStudent = user?.roles.some((role: any) => role.rolename === "student")

  const {
    data: announcements,
    error,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["announcements", user?.departmentId, user?.universityId],
    queryFn: () => fetchAnnouncements(user?.departmentId, user?.universityId),
    enabled: !!user?.departmentId && !!user?.universityId
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Failed to load announcement. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {error?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto p-3 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h1 className="text-2xl font-semibold text-TextTwo text-center sm:text-left">
            Announcements
          </h1>
          <button
            onClick={() => router.push("/announcements/form")}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree 
            hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/create w-full sm:w-auto"
          >
            <FilePlus
              size={18}
              className="transition-transform group-hover/create:rotate-12"
            />
            Create Announcement
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full flex justify-evenly bg-lamaSkyLight mb-6 p-3">
              {[
                { value: "general", label: "General" },
                { value: "event", label: "Event" },
                ...(isStudent ? [] : [{ value: "private", label: "Private" }])
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:text-ColorThree 
                  data-[state=active]:shadow-sm text-TextTwo hover:text-ColorThree transition-colors sm:text-base md:text-lg"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {["general", "event", "private"].map((tabValue) => (
              <TabsContent
                key={tabValue}
                value={tabValue}
                className="space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar"
              >
                {announcements?.filter((a: any) => a.category === tabValue)
                  .length > 0 ? (
                  announcements
                    .filter((a: any) => a.category === tabValue)
                    .map((announcement: any) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        refetch={refetch}
                      />
                    ))
                ) : (
                  <div className="text-center py-12 text-TextTwo/70">
                    No announcements found in this category.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

const AnnouncementCard = ({
  announcement,
  refetch
}: {
  announcement: any
  refetch: () => void
}) => {
  const router = useRouter()
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
        throw new Error("Failed to delete announcement")
      }

      refetch() // Refetch announcements
    } catch (error) {
      console.log(error)
      console.log(
        "Failed to delete announcement. Please try again. @app/(module)/announcements/page"
      )
    } finally {
      setIsDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div className="group p-3 mx-0.5 sm:p-4 md:p-6 bg-white hover:bg-lamaSkyLight/50 transition-all duration-300 rounded-lg shadow-sm hover:shadow-lg border border-transparent hover:border-ColorThree/20">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-2 sm:mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-TextTwo group-hover:text-ColorThree transition-colors line-clamp-2">
          {announcement.title}
        </h2>
        <div className="flex items-center text-xs sm:text-sm text-TextTwo/70 whitespace-nowrap bg-lamaSkyLight px-3 py-1 rounded-full">
          <Clock size={14} className="mr-1.5 shrink-0" />
          {formatDate(announcement.createdAt)}
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
    </div>
  )
}
