import {
  FaUsers,
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaBullhorn,
  FaBook,
  FaBuilding,
  FaUserTie
} from "react-icons/fa"
import {
  MdSpaceDashboard,
  MdGroups,
  MdClass,
  MdOutlineHealthAndSafety,
  MdPerson,
  MdPeople,
  MdEditDocument,
  MdForum
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
    { title: "Courses", url: "/courses", icon: MdEditDocument },
    { title: "Subjects", url: "/subject", icon: MdClass },
    { title: "Authorities", url: "/list/authorities", icon: FaUserTie },
    { title: "Faculty", url: "/list/teachers", icon: MdPeople },
    { title: "Students", url: "/list/students", icon: MdPeople }
  ],
  authority: [
    { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
    { title: "Students", url: "/list/students", icon: FaUsers },
    { title: "Classes", url: "/classes", icon: FaBook },
    { title: "Courses", url: "/courses", icon: MdEditDocument },
    { title: "Subjects", url: "/subject", icon: MdClass },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum }
  ],
  faculty: [
    { title: "Dashboard", url: "/dashboard", icon: MdSpaceDashboard },
    { title: "Students", url: "/list/students", icon: FaUsers },
    { title: "Classes", url: "/classes", icon: FaBook },
    { title: "Subjects", url: "/subject", icon: MdClass },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum }
  ],
  student: [
    { title: "Dashboard", url: "/student", icon: MdSpaceDashboard },
    { title: "Curriculum", url: "/curriculum", icon: FaBook },
    { title: "Subjects", url: "/subjects", icon: MdClass },
    { title: "Events", url: "/events", icon: FaRegCalendarAlt },
    { title: "Announcement", url: "/announcements", icon: FaBullhorn },
    { title: "Forums", url: "/forum", icon: MdForum }
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
