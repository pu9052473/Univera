import { FaUserMd, FaUsers } from "react-icons/fa"
import { MdSpaceDashboard, MdSchool, MdGroups2 } from "react-icons/md"

export const Menuitems = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: MdSpaceDashboard },
    { title: "Departments", url: "/admin/departments", icon: MdSchool },
    {
      title: "Non-Teaching Staff",
      url: "/non-teaching-staff",
      icon: MdGroups2
    },
    {
      title: "Teachers",
      url: "/teachers",
      icon: FaUsers
    }
  ],
  university_admin_staff: [
    { title: "Doctors", url: "/admin/doctors", icon: FaUserMd },
    { title: "Patients", url: "/admin/patients", icon: FaUsers }
  ],
  faculty: [
    { title: "Dashboard", url: "/teacher", icon: FaUserMd },
    { title: "Students", url: "/students", icon: FaUserMd },
    { title: "Curicullam", url: "/curicullam", icon: FaUserMd },
    { title: "Subjects", url: "/subjects", icon: FaUserMd },
    { title: "Events", url: "/events", icon: FaUserMd },
    { title: "Announcement", url: "/announcements", icon: FaUserMd }
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
