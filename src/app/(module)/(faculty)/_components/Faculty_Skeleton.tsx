import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import Container from "./Container"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"

export const FacultyUserTableSkeleton = () => (
  <TableBody className="whitespace-nowrap">
    {[...Array(5)].map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton circle width={40} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton width={120} />
        </TableCell>
        <TableCell>
          <Skeleton width={180} />
        </TableCell>
        <TableCell>
          <Skeleton width={100} />
        </TableCell>
        <TableCell>
          <Skeleton width={90} />
        </TableCell>
        <TableCell>
          <Skeleton width={80} />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton width={100} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
)

export const UserBalancesSkeleton = () => {
  return (
    <Container>
      <section className="grid grid-cols-1 gap-4 my-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              height={150}
              className="rounded-md shadow-md"
            />
          ))}
      </section>
    </Container>
  )
}
