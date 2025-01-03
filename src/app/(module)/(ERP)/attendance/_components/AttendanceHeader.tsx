import { Calendar, Users } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { UserCheck, X } from "lucide-react"

interface AttendanceHeaderProps {
  studentsCount: number
  onMarkAllPresent: () => void
  onMarkAllAbsent: () => void
}

export const AttendanceHeader = ({
  studentsCount,
  onMarkAllPresent,
  onMarkAllAbsent
}: AttendanceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-ColorThree">
          <Calendar className="w-5 h-5" />
          <p className="text-sm font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-ColorThree" />
          Attendance Manager
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <ButtonV1
          onClick={onMarkAllPresent}
          varient="primary"
          label="Mark All Present"
          icon={UserCheck}
          disabled={!studentsCount}
        />
        <ButtonV1
          onClick={onMarkAllAbsent}
          varient="outline"
          icon={X}
          label="Mark All Absent"
          disabled={!studentsCount}
        />
      </div>
    </div>
  )
}
