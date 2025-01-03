import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Check, X } from "lucide-react"

interface AttendanceControlsProps {
  studentsCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
  rollNumbersInput: string
  onRollNumbersChange: (value: string) => void
  onBatchAttendance: (status: boolean) => void
}

export const AttendanceControls = ({
  studentsCount,
  searchQuery,
  onSearchChange,
  rollNumbersInput,
  onRollNumbersChange,
  onBatchAttendance
}: AttendanceControlsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Search Students
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by roll number or name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Batch Attendance
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter roll numbers (comma or space-separated)"
            value={rollNumbersInput}
            onChange={(e) => onRollNumbersChange(e.target.value)}
            disabled={!studentsCount}
            className="bg-white"
          />
          <ButtonV1
            onClick={() => onBatchAttendance(true)}
            varient="primary"
            icon={Check}
            disabled={!studentsCount}
          />
          <ButtonV1
            onClick={() => onBatchAttendance(false)}
            varient="outline"
            icon={X}
            disabled={!studentsCount}
          />
        </div>
      </div>
    </div>
  )
}
