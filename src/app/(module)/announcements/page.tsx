"use client"

import { useSearchParams } from "next/navigation"
import CommonAnnouncementsPage from "@/components/(commnon)/CommonAnnouncements"

export default function AnnouncementsPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <div>
      <CommonAnnouncementsPage classId={null} tab={tab} />
    </div>
  )
}
