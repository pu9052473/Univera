"use client"

import Pagination from "../_components/Pagination"
import { role } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import TableSearch from "../_components/TableSearch"
import Table from "../_components/Table"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "@/context/user"

type Teacher = {
  id: number
  name: string
  email?: string
  subjects: string[]
  course: string[]
}

const columns = [
  {
    header: "Info",
    accessor: "info"
  }
]

const fetchDepartment = async (dId: number) => {
  const department = await axios.get("/api/list/teacher", {
    params: {
      departmentId: dId
    }
  })
  return department.data.faculties
}

const TeacherListPage = () => {
  const { user } = useContext(UserContext)

  const { data, isLoading } = useQuery({
    queryKey: ["department"],
    queryFn: () => fetchDepartment(user?.departmentAdmin.id),
    enabled: !!user?.departmentAdmin.id
  })

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/authorities/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Authorities
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>
      {role === "admin" && (
        <Link href={`/list/authorities/create`}>
          <div className="flex justify-end mt-2">
            <button className="flex items-center justify-center rounded-lg bg-Primary p-2">
              Add Authorities
            </button>
            {/* <FormModal table="teacher" type="create"/> */}
          </div>
        </Link>
      )}
      {/* LIST */}
      {!isLoading && (
        <Table columns={columns} renderRow={renderRow} data={data} />
      )}
      {/* PAGINATION */}
      <Pagination />
    </div>
  )
}

export default TeacherListPage
