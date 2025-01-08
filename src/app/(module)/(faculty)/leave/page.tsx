"use client"
import React, { useContext } from "react"
import UserTab from "../_components/UserTabs"
import { UserContext } from "@/context/user"
import { Button } from "@/components/ui/button"
import { MonthDateRangePicker } from "../_components/MonthDateRangePicker"
import StatsCards from "../_components/StatsCards"

export default function LeavePage() {
  const { user } = useContext(UserContext)
  const roles = user?.roles.map((role: any) => role.id) || null
  return (
    <div>
      {roles && user && <UserTab roles={roles} />}
      <div className="flex flex-col md:flex-row py-6 items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <MonthDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>
      <StatsCards />
      {/* Graph */}
    </div>
  )
}
