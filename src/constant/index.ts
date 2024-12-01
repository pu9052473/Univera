import { FaUserMd, FaUsers } from "react-icons/fa"
import {
  MdSpaceDashboard,
  MdSchool,
  MdPeopleAlt,
  MdGroups2
} from "react-icons/md"

export const Menuitems = {
  admin: [
    { title: "Dashboard", url: "/erp/admin/dashboard", icon: MdSpaceDashboard },
    { title: "Departments", url: "/erp/admin/departments", icon: MdSchool },
    {
      title: "University Admin Team",
      url: "/erp/admin/university-admin-team",
      icon: MdPeopleAlt
    },
    {
      title: "Non-Teaching Staff",
      url: "/erp/admin/non-teaching-staff",
      icon: MdGroups2
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
