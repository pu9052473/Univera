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
  MdPerson
} from "react-icons/md"

export const Menuitems = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: MdSpaceDashboard },
    { title: "Departments", url: "/admin/departments", icon: FaBuilding },
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

export interface LinkItem {
  title: string
  url: string
  icon: IconType
}

export interface MenuItems {
  [role: string]: LinkItem[]
}
