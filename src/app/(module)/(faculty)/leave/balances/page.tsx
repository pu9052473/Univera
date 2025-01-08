"use client"
import BalancesTable from "./BalancesTable"
import { Balances } from "@prisma/client"
import Container from "../../_components/Container"
import { useContext } from "react"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import axios from "axios"

async function getAllBalances(user: any | null) {
  const res = await axios.get("/api/leave/balance", {
    params: {
      departmentId: user.departmentId,
      isModerator: true
    }
  })
  return res.data.balances
}

export default function AdminBalances() {
  const { user } = useContext(UserContext)
  const {
    data: allBalances,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["balance"],
    queryFn: () => getAllBalances(user),
    enabled: !!user
  })

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
      <BalancesTable
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        balances={allBalances as Balances[]}
      />
    </Container>
  )
}
