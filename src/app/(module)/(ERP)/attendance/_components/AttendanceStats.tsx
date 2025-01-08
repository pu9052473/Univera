import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AttendanceStatsProps {
  totalStudents: number
  presentCount: number
  absentCount: number
  attendancePercentage: number
}

export const AttendanceStats = ({
  totalStudents,
  presentCount,
  absentCount,
  attendancePercentage
}: AttendanceStatsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/50 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <Badge variant="secondary" className="text-lg">
                {totalStudents}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-green-600">Present</p>
              <Badge className="text-lg bg-green-100 text-green-700">
                {presentCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-600">Absent</p>
              <Badge
                variant="destructive"
                className="text-lg bg-red-100 text-red-700"
              >
                {absentCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            Attendance Progress
          </p>
          <span className="text-sm font-medium text-ColorThree">
            {attendancePercentage.toFixed(1)}%
          </span>
        </div>
        <Progress value={attendancePercentage} className="h-2" />
      </div>
    </>
  )
}
