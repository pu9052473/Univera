"use client"

import { UserContext } from "@/context/user"
import React, { useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { FilePlus, Loader2, RotateCcw, X } from "lucide-react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import AnnouncementCard from "@/app/(module)/announcements/_components/AnnouncementCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function fetchAnnouncements(departmentId: string, universityId: string) {
  const response = await axios.get(
    `/api/announcements?route=findMany&&departmentId=${departmentId}&&universityId=${universityId}`
  )
  return response?.data || []
}

export default function ClassAnnouncementsPage() {
  const router = useRouter()
  const { classId } = useParams()
  const { user } = useContext(UserContext)
  const roles = user?.roles?.map((role: any) => role.id) || []
  const canCreateAnnouncement = roles.includes(4)

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
    return (
      <div className="flex items-center justify-center h-full w-full">
        <>
          <Loader2 size={16} className="animate-spin" />
        </>
      </div>
    )
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

  if (!canCreateAnnouncement && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <X className="w-12 h-12 text-red-500" />
        <p className="text-lg font-medium text-gray-900">
          You do not have access to this page.
        </p>
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
          {canCreateAnnouncement && (
            <button
              onClick={() =>
                router.push(`/announcements/form?classId=${classId}`)
              }
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-ColorThree border border-ColorThree 
          hover:bg-ColorThree hover:text-white transition-all duration-200 gap-2 group/create w-full sm:w-auto"
            >
              <FilePlus
                size={18}
                className="transition-transform group-hover/create:rotate-12"
              />
              Create Announcement for class
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full flex justify-evenly bg-lamaSkyLight mb-6 p-3">
              {[
                { value: "general", label: "General" },
                { value: "event", label: "Event" },
                { value: "private", label: "Private" }
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
                {announcements?.filter(
                  (a: any) => a.category === tabValue && a.classId !== null
                ).length > 0 ? (
                  announcements
                    .filter(
                      (a: any) => a.category === tabValue && a.classId !== null
                    )
                    .map((announcement: any) => (
                      <AnnouncementCard
                        key={announcement.id}
                        announcement={announcement}
                        facultyClassId={
                          Array.isArray(classId) ? classId[0] : classId
                        }
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
