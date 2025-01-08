"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Balances } from "@prisma/client"
import EditBalances from "./EditBalances"
import { Badge } from "@/components/ui/badge"
import TableWrapper from "../../_components/(UserComponents)/TableWrapper"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FacultyUserTableSkeleton } from "../../_components/Faculty_Skeleton"

type BalanceCategory = {
  title: string
  values: string[]
}

type BalanceProps = {
  balances: Balances[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

const BalancesTable = ({
  balances,
  isError,
  isLoading,
  refetch
}: BalanceProps) => {
  const balanceCategories: BalanceCategory[] = [
    { title: "ANNUAL", values: ["Credit", "Used", "Available"] },
    { title: "CASUAL", values: ["Credit", "Used", "Available"] },
    { title: "SPECIAL", values: ["Credit", "Used", "Available"] },
    { title: "HEALTH", values: ["Credit", "Used", "Available"] },
    { title: "MATERNITY", values: ["Credit", "Used", "Available"] },
    { title: "PATERNITY", values: ["Credit", "Used", "Available"] },
    { title: "UNPAID", values: ["Credit", "Used", "Available"] }
  ]

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load users data. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  const renderHeaderRows = () => {
    return (
      <>
        {/* First Header Row */}
        <TableRow>
          <TableHead rowSpan={2} className="text-center">
            Edit
          </TableHead>
          <TableHead rowSpan={2} className="text-center">
            User
          </TableHead>
          <TableHead rowSpan={2} className="text-center">
            Year
          </TableHead>
          {balanceCategories.map((category, index) => (
            <TableHead
              key={index}
              colSpan={category.values.length}
              className="text-center"
            >
              {category.title}
            </TableHead>
          ))}
        </TableRow>

        {/* Second Header Row */}
        <TableRow>
          {balanceCategories.flatMap((category) =>
            category.values.map((value, index) => (
              <TableHead
                key={`${category.title}-${index}`}
                className="text-center"
              >
                {value}
              </TableHead>
            ))
          )}
        </TableRow>
      </>
    )
  }

  const renderTableCells = (bal: Balances) => {
    const categories = [
      "annual",
      "casual",
      "special",
      "health",
      "maternity",
      "paternity",
      "unpaid"
    ]

    return categories.flatMap((category) => {
      // For other categories, show all three columns (Credit, Used, Available)
      return ["Credit", "Used", "Available"].map((type, index) => (
        <TableCell key={`${category}-${type}-${index}`} className="text-center">
          {(bal as any)[`${category}${type}`] || "-"}
        </TableCell>
      ))
    })
  }

  return (
    <TableWrapper title="All User Balances">
      <Table>
        <TableHeader>{renderHeaderRows()}</TableHeader>
        {isLoading ? (
          <FacultyUserTableSkeleton />
        ) : (
          <TableBody className="whitespace-nowrap text-center">
            {balances &&
              balances.map((bal) => (
                <TableRow key={bal.id}>
                  <TableCell>
                    <EditBalances refetch={refetch} balance={bal} />
                  </TableCell>
                  <TableCell>{bal.name}</TableCell>
                  <TableCell>
                    <Badge>{bal.year}</Badge>
                  </TableCell>
                  {renderTableCells(bal)}
                </TableRow>
              ))}
          </TableBody>
        )}
      </Table>
    </TableWrapper>
  )
}

export default BalancesTable
