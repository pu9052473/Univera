"use client"

import React, { useContext, useState } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import {
  Loader2,
  Users,
  BookOpen,
  ChevronRight,
  Search,
  Calendar,
  AlertCircle,
  X
} from "lucide-react"
import { toast } from "react-hot-toast"
import axios from "axios"

async function fetchClasses(courseId: number) {
  const { data } = await axios.get(`/api/classes`, {
    params: { courseId }
  })
  return data?.classes || []
}

async function fetchStudents(selectedClassId: number) {
  try {
    const response = await fetch(
      `/api/classes/${selectedClassId}?onlyStudents=${true}`
    )
    if (!response.ok) {
      toast.error("Failed to fetch students")
    }
    const data = await response.json()
    // Return empty array if no students found instead of undefined
    return data?.Class?.students || []
  } catch (error) {
    console.log("Error fetching students:", error)
    // Return empty array on error instead of undefined
    return []
  }
}

const AttendanceDashboard = () => {
  const { user } = useContext(UserContext)
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [hoveredClass, setHoveredClass] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const courseId = user?.course?.id
  const roles = user?.roles?.map((role: any) => role.id) || []
  const canUsePage =
    roles.includes(4) || roles.includes(5) || roles.includes(11)

  console.log("user", user)

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["classes", courseId, user?.id],
    queryFn: () => fetchClasses(courseId),
    enabled: !!courseId && !!user?.id
  })

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", selectedClassId, user?.id],
    queryFn: () =>
      selectedClassId
        ? fetchStudents(Number(selectedClassId))
        : Promise.resolve([]),
    enabled: !!selectedClassId && !!user?.id
  })

  const filteredStudents = students?.filter(
    (student: {
      user: { name: string }
      rollNo: { toString: () => string | string[] }
    }) =>
      student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm)
  )

  const calculateAttendancePercentage = (attended: number, total: number) =>
    ((attended / total) * 100).toFixed(1)

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return "#5B58EB"
    if (percentage >= 75) return "#56E1E9"
    if (percentage >= 60) return "#BB63FF"
    return "#FAE27C"
  }

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return "Excellent"
    if (percentage >= 75) return "Good"
    if (percentage >= 60) return "Average"
    return "Poor"
  }

  const stats = students?.reduce((acc: { [x: string]: any }) => {
    const attendance = calculateAttendancePercentage(62, 100)
    const status = getAttendanceStatus(Number(attendance))
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  if (!canUsePage) {
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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur rounded-2xl py-4 px-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-TextTwo">
                Attendance Dashboard
              </h1>
              <p className="text-TextTwo/70">
                Track and manage student attendance
              </p>
            </div>
            <div className="flex items-center gap-2 text-ColorThree">
              <Calendar className="w-5 h-5" />
              <span className="text-base">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid max-[500px]:grid-cols-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {classesLoading ? (
            <div className="col-span-full flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-ColorThree" />
            </div>
          ) : (
            classes?.map((cls: any) => (
              <div
                key={cls.id}
                className="transform transition-all duration-300"
                style={{
                  transform:
                    hoveredClass === cls.id ? "scale(1.03)" : "scale(1)"
                }}
                onMouseEnter={() => setHoveredClass(cls.id)}
                onMouseLeave={() => setHoveredClass(null)}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    selectedClassId === cls.id
                      ? "bg-gradient-to-br from-lamaPurple to-ColorThree/60 border-ColorThree shadow-lg"
                      : "bg-white hover:bg-lamaSkyLight border-transparent hover:border-ColorThree/30"
                  }`}
                  onClick={() => setSelectedClassId(cls.id)}
                >
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-lg bg-lamaSkyLight">
                        <BookOpen className="w-6 h-6 text-ColorThree" />
                      </div>
                      <h3
                        className={`font-bold text-lg ${
                          selectedClassId === cls.id
                            ? "text-white"
                            : "text-Dark"
                        }`}
                      >
                        {cls.name}
                      </h3>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          selectedClassId === cls.id ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {/* Students Section */}
        {selectedClassId && (
          <Card className="bg-white/90 backdrop-blur shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-lamaSkyLight">
                    <Users className="w-6 h-6 text-ColorThree" />
                  </div>
                  <h2 className="text-2xl font-bold text-Dark">
                    Class {selectedClassId} Students
                  </h2>
                </div>

                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 text-center sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(stats).map(([status, count]) => (
                      <div
                        key={status}
                        className="bg-lamaSkyLight rounded-lg p-3"
                      >
                        <div className="text-lg font-bold text-TextTwo">
                          {Number(count)} students
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-TextTwo/50 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-lamaPurple/30 focus:border-ColorThree focus:ring-1 focus:ring-ColorThree outline-none transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {studentsLoading ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-ColorThree" />
                </div>
              ) : filteredStudents?.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-lamaSkyLight">
                        <th className="p-4 text-left text-TextTwo font-semibold">
                          Roll No
                        </th>
                        <th className="p-4 text-left text-TextTwo font-semibold">
                          Name
                        </th>
                        <th className="p-4 text-center text-TextTwo font-semibold">
                          Status
                        </th>
                        <th className="p-4 text-center text-TextTwo font-semibold">
                          Attendance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student: any, idx: number) => {
                        const attendance = calculateAttendancePercentage(
                          89,
                          100
                        )
                        const status = getAttendanceStatus(Number(attendance))
                        return (
                          <tr
                            key={student.id}
                            className={`border-b transition-colors ${
                              idx % 2 === 0 ? "bg-white" : "bg-lamaSkyLight/30"
                            } hover:bg-lamaPurpleLight/50`}
                          >
                            <td className="p-4">{student.rollNo}</td>
                            <td className="p-4">
                              <div className="font-medium text-Dark">
                                {student.user.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center items-center gap-3">
                                <div className="sm:w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${attendance}%`,
                                      backgroundColor: getAttendanceColor(
                                        Number(attendance)
                                      )
                                    }}
                                  />
                                </div>
                                <span
                                  className="font-medium"
                                  style={{
                                    color: getAttendanceColor(
                                      Number(attendance)
                                    )
                                  }}
                                >
                                  {attendance}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    status === "Excellent"
                                      ? "bg-ColorThree/20 text-ColorThree"
                                      : status === "Good"
                                        ? "bg-ColorOne/20 text-ColorOne"
                                        : status === "Average"
                                          ? "bg-ColorTwo/20 text-ColorTwo"
                                          : "bg-lamaYellow/20 text-TextTwo"
                                  }`}
                                >
                                  {status}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-lamaSkyLight/50 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-TextTwo/40 mx-auto mb-4" />
                  <p className="text-TextTwo/70">
                    No students found matching your search.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default AttendanceDashboard
