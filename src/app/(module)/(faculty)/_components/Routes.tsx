import { HiOutlineUserGroup, HiMiniComputerDesktop } from "react-icons/hi2"
import { TbListCheck } from "react-icons/tb"
import { MdOutlineBalance } from "react-icons/md"

export const AdminRoutes = [
  { title: "Portal", url: "/leave/portal", icon: HiMiniComputerDesktop },
  { title: "Leaves", url: "/leave/leaves", icon: TbListCheck },
  { title: "Users", url: "/leave/users", icon: HiOutlineUserGroup }
]

export const UserRoutes = [
  { title: "Portal", url: "/leave/portal", icon: HiMiniComputerDesktop },
  { title: "History", url: "/leave/history", icon: TbListCheck }
]

export const ModeratorRoutes = [
  { title: "Portal", url: "/leave/portal", icon: HiMiniComputerDesktop },
  { title: "Balances", url: "/leave/balances", icon: MdOutlineBalance },
  { title: "Leaves", url: "/leave/leaves", icon: TbListCheck },
  { title: "Users", url: "/leave/users", icon: HiOutlineUserGroup }
]
