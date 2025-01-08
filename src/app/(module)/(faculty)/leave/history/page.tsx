"use client"
import { Leave } from "@prisma/client"
import { getUserLeaveDays } from "@/lib/data/getLeaveDays"
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import Container from "../../_components/Container"
import TableWrapper from "../../_components/(UserComponents)/TableWrapper"
import HistoryTable from "./HistoryTable"
import Link from "next/link"
import Left from "@/components/Icons/Left"

export default function UserHistory() {
  const { user } = useContext(UserContext)

  const {
    data: userLeave,
    isError,
    isLoading
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: () => getUserLeaveDays(user),
    enabled: !!user
  })

  if (userLeave === null) {
    return <Container>No Leaves found...</Container>
  }

  if (userLeave === null) {
    return <Container>Loading...</Container>
  }
  return (
    <Container>
      <div className="mb-6 ml-4">
        <Link
          className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 hover:shadow transition duration-200 w-fit"
          href={"/leave"}
        >
          <Left />
          Back
        </Link>
      </div>
      <TableWrapper title="My Leave History">
        <HistoryTable
          isLoading={isLoading}
          isError={isError}
          history={userLeave as Leave[]}
        />
      </TableWrapper>
    </Container>
  )
}
