"use client"
import React, { useContext } from "react"
import DepartmentDetail from "../_components/DepartmentDetail"
import { UserContext } from "@/context/user"

export default function Dashboard() {
  const { user } = useContext(UserContext)
  console.log(user)

  return (
    <div>
      <DepartmentDetail department={user?.department} />
    </div>
  )
}
