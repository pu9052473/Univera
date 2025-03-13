"use client"

import React, { useContext, useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ZoomIn, ZoomOut } from "lucide-react"
import axios from "axios"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Submit } from "@/components/(commnon)/ButtonV1"
import toast from "react-hot-toast"
import { TimeTableSlot } from "@/types/globals"

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

const fetchSubjects = async (courseId: string) => {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects || []
}

const fetchSubjectfaculties = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=facultyDetails`,
    {
      params: { classId }
    }
  )
  return response?.data || []
}

const fetchTimeTableSlots = async (classId: string) => {
  const response = await axios.get(
    `/api/classes/timeTable?route=timeTableSlots`,
    {
      params: { classId }
    }
  )
  return response?.data || []
}

export default function ClassTimeTablePage() {
  const { classId } = useParams()
  const { user } = useContext(UserContext)
  const [selectedSlot, setSelectedSlot] = useState<TimeTableSlot | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [currentSubject, setCurrentSubject] = useState("Non Academic")
  const [scale, setScale] = useState(1)
  const [scheduleData, setScheduleData] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: subjects } = useQuery({
    queryKey: ["subjects", user?.courseId],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled: !!user?.courseId
  })

  const { data: faculties } = useQuery({
    queryKey: ["faculties", classId],
    queryFn: () => fetchSubjectfaculties(classId as string),
    enabled: !!classId
  })

  const { data: timeTableSlots } = useQuery({
    queryKey: ["timeTableSlots", classId],
    queryFn: () => fetchTimeTableSlots(classId as string),
    enabled: !!classId
  })

  useEffect(() => {
    if (timeTableSlots && timeTableSlots.length > 0) {
      const scheduleData = timeTableSlots.reduce((acc: any, slot: any) => {
        let facultyName = null
        if (slot.facultyId) {
          const facultyData = faculties?.find(
            (f: any) => f.user.id === slot.facultyId
          )
          facultyName = facultyData?.user.name
        }
        const key = `${slot.day}-${slot.startTime}`
        acc[key] = {
          day: slot.day,
          subject: slot.title,
          faculty: facultyName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          tag: slot.tag,
          location: slot.location,
          remarks: slot.remarks,
          subjectId: slot.subjectId,
          facultyId: slot.facultyId
        }
        return acc
      }, {})
      setScheduleData(scheduleData)
      localStorage.setItem(`classId-${classId}`, JSON.stringify(scheduleData))
    }
  }, [timeTableSlots, faculties, classId])

  const timeTableId = timeTableSlots?.find(
    (slot: any) => slot.classId === Number(classId)
  )?.timeTableId

  useEffect(() => {
    const setInitialScale = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const contentWidth = 800 // minimum content width
        const initialScale = Math.min(containerWidth / contentWidth, 1)
        setScale(initialScale)
      }
    }

    setInitialScale()
    window.addEventListener("resize", setInitialScale)
    return () => window.removeEventListener("resize", setInitialScale)
  }, [])

  const handleZoom = (delta: any) => {
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 2))
  }

  const getTimeSlotSpan = (startTime: string, endTime: string) => {
    const startIndex = timeSlots.findIndex((slot) => slot === startTime)
    const endIndex = timeSlots.findIndex((slot) => slot === endTime)
    return endIndex - startIndex
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const endTime = formData.get("endTime")

    const subjectData = subjects.find((s: any) => s.name === currentSubject)
    const subjectId = subjectData ? subjectData.id : null

    // console.log("faculty", selectedFaculty)
    // console.log("faculties", faculties)

    let facultyId = null
    if (selectedFaculty) {
      const facultyData = faculties.find(
        (f: any) => f.user.name === selectedFaculty
      )
      facultyId = facultyData?.id
    }

    if (!selectedSlot) {
      console.log("Selected slot is null. Cannot proceed.")
      return
    }

    const data = {
      day: selectedSlot.day,
      subject: currentSubject,
      faculty: selectedFaculty,
      startTime: selectedTime,
      subjectId,
      facultyId,
      endTime,
      tag: formData.get("tag"),
      location: formData.get("location"),
      remarks: formData.get("remarks")
    }

    const updatedScheduleData = {
      ...scheduleData,
      [`${selectedSlot.day}-${selectedSlot.time}`]: data
    }

    setScheduleData(updatedScheduleData)
    localStorage.setItem(
      `classId-${classId}`,
      JSON.stringify(updatedScheduleData)
    )
    setIsDialogOpen(false)
  }

  const shouldRenderSlot = (day: string, time: string) => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    for (const key in parsedData) {
      const [slotDay, startTime] = key.split("-")
      const data = parsedData[key]
      if (slotDay === day && startTime === time) {
        return {
          render: true,
          data,
          span: getTimeSlotSpan(startTime, data.endTime)
        }
      }
      if (slotDay === day) {
        const startIndex = timeSlots.findIndex((t) => t === startTime)
        const currentIndex = timeSlots.findIndex((t) => t === time)
        const endIndex = timeSlots.findIndex((t) => t === data.endTime)
        if (currentIndex > startIndex && currentIndex < endIndex) {
          return { render: false }
        }
      }
    }
    return { render: true, span: 1 }
  }

  useEffect(() => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}
    setScheduleData(parsedData)
  }, [classId])

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  const timeSlots = Array.from(
    { length: 12 },
    (_, i) => `${8 + i}:00 ${i + 8 < 12 ? "AM" : "PM"}`
  )
  const tags = ["Lecture", "Lab", "Seminar"]

  const handleSubjectSelectChange = (value: any) => {
    setCurrentSubject(value)
    setSelectedFaculty(null)
  }

  const handleFacultySelectChange = (value: any) => {
    setSelectedFaculty(value)
  }

  const matchedFaculty = faculties?.filter((faculty: any) =>
    faculty.subject.some((subject: any) => subject.name === currentSubject)
  )

  const handleSlotClick = (day: any, time: any) => {
    const storedData = localStorage.getItem(`classId-${classId}`)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    const slotKey = `${day}-${time}`
    const slotData = parsedData[slotKey]

    if (!slotData) {
      // in this only day and time is update
      setSelectedSlot((prev) => ({
        ...prev!,
        day,
        time
      }))
    } else {
      setSelectedSlot({ day, time, ...slotData })
      setCurrentSubject(slotData.subject)
      setSelectedFaculty(slotData.faculty)
    }
    setSelectedTime(time)
    setIsDialogOpen(true)
  }

  const saveTimetableSlotsToDb = async () => {
    // console.log("timeTableData", {
    //   courseId: user?.courseId,
    //   classId,
    //   departmentId: user?.departmentId
    // })
    // console.log("slotsData", Object.values(scheduleData))
    try {
      const response = await fetch(`/api/classes/timeTable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeTableData: {
            courseId: user?.courseId,
            classId: Number(classId),
            departmentId: user?.departmentId
          },
          slotsData: Object.values(scheduleData),
          timeTableId: timeTableId || null, // Set to null for creating a new timetable
          timeTableSlots: timeTableSlots || [] // Pass the existing slots if updating
        })
      })

      if (response.ok) {
        toast.success("Timetable and slots created successfully!")
        // localStorage.removeItem(`classId-${classId}`)
        setCurrentSubject("Non Academic")
        setSelectedSlot(null)
        setSelectedFaculty(null)
        setSelectedTime(null)
      } else {
        toast.error("Failed to create timetable and slots. Please try again.")
      }
    } catch (error) {
      console.error("Error updating timetable:", error)
    } finally {
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold" style={{ color: colors.dark }}>
          Class Timetable
        </h2>
        <Submit onClick={saveTimetableSlotsToDb} />
        <div className="flex gap-2">
          <Button
            onClick={() => handleZoom(-0.1)}
            className="p-2 bg-Primary hover:bg-Primary/90"
            variant="outline"
          >
            <ZoomOut size={20} />
          </Button>
          <Button
            onClick={() => handleZoom(0.1)}
            className="p-2 bg-Primary hover:bg-Primary/90"
            variant="outline"
          >
            <ZoomIn size={20} />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-auto rounded-lg shadow-md bg-white"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div
          ref={contentRef}
          className="min-w-[800px] relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            transition: "transform 0.3s ease"
          }}
        >
          <div className="grid grid-cols-7 bg-lamaSkyLight">
            <div className="sticky top-0 z-10 border p-2 text-center font-bold bg-Primary text-black">
              Time
            </div>
            {days.map((day, index) => (
              <div
                key={index}
                className="sticky top-0 z-10 border p-2 text-center font-bold bg-Primary text-black"
              >
                {day}
              </div>
            ))}

            {timeSlots.map((time, i) => (
              <React.Fragment key={`time-slot-${i}`}>
                <div
                  key={`time-${i}`}
                  className="border p-2 text-center font-semibold bg-lamaSky text-TextTwo"
                >
                  {time}
                </div>

                {days.map((day, j) => {
                  const slotStatus = shouldRenderSlot(day, time)
                  if (!slotStatus.render) return null

                  return (
                    <div
                      key={`slot-${i}-${j}`}
                      className={`border p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        slotStatus.data ? "bg-lamaPurpleLight" : "white"
                      }
                          `}
                      style={{
                        minHeight: "80px",
                        gridRow: `span ${slotStatus.span || 1}`
                      }}
                      onClick={() => handleSlotClick(day, time)}
                    >
                      {slotStatus.data && (
                        <div className="flex flex-col gap-1 text-sm">
                          <p className="font-bold text-black">
                            {slotStatus.data.subject}
                          </p>
                          <p className="text-TextTwo">
                            {slotStatus.data.faculty}
                          </p>
                          <p className="text-ColorTwo">
                            {slotStatus.data.location}
                          </p>
                          <p className="text-TextTwo">
                            {slotStatus.data.startTime} -{" "}
                            {slotStatus.data.endTime}
                          </p>
                          <p className="text-ColorTwo">{slotStatus.data.tag}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Separate Dialog component outside the scaled container */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 rounded-xl border-2 shadow-lg bg-lamaSkyLight border-Primary overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-center text-Dark">
              Schedule Time Slot
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Subject and Faculty Selection Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-TextTwo">
                  Subject
                </Label>
                <Select
                  onValueChange={handleSubjectSelectChange}
                  defaultValue={selectedSlot?.subject || "Non Academic"}
                >
                  <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                    <SelectValue placeholder="Select subject">
                      <span className="text-sm text-Dark">
                        {currentSubject || "Select a class"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                    {subjects?.map((subject: any) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.name}
                        className="cursor-pointer transition-colors hover:bg-opacity-80"
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Break" className="cursor-pointer">
                      Break
                    </SelectItem>
                    <SelectItem value="Non Academic" className="cursor-pointer">
                      Non Academic
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-TextTwo">
                  Faculty
                </Label>
                <Select
                  onValueChange={handleFacultySelectChange}
                  defaultValue={selectedSlot?.faculty || ""}
                  disabled={!matchedFaculty || matchedFaculty.length === 0}
                >
                  <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                    <SelectValue placeholder="Select faculty">
                      <span className="text-sm text-Dark">
                        {selectedFaculty
                          ? selectedFaculty
                          : matchedFaculty?.length > 0
                            ? "Select Faculty"
                            : "No faculty available"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                    {matchedFaculty?.map((faculty: any) => (
                      <SelectItem
                        key={faculty.user.id}
                        value={faculty.user.name}
                        className="cursor-pointer transition-colors hover:bg-opacity-80"
                      >
                        {faculty.user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Time Selection Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-TextTwo">
                  Start Time
                </Label>
                <Input
                  value={selectedTime || ""}
                  readOnly
                  name="startTime"
                  className="w-full h-10 transition-all duration-200 bg-lamaPurpleLight border-Primary border-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-TextTwo">
                  End Time
                </Label>
                <Select
                  name="endTime"
                  defaultValue={selectedSlot?.endTime || ""}
                >
                  <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                    {timeSlots
                      .slice(
                        timeSlots.findIndex(
                          (slot) => slot === selectedSlot?.startTime
                        ) + 1
                      )
                      .map((slot) => (
                        <SelectItem
                          key={slot}
                          value={slot}
                          className="cursor-pointer transition-colors hover:bg-opacity-80"
                        >
                          {slot}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tag Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">Tag</Label>
              <Select name="tag" defaultValue={selectedSlot?.tag || ""}>
                <SelectTrigger className="w-full h-10 transition-all duration-200 hover:border-opacity-100 bg-white border-Primary border-2">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent className="w-full max-h-[40vh] bg-lamaSkyLight">
                  {tags.map((tag) => (
                    <SelectItem
                      key={tag}
                      value={tag}
                      className="cursor-pointer transition-colors hover:bg-opacity-80"
                    >
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                Location
              </Label>
              <Input
                placeholder="Enter location"
                name="location"
                defaultValue={selectedSlot?.location || ""}
                className="w-full h-10 transition-all duration-200 bg-white border-Primary border-2"
              />
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-TextTwo">
                Remarks
              </Label>
              <Textarea
                placeholder="Additional notes..."
                name="remarks"
                defaultValue={selectedSlot?.remarks || ""}
                className="w-full min-h-[80px] sm:min-h-[100px] transition-all duration-200 bg-white border-Primary border-2 text-Dark resize-y"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2 sm:py-3 mt-2 sm:mt-4 font-semibold text-sm sm:text-base transition-all duration-200 bg-Primary text-Dark hover:opacity-90 rounded-lg"
            >
              Save Schedule
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
