"use client"

import React, { useContext, useMemo, useState, FormEvent } from "react"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Menu,
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  AlertCircle,
  MessageSquare,
  AlertTriangle
} from "lucide-react"
import {
  getBackgroundColor,
  getBorderColor,
  getIconForTag,
  getTagClass
} from "@/helpers/TimeTableTagColor"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { ProxySlot } from "@/types/globals"

const myTimeTableSlots = async (userId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=myTimeTableSlots`,
    {
      params: { userId }
    }
  )
  return response?.data || []
}

const courseFaculties = async (courseId: number) => {
  const response = await axios.get(`/api/courses/${courseId}`)
  return response?.data.course.faculties || []
}

const proxySlotsFetcher = async (userId: string) => {
  const response = await axios.get(`/api/proxySlot?userId=${userId}`)
  return response?.data || []
}

const weekDayNames = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
]

function getRollingDays(startOffset = -1, count = 3) {
  const today = new Date()
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + startOffset + i)
    const dayIndex = startOffset + i
    return {
      date: d,
      name: weekDayNames[d.getDay()],
      label: d.toLocaleDateString(undefined, { weekday: "long" }),
      isToday: dayIndex === 0,
      offset: startOffset + i
    }
  })
}

const getStatusColor = (status: any) => {
  switch (status) {
    case "pending":
      return "bg-gradient-to-r from-amber-100 via-yellow-50 to-orange-100 text-amber-800 border border-amber-200 shadow-amber-100"
    case "approved":
      return "bg-gradient-to-r from-emerald-100 via-green-50 to-teal-100 text-emerald-800 border border-emerald-200 shadow-emerald-100"
    case "declined":
      return "bg-gradient-to-r from-rose-100 via-red-50 to-pink-100 text-rose-800 border border-rose-200 shadow-rose-100"
    default:
      return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200"
  }
}

export default function Page() {
  const { user } = useContext(UserContext)
  const [currentPage, setCurrentPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [editingProxyId, setEditingProxyId] = useState<number | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isDeclineDialogOpen, setIsDeclineDialogOpen] = useState(false)

  const { data: mySlots } = useQuery({
    queryKey: ["mySlots"],
    queryFn: () => myTimeTableSlots(user?.id || ""),
    enabled: !!user?.id
  })

  const { data: faculties } = useQuery({
    queryKey: ["faculties"],
    queryFn: () => courseFaculties(Number(user?.courseId)),
    enabled: !!user?.id
  })

  const { data: proxySlots, refetch: proxySlotsRefetch } = useQuery({
    queryKey: ["proxySlots"],
    queryFn: () => proxySlotsFetcher(user?.id || ""),
    enabled: !!user?.id
  })

  console.log("Proxy Slots:", proxySlots)
  console.log("usre:", user)
  console.log("faculties:", faculties)

  // Split proxySlots into sent and received
  const { askedProxies, receivedProxies } = useMemo(() => {
    const asked: any[] = []
    const received: any[] = []

    proxySlots?.forEach((slot: any) => {
      if (slot.slot.facultyId === user?.id) {
        asked.push(slot)
      } else if (slot.lecturerId === user?.id) {
        received.push(slot)
      }
    })

    return { askedProxies: asked, receivedProxies: received }
  }, [proxySlots, user?.id])

  console.log("askedProxies:", askedProxies)
  console.log("receivedProxies:", receivedProxies)

  const colors = {
    primary: "#87CEEB",
    dark: "#112C71",
    secondary: "#CECDF9",
    textTwo: "#0A2353",
    colorOne: "#56E1E9",
    colorTwo: "#BB63FF",
    colorThree: "#5B58EB",
    lamaSky: "#C3EBFA",
    lamaSkyLight: "#EDF9FD",
    lamaPurple: "#CFCEFF",
    lamaPurpleLight: "#F1F0FF",
    lamaYellow: "#FAE27C",
    lamaYellowLight: "#FEFCE8"
  }

  const rolling = useMemo(
    () => getRollingDays(currentPage - 2, 3),
    [currentPage]
  )

  const mySlotsByDay = useMemo(() => {
    return rolling.reduce(
      (map: { [key: string]: any[] }, { name }) => {
        map[name] = mySlots?.filter(
          (slot: any) =>
            slot.facultyId === user?.id && slot.day.toLowerCase() === name
        )
        return map
      },
      {} as { [key: string]: any[] }
    )
  }, [mySlots, user, rolling])

  const handlePrevious = () => setCurrentPage((prev) => prev - 1)
  const handleNext = () => setCurrentPage((prev) => prev + 1)
  const goToToday = () => setCurrentPage(1)

  const currentDay = rolling[1]
  const currentSlots = mySlotsByDay[currentDay?.name] || []
  const currentDate = currentDay?.date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })

  const sortedSlots = useMemo(() => {
    return [...currentSlots].sort((a, b) => {
      const timeA = new Date(`1970/01/01 ${a.startTime}`)
      const timeB = new Date(`1970/01/01 ${b.startTime}`)
      return timeA.getTime() - timeB.getTime()
    })
  }, [currentSlots])

  function openProxyDialog(slotId: number) {
    const existingProxy = askedProxies?.find((proxy) => proxy.slotId === slotId)

    if (existingProxy) {
      // Edit mode
      setIsEditMode(true)
      setEditingProxyId(existingProxy.id)
      setSelectedSlotId(existingProxy.slotId)
      setSelectedFacultyId(existingProxy.lecturerId)
      setReason(existingProxy.reason || "")
    } else {
      // New proxy request
      setIsEditMode(false)
      setEditingProxyId(null)
      setSelectedSlotId(slotId)
      setSelectedFacultyId("")
      setReason("")
    }
    setDialogOpen(true)
  }

  async function handleProxySubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedSlotId || !selectedFacultyId) return

    try {
      const res = await fetch("/api/proxySlot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotId: selectedSlotId,
          lecturerId: selectedFacultyId,
          date: currentDate,
          reason: reason.trim() || null,
          editingProxyId: editingProxyId || null
        })
      })

      if (res.ok) {
        toast.success(
          editingProxyId
            ? "Proxy request updated!"
            : "Proxy request sent successfully!"
        )
      } else {
        toast.error("Failed to send proxy request")
      }
      setDialogOpen(false)
    } catch (error) {
      console.log("error while send proxy request", error)
    } finally {
      proxySlotsRefetch() // Refetch proxy slots to update the list
    }
  }

  const findFacultyName = (facultyId: string) => {
    return faculties?.find((f: any) => f.id === facultyId)?.user?.name
  }

  const handleProxyResponse = async (
    proxyId: number,
    action: "APPROVED" | "DECLINED"
  ) => {
    try {
      const res = await fetch("/api/proxySlot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updateStatusOnly: true,
          proxyId,
          status: action
        })
      })

      if (res.ok) {
        toast.success(`Request ${action.toLowerCase()} successfully!`)
        proxySlotsRefetch() // Refresh the list
      } else {
        toast.error("Failed to update proxy status")
      }
    } catch (error) {
      console.log("Error updating proxy status:", error)
    } finally {
      if (action === "APPROVED") {
        setIsApproveDialogOpen(false)
      } else {
        setIsDeclineDialogOpen(false)
      }
    }
  }

  const pendingCount: number = (proxySlots as ProxySlot[])?.filter(
    (r: ProxySlot) => r.status === "PENDING"
  ).length

  type ConfirmationDialogContentProps = {
    action: "APPROVED" | "DECLINED"
    onConfirm: () => void
  }

  const ConfirmationDialogContent: React.FC<ConfirmationDialogContentProps> = ({
    action,
    onConfirm
  }) => {
    const isApprove = action === "APPROVED"

    return (
      <>
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: isApprove ? "#FAE27C" : "#CFCEFF" }}
            >
              <AlertTriangle className="h-6 w-6" style={{ color: "#112C71" }} />
            </div>
          </div>
          <DialogTitle
            className="text-xl font-bold text-center"
            style={{ color: "#0A2353" }}
          >
            Confirm {isApprove ? "Approval" : "Decline"}
          </DialogTitle>
          <DialogDescription
            className="text-center text-base leading-relaxed"
            style={{ color: "#0A2353" }}
          >
            Are you sure you want to{" "}
            <span
              className="font-semibold"
              style={{ color: isApprove ? "#5B58EB" : "#BB63FF" }}
            >
              {isApprove ? "accept" : "decline"}
            </span>{" "}
            this request? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={onConfirm}
            className={`flex-1 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isApprove
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
            }`}
          >
            {isApprove ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Yes, Accept
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Yes, Decline
              </>
            )}
          </Button>

          <Button
            onClick={() =>
              isApprove
                ? setIsApproveDialogOpen(false)
                : setIsDeclineDialogOpen(false)
            }
            className="flex-1 font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 border-2"
            style={{
              backgroundColor: "#CECDF9",
              borderColor: "#5B58EB",
              color: "#0A2353"
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </>
    )
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="relative inline-block">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent leading-tight"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.colorThree} 50%, ${colors.colorTwo} 100%)`
              }}
            >
              Your Timetable
            </h1>
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-1 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center mb-8 px-1 xs:px-2 sm:px-4">
          <div
            className="backdrop-blur-lg rounded-2xl shadow-xl p-1 xs:p-1.5 sm:p-2 border w-full max-w-2xl"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderColor: colors.lamaSky
            }}
          >
            <div className="flex items-center justify-between space-x-1 sm:space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                className="p-2 sm:p-3 rounded-xl hover:scale-110 hover:bg-[#EDF9FD] transition-all duration-300 group flex-shrink-0"
                style={{
                  color: colors.dark
                }}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Days Container */}
              <div className="flex space-x-0.5 sm:space-x-1 flex-1 justify-center overflow-hidden">
                {rolling.map((day, index) => (
                  <button
                    key={day.name}
                    onClick={() => setCurrentPage(currentPage - 1 + index)}
                    className={`px-0.5 xs:px-1 sm:px-1.5 md:px-2 lg:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 min-w-0 flex-1 max-w-[65px] xs:max-w-[75px] sm:max-w-[90px] md:max-w-[120px] lg:max-w-[140px] ${
                      index === 1
                        ? "shadow-lg transform scale-105 text-white"
                        : "hover:scale-102 hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor:
                        index === 1 ? colors.colorThree : "transparent",
                      color: index === 1 ? "white" : colors.textTwo
                    }}
                  >
                    <div className="text-center">
                      <div className="font-bold leading-tight text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm">
                        {day.label}
                      </div>
                      <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs opacity-80 mt-0.5">
                        {day.date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric"
                        })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="p-2 sm:p-3 rounded-xl hover:scale-110 hover:bg-[#EDF9FD] transition-all duration-300 group flex-shrink-0"
                style={{
                  color: colors.dark
                }}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Current Day Display */}
        <div
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2"
          style={{ borderColor: colors.lamaSky }}
        >
          {/* Day Header */}
          <div
            className="p-6 text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.colorThree} 50%, ${colors.colorTwo} 100%)`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 animate-pulse">
              <Calendar className="w-full h-full" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20 opacity-10 animate-bounce">
              <Clock className="w-full h-full" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 drop-shadow-lg">
                  {currentDay?.label}
                </h2>
                <p className="text-sm sm:text-base opacity-90 font-medium">
                  {currentDate}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      className="relative group hover:scale-105 xs:hover:scale-110 transition-all duration-500 border-0 px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3"
                      style={{
                        background: `linear-gradient(135deg, ${colors.colorTwo}, ${colors.colorThree})`
                      }}
                    >
                      {/* Animated background effect */}
                      <div className="inset-0 opacity-0 group-hover:opacity-20 transform group-hover:translate-x-full transition-all duration-700"></div>

                      <Menu className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1.5 xs:mr-2 sm:mr-3 group-hover:rotate-180 transition-transform duration-500" />
                      <span className="relative z-10 text-xs xs:text-sm sm:text-base lg:text-lg font-bold whitespace-nowrap">
                        Proxy Management
                      </span>

                      {pendingCount > 0 && (
                        <div className="absolute -top-2 xs:-top-2.5 sm:-top-3 -right-2 xs:-right-2.5 sm:-right-3 flex items-center justify-center">
                          <Badge
                            className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 p-0 flex items-center justify-center text-[8px] xs:text-[9px] sm:text-xs font-bold text-white shadow-lg animate-bounce z-50"
                            style={{ backgroundColor: colors.colorTwo }}
                          >
                            {pendingCount}
                          </Badge>
                          <div
                            className="absolute inset-0 rounded-full animate-pulse-ring"
                            style={{
                              backgroundColor: colors.colorTwo,
                              opacity: 0.4
                            }}
                          ></div>
                        </div>
                      )}
                    </Button>
                  </DrawerTrigger>

                  <DrawerContent className="bg-white">
                    <DrawerHeader className="text-center py-3">
                      <DrawerTitle
                        className="sm:text-xl text-3xl font-black mb-2"
                        style={{ color: colors.dark }}
                      >
                        Proxy Management Hub
                      </DrawerTitle>
                      <DrawerDescription style={{ color: colors.textTwo }}>
                        Efficiently manage all your proxy requests and
                        collaborations
                      </DrawerDescription>
                    </DrawerHeader>

                    <div
                      className="p-3 flex-1 overflow-y-auto max-h-[70vh]"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      <Tabs defaultValue="incoming" className="w-full">
                        <TabsList
                          className="grid w-full grid-cols-2 mb-8 shadow-lg"
                          style={{ backgroundColor: colors.lamaSkyLight }}
                        >
                          <TabsTrigger
                            value="incoming"
                            className="relative group"
                            style={{ color: colors.textTwo }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">
                                Incoming Requests
                              </span>
                              {receivedProxies &&
                                receivedProxies?.length > 0 && (
                                  <Badge
                                    className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold text-white shadow-md animate-pulse"
                                    style={{ backgroundColor: colors.colorTwo }}
                                  >
                                    {
                                      receivedProxies.filter(
                                        (s) => s.status === "PENDING"
                                      ).length
                                    }
                                  </Badge>
                                )}
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="requested"
                            className="font-bold"
                            style={{ color: colors.textTwo }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">My Requests</span>
                              {askedProxies && askedProxies?.length > 0 && (
                                <Badge
                                  className="h-6 w-6 p-0 flex items-center justify-center text-xs font-bold text-white shadow-md animate-pulse"
                                  style={{ backgroundColor: colors.colorTwo }}
                                >
                                  {
                                    askedProxies.filter(
                                      (s) => s.status === "PENDING"
                                    ).length
                                  }
                                </Badge>
                              )}
                            </div>
                          </TabsTrigger>
                        </TabsList>

                        {/* Incoming Proxy Requests */}
                        <TabsContent value="incoming" className="space-y-6">
                          {receivedProxies?.length > 0 ? (
                            receivedProxies?.map(
                              (request: any, index: number) => (
                                <Card
                                  key={request.id}
                                  className="border-l-8 shadow-xl"
                                  style={{
                                    borderLeftColor: colors.colorOne,
                                    animationDelay: `${index * 150}ms`
                                  }}
                                >
                                  <CardHeader className="pb-4">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                      <div className="flex items-start space-x-3">
                                        <div>
                                          <CardTitle
                                            className="text-2xl font-black mb-2"
                                            style={{ color: colors.dark }}
                                          >
                                            {request.subject}
                                          </CardTitle>
                                          <div
                                            className="flex items-center space-x-2 text-sm font-medium"
                                            style={{ color: colors.textTwo }}
                                          >
                                            <User className="h-4 w-4" />
                                            <span>
                                              Requested by{" "}
                                              {findFacultyName(
                                                request.slot.facultyId
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <Badge
                                        className={`self-start lg:self-center shadow-lg ${getStatusColor(request.status)}`}
                                      >
                                        <span className="font-bold">
                                          {request.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            request.status.slice(1)}
                                        </span>
                                      </Badge>
                                    </div>
                                  </CardHeader>

                                  <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                                      <div
                                        className="flex items-center gap-3 p-2 rounded-xl shadow-sm"
                                        style={{
                                          backgroundColor: colors.lamaSkyLight
                                        }}
                                      >
                                        <Calendar
                                          className="h-5 w-5"
                                          style={{ color: colors.colorThree }}
                                        />
                                        <div>
                                          <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                            Date
                                          </span>
                                          <p
                                            className="font-bold text-lg"
                                            style={{ color: colors.textTwo }}
                                          >
                                            {request.date}
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className="flex items-center gap-3 p-2 rounded-xl shadow-sm"
                                        style={{
                                          backgroundColor: colors.lamaSkyLight
                                        }}
                                      >
                                        <Clock
                                          className="h-5 w-5"
                                          style={{ color: colors.colorThree }}
                                        />
                                        <div>
                                          <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                            Time
                                          </span>
                                          <p
                                            className="font-bold text-lg"
                                            style={{ color: colors.textTwo }}
                                          >
                                            {request.slot.startTime} -{" "}
                                            {request.slot.endTime}
                                          </p>
                                        </div>
                                      </div>
                                      <div
                                        className="flex items-center gap-3 p-2 rounded-xl shadow-sm md:col-span-2 xl:col-span-1"
                                        style={{
                                          backgroundColor: colors.lamaSkyLight
                                        }}
                                      >
                                        <MapPin
                                          className="h-5 w-5"
                                          style={{ color: colors.colorThree }}
                                        />
                                        <div>
                                          <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                            Location
                                          </span>
                                          <p
                                            className="font-bold text-sm"
                                            style={{ color: colors.textTwo }}
                                          >
                                            {request.slot.location}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {request.reason && (
                                      <div
                                        className="flex items-start gap-4 p-3 rounded-xl shadow-inner"
                                        style={{
                                          backgroundColor:
                                            colors.lamaYellowLight
                                        }}
                                      >
                                        <MessageSquare
                                          className="h-6 w-6 mt-1 flex-shrink-0"
                                          style={{ color: colors.colorThree }}
                                        />
                                        <div>
                                          <span
                                            className="font-bold text-sm uppercase tracking-wide"
                                            style={{ color: colors.dark }}
                                          >
                                            Reason for Request
                                          </span>
                                          <p
                                            className="text-sm mt-2 leading-relaxed"
                                            style={{ color: colors.textTwo }}
                                          >
                                            {request.reason}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {request.status === "PENDING" && (
                                      <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                        {/* Accept Request Dialog */}
                                        <Dialog
                                          open={isApproveDialogOpen}
                                          onOpenChange={setIsApproveDialogOpen}
                                        >
                                          <DialogTrigger asChild>
                                            <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
                                              <CheckCircle className="h-5 w-5 mr-3" />
                                              Accept Request
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent
                                            className="sm:max-w-md mx-auto bg-white rounded-xl shadow-2xl border-2 p-6"
                                            style={{
                                              borderColor: "#CECDF9",
                                              background:
                                                "linear-gradient(135deg, #EDF9FD 0%, #F1F0FF 100%)"
                                            }}
                                          >
                                            <ConfirmationDialogContent
                                              action="APPROVED"
                                              onConfirm={() =>
                                                handleProxyResponse(
                                                  request.id,
                                                  "APPROVED"
                                                )
                                              }
                                            />
                                          </DialogContent>
                                        </Dialog>

                                        {/* Decline Request Dialog */}
                                        <Dialog
                                          open={isDeclineDialogOpen}
                                          onOpenChange={setIsDeclineDialogOpen}
                                        >
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 border-0 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                            >
                                              <XCircle className="h-5 w-5 mr-3" />
                                              Decline Request
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent
                                            className="sm:max-w-md mx-auto bg-white rounded-xl shadow-2xl border-2 p-6"
                                            style={{
                                              borderColor: "#CECDF9",
                                              background:
                                                "linear-gradient(135deg, #EDF9FD 0%, #F1F0FF 100%)"
                                            }}
                                          >
                                            <ConfirmationDialogContent
                                              action="DECLINED"
                                              onConfirm={() =>
                                                handleProxyResponse(
                                                  request.id,
                                                  "DECLINED"
                                                )
                                              }
                                            />
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )
                            )
                          ) : (
                            <div className="text-center py-16">
                              <div className="relative mb-8">
                                <AlertCircle
                                  className="h-24 w-24 mx-auto animate-float"
                                  style={{ color: colors.primary }}
                                />
                                <div
                                  className="absolute inset-0 h-24 w-24 mx-auto rounded-full animate-pulse-ring"
                                  style={{
                                    backgroundColor: colors.primary,
                                    opacity: 0.2
                                  }}
                                ></div>
                              </div>
                              <h3
                                className="text-3xl font-black mb-4"
                                style={{ color: colors.dark }}
                              >
                                All Clear! 🎉
                              </h3>
                              <p
                                className="text-lg font-medium"
                                style={{ color: colors.textTwo }}
                              >
                                No pending proxy requests at the moment. You're
                                all caught up!
                              </p>
                            </div>
                          )}
                        </TabsContent>

                        {/* My Proxy Requests */}
                        <TabsContent value="requested" className="space-y-6">
                          {askedProxies.length > 0 ? (
                            askedProxies.map((request, index) => (
                              <Card
                                key={request.id}
                                className="border-l-8 shadow-xl"
                                style={{
                                  borderLeftColor: colors.colorTwo,
                                  animationDelay: `${index * 150}ms`
                                }}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <CardTitle
                                      className="text-2xl font-black"
                                      style={{ color: colors.dark }}
                                    >
                                      {request.subject}
                                    </CardTitle>
                                    <Badge
                                      className={`self-start lg:self-center shadow-lg ${getStatusColor(request.status)}`}
                                    >
                                      <span className="font-bold">
                                        {request.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          request.status.slice(1)}
                                      </span>
                                    </Badge>
                                  </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
                                    <div
                                      className="flex items-center gap-3 p-2 rounded-xl shadow-sm"
                                      style={{
                                        backgroundColor: colors.lamaPurpleLight
                                      }}
                                    >
                                      <User
                                        className="h-5 w-5"
                                        style={{ color: colors.colorTwo }}
                                      />
                                      <div>
                                        <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                          Proxy To
                                        </span>
                                        <p
                                          className="font-bold text-lg"
                                          style={{ color: colors.textTwo }}
                                        >
                                          {findFacultyName(request.lecturerId)}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className="flex items-center gap-3 p-2 rounded-xl shadow-sm"
                                      style={{
                                        backgroundColor: colors.lamaPurpleLight
                                      }}
                                    >
                                      <Calendar
                                        className="h-5 w-5"
                                        style={{ color: colors.colorTwo }}
                                      />
                                      <div>
                                        <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                          Date
                                        </span>
                                        <p
                                          className="font-bold text-lg"
                                          style={{ color: colors.textTwo }}
                                        >
                                          {request.date}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className="flex items-center gap-3 p-2 rounded-xl shadow-sm"
                                      style={{
                                        backgroundColor: colors.lamaPurpleLight
                                      }}
                                    >
                                      <Clock
                                        className="h-5 w-5"
                                        style={{ color: colors.colorTwo }}
                                      />
                                      <div>
                                        <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                          Time
                                        </span>
                                        <p
                                          className="font-bold text-lg"
                                          style={{ color: colors.textTwo }}
                                        >
                                          {request.slot.startTime} -{" "}
                                          {request.slot.endTime}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className="flex items-center gap-3 p-2 rounded-xl shadow-sm md:col-span-2 xl:col-span-3"
                                      style={{
                                        backgroundColor: colors.lamaPurpleLight
                                      }}
                                    >
                                      <MapPin
                                        className="h-5 w-5"
                                        style={{ color: colors.colorTwo }}
                                      />
                                      <div>
                                        <span className="font-bold text-xs uppercase tracking-wide text-gray-500">
                                          Location
                                        </span>
                                        <p
                                          className="font-bold text-sm"
                                          style={{ color: colors.textTwo }}
                                        >
                                          {request.slot.location}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {request.reason && (
                                    <div
                                      className="flex items-start gap-4 p-3 rounded-xl shadow-inner"
                                      style={{
                                        backgroundColor: colors.lamaYellowLight
                                      }}
                                    >
                                      <MessageSquare
                                        className="h-6 w-6 mt-1 flex-shrink-0"
                                        style={{ color: colors.colorTwo }}
                                      />
                                      <div>
                                        <span
                                          className="font-bold text-sm uppercase tracking-wide"
                                          style={{ color: colors.dark }}
                                        >
                                          Reason for Request
                                        </span>
                                        <p
                                          className="text-sm mt-2 leading-relaxed"
                                          style={{ color: colors.textTwo }}
                                        >
                                          {request.reason}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <div className="relative mb-4">
                                <BookOpen
                                  className="h-24 w-24 mx-auto animate-float-delayed"
                                  style={{ color: colors.colorTwo }}
                                />
                                <div
                                  className="absolute inset-0 h-24 w-24 mx-auto rounded-full animate-pulse-ring"
                                  style={{
                                    backgroundColor: colors.colorTwo,
                                    opacity: 0.2
                                  }}
                                ></div>
                              </div>
                              <p
                                className="text-lg font-medium"
                                style={{ color: colors.textTwo }}
                              >
                                You haven't sent any proxy requests yet.
                              </p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {currentPage !== 1 && (
                <button
                  onClick={goToToday}
                  className="px-4 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm hover:bg-white text-sm"
                  style={{ color: colors.colorThree }}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Jump to Today</span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Slots Content */}
          <div className="p-4 sm:p-6">
            {sortedSlots.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {/* Stats Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-100/50">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                    </div>
                    <span className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800">
                      {sortedSlots.length}{" "}
                      {sortedSlots.length === 1 ? "Session" : "Sessions"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {["lecture", "lab", "seminar", "break"].map((tag) => {
                      const count = sortedSlots.filter(
                        (slot) => slot.tag === tag
                      ).length
                      if (count === 0) return null
                      return (
                        <span
                          key={tag}
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${getTagClass(tag)} shadow-sm`}
                        >
                          {count} {tag}
                          {count > 1 ? "s" : ""}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="space-y-4 md:space-y-6">
                  {sortedSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="group relative rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] border-l-4 md:border-l-6 overflow-hidden bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm hover:from-white hover:to-white/95 border border-gray-100/50"
                      style={{
                        borderLeftColor: getBorderColor(slot.tag)
                      }}
                    >
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/20 pointer-events-none" />

                      <div className="relative p-4 md:p-6">
                        <div className="flex flex-col space-y-4">
                          {/* Header Section */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-start space-x-3 md:space-x-4 flex-1 min-w-0">
                              {/* Icon */}
                              <div
                                className="flex-shrink-0 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300 ring-1 ring-white/50"
                                style={{
                                  backgroundColor: getBackgroundColor(slot.tag)
                                }}
                              >
                                {getIconForTag(slot.tag)}
                              </div>

                              {/* Title and Class */}
                              <div className="flex-1 min-w-0">
                                <h3
                                  className="font-black text-lg md:text-xl lg:text-2xl text-gray-800 transition-colors duration-300 leading-tight mb-1"
                                  style={{
                                    color: `var(--hover-color-${slot.tag}, #374151)`
                                  }}
                                >
                                  {slot.title}
                                </h3>
                                <span
                                  className="font-bold text-sm md:text-base lg:text-lg text-gray-600 transition-colors duration-300"
                                  style={{
                                    color: `var(--hover-color-light-${slot.tag}, #6b7280)`
                                  }}
                                >
                                  {slot.class.name}
                                </span>
                              </div>
                            </div>

                            {/* Proxy Button - Desktop */}
                            <div className="hidden sm:flex">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openProxyDialog(slot.id)}
                                className="font-semibold px-4 md:px-6 py-2 md:py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md whitespace-nowrap"
                                style={
                                  {
                                    "--hover-border-color": getBorderColor(
                                      slot.tag
                                    ),
                                    "--hover-bg-color":
                                      getBackgroundColor(slot.tag) + "20",
                                    "--hover-text-color": getBorderColor(
                                      slot.tag
                                    )
                                  } as any
                                }
                                onMouseEnter={(e) => {
                                  ;(
                                    e.target as HTMLButtonElement
                                  ).style.borderColor = getBorderColor(slot.tag)
                                  ;(
                                    e.target as HTMLButtonElement
                                  ).style.backgroundColor =
                                    getBackgroundColor(slot.tag) + "20"
                                  ;(e.target as HTMLButtonElement).style.color =
                                    getBorderColor(slot.tag)
                                }}
                                onMouseLeave={(e) => {
                                  ;(
                                    e.target as HTMLButtonElement
                                  ).style.borderColor = ""
                                  ;(
                                    e.target as HTMLButtonElement
                                  ).style.backgroundColor = ""
                                  ;(e.target as HTMLButtonElement).style.color =
                                    ""
                                }}
                              >
                                Request Proxy
                              </Button>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {/* Time */}
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                              <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                                  Time
                                </div>
                                <div className="font-bold text-sm md:text-base text-gray-800 truncate">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-100/50 group-hover:from-red-100 group-hover:to-pink-100 transition-all duration-300">
                              <div className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors duration-300">
                                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-red-600 font-medium uppercase tracking-wide">
                                  Location
                                </div>
                                <div className="font-bold text-sm md:text-base text-gray-800 truncate">
                                  {slot.location}
                                </div>
                              </div>
                            </div>

                            {/* Tag Badge - Single placement */}
                            <div className="flex">
                              <div
                                className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider ${getTagClass(slot.tag)} shadow-md ring-1 ring-white/30 transform group-hover:scale-105 transition-all duration-300`}
                              >
                                <span>{slot.tag}</span>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Proxy Button */}
                          <div className="sm:hidden flex justify-center pt-2 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProxyDialog(slot.id)}
                              className="font-semibold px-6 py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md w-full max-w-xs"
                              style={
                                {
                                  "--hover-border-color": getBorderColor(
                                    slot.tag
                                  ),
                                  "--hover-bg-color":
                                    getBackgroundColor(slot.tag) + "20",
                                  "--hover-text-color": getBorderColor(slot.tag)
                                } as any
                              }
                              onMouseEnter={(e) => {
                                ;(
                                  e.target as HTMLButtonElement
                                ).style.borderColor = getBorderColor(slot.tag)
                                ;(
                                  e.target as HTMLButtonElement
                                ).style.backgroundColor =
                                  getBackgroundColor(slot.tag) + "20"
                                ;(e.target as HTMLButtonElement).style.color =
                                  getBorderColor(slot.tag)
                              }}
                              onMouseLeave={(e) => {
                                ;(
                                  e.target as HTMLButtonElement
                                ).style.borderColor = ""
                                ;(
                                  e.target as HTMLButtonElement
                                ).style.backgroundColor = ""
                                ;(e.target as HTMLButtonElement).style.color =
                                  ""
                              }}
                            >
                              Request Proxy
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Subtle animation indicator */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(to right, transparent, ${getBorderColor(slot.tag)}40, transparent)`
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 lg:py-24">
                <div className="mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                    <Calendar className="w-full h-full text-blue-500" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black mb-3 sm:mb-4 text-gray-800">
                  No Classes Scheduled
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-md mx-auto px-4">
                  You have a free day! Perfect time to relax or catch up on
                  other tasks.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proxy Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg"
          style={{ backgroundColor: "white", borderColor: colors.lamaSky }}
        >
          <DialogHeader
            className="pb-4 border-b"
            style={{ borderColor: colors.lamaSky }}
          >
            <DialogTitle
              className="text-2xl font-black"
              style={{ color: colors.dark }}
            >
              {isEditMode ? "Edit Proxy Request" : "Request Proxy for Slot"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProxySubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="facultySelect"
                className="text-base font-bold"
                style={{ color: colors.textTwo }}
              >
                Choose Faculty
              </Label>
              <Select
                value={selectedFacultyId}
                onValueChange={(val) => setSelectedFacultyId(val)}
              >
                <SelectTrigger
                  id="facultySelect"
                  className="h-12 text-base border-2"
                  style={{ borderColor: colors.lamaSky }}
                >
                  <SelectValue placeholder="Select a lecturer" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {faculties?.filter((fac: any) => fac.clerkId !== user?.id)
                    .length === 0 ? (
                    <SelectItem value="" disabled>
                      No other faculty available
                    </SelectItem>
                  ) : (
                    faculties
                      ?.filter((fac: any) => fac.clerkId !== user?.id)
                      .map((fac: any) => (
                        <SelectItem
                          key={fac.clerkId}
                          value={fac.clerkId}
                          className="hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <User
                              className="h-4 w-4"
                              style={{ color: colors.colorThree }}
                            />
                            <span>{fac.user.name}</span>
                          </div>
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reason"
                className="text-base font-bold"
                style={{ color: colors.textTwo }}
              >
                Reason (optional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Why do you need this proxy? (e.g., medical appointment, conference, etc.)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="text-base border-2 resize-none"
                style={{ borderColor: colors.lamaSky }}
              />
            </div>

            <DialogFooter
              className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
              style={{ borderColor: colors.lamaSky }}
            >
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 h-12 font-bold border-2 hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: colors.lamaSky,
                    color: colors.textTwo
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!selectedFacultyId}
                className="flex-1 h-12 font-bold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.colorThree,
                  borderColor: colors.colorThree
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
