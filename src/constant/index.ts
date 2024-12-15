import {
  FaUsers,
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaBullhorn,
  FaBook,
  FaBuilding
} from "react-icons/fa"
import {
  MdSpaceDashboard,
  MdGroups,
  MdClass,
  MdOutlineHealthAndSafety,
  MdPerson,
  MdPeople
} from "react-icons/md"

export const Menuitems = {
  university_admin: [
    { title: "Dashboard", url: "/admin", icon: MdSpaceDashboard },
    { title: "Departments", url: "/departments", icon: FaBuilding },
    {
      title: "Non-Teaching Staff",
      url: "/non-teaching-staff",
      icon: MdGroups
    },
    {
      title: "Teachers",
      url: "/teachers",
      icon: FaChalkboardTeacher
    }
  ],
  university_admin_staff: [
    { title: "Doctors", url: "/admin/doctors", icon: MdOutlineHealthAndSafety },
    { title: "Patients", url: "/admin/patients", icon: MdPerson }
  ],
  department_admin: [
    { title: "Dashborad", url: "/department_admin", icon: MdSpaceDashboard },
    { title: "Course", url: "/courses", icon: BookCheckIcon },
    { title: "Subjects", url: "/subject", icon: MdClass },
    { title: "faculty", url: "/faculty", icon: MdPeople }
  ],
  faculty: [
    { title: "Dashboard", url: "/teacher", icon: MdSpaceDashboard },
    { title: "Students", url: "/students", icon: FaUsers },
    { title: "Curriculum", url: "/curriculum", icon: FaBook },
    { title: "Subjects", url: "/subjects", icon: MdClass },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn }
  ]
}

import { IconType } from "react-icons"
import { BookCheckIcon } from "lucide-react"

export interface LinkItem {
  title: string
  url: string
  icon: IconType
}

export interface MenuItems {
  [role: string]: LinkItem[]
}
