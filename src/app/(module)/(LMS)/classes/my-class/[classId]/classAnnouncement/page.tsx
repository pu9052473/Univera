"use client"

import { useParams, useSearchParams } from "next/navigation"
import CommonAnnouncementsPage from "@/components/(commnon)/CommonAnnouncements"

export default function ClassAnnouncementsPage() {
  const { classId } = useParams()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <div>
      <CommonAnnouncementsPage
        classId={Array.isArray(classId) ? classId[0] : classId}
        tab={tab}
      />
    </div>
  )
}
