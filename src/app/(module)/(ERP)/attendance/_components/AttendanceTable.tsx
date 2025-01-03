import { Badge } from "@/components/ui/badge"
import { Check, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Student {
  id: string
  rollNo: number
  user: {
    name: string
  }
}

interface AttendanceTableProps {
  students: Student[]
  attendance: Record<string, boolean>
  onToggleAttendance: (studentId: string) => void
  searchQuery: string
  onClearSearch: () => void
}

export const AttendanceTable = ({
  students,
  attendance,
  onToggleAttendance,
  searchQuery,
  onClearSearch
}: AttendanceTableProps) => {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {students.length > 0 ? (
              students.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => onToggleAttendance(student.id)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${
                      attendance[student.id]
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-gray-50"
                    }
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <Badge
                      className={`
                        inline-flex items-center gap-1 px-3 py-1
                        ${
                          attendance[student.id]
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                        transition-all duration-200
                      `}
                    >
                      {attendance[student.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Present
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Absent
                        </>
                      )}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {searchQuery
                        ? "No students found matching your search"
                        : "No students available"}
                    </p>
                    {searchQuery && (
                      <Button
                        variant="link"
                        onClick={onClearSearch}
                        className="text-ColorThree"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
