import React from "react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Save, Loader2 } from "lucide-react"

interface AttendanceActionsProps {
  loading: boolean
  studentsCount: number
  hasAttendance: boolean
  onClear: () => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const AttendanceActions = ({
  loading,
  studentsCount,
  hasAttendance,
  onClear,
  onSubmit
}: AttendanceActionsProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row justify-end gap-3"
    >
      <ButtonV1
        type="button"
        varient="outline"
        onClick={onClear}
        disabled={loading || !hasAttendance}
        icon={RefreshCcw}
        label="Clear All"
      />
      <Button
        type="submit"
        disabled={loading || !studentsCount}
        className="w-full sm:w-auto text-white bg-Dark hover:bg-[#1A3E99]"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Submit Attendance
          </>
        )}
      </Button>
    </form>
  )
}
