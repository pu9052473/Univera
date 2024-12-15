"use client"
import React, { useContext } from "react"
// import DepartmentDetail from "../_components/DepartmentDetail"
import { UserContext } from "@/context/user"
import UserCard from "../_components/UserCard"
import CountChart from "../_components/CountCharts"
import AttendanceChart from "../_components/AttendanceChart"
import Announcements from "../_components/Announcements"
import EventCalendar from "../_components/EventCalender"

export default function Dashboard() {
  const { user } = useContext(UserContext)
  console.log(user)

  return (
    <div>
      {/* <DepartmentDetail department={user?.departmentAdmin} /> */}
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* USER CARDS */}
          <div className="flex gap-4 justify-between flex-wrap">
            <UserCard type="student" />
            <UserCard type="teacher" />
            <UserCard type="parent" />
            <UserCard type="staff" />
          </div>
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          {/* BOTTOM CHART */}
          <div className="w-full h-[500px]">
            <Announcements />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
        </div>
      </div>
    </div>
  )
}
