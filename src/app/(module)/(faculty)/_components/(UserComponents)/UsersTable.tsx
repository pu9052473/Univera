import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Prisma } from "@prisma/client"
import AddCredits from "./AddCredits"
import { FacultyUserTableSkeleton } from "../Faculty_Skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    Department: true
    roles: true
  }
}>

type UserProps = {
  users: UserWithRelations[]
  isLoading: boolean
  isError: boolean
}

const UsersTable = ({ users, isLoading, isError }: UserProps) => {
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

  return (
    <Table>
      <TableHeader className="whitespace-nowrap">
        <TableRow>
          <TableHead>Avatar</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="">Add Leave Credits</TableHead>
        </TableRow>
      </TableHeader>
      {isLoading ? (
        <FacultyUserTableSkeleton />
      ) : (
        <TableBody className="whitespace-nowrap">
          {users &&
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <Avatar>
                    <AvatarImage src={"/user.jpg"} alt={user.name as string} />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user?.Department?.name}</Badge>
                </TableCell>
                <TableCell>
                  {user.roles.map((r) => (
                    <p key={r.id}>{r.rolename},</p>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <AddCredits
                    email={user.email as string}
                    name={user.name as string}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      )}
    </Table>
  )
}

export default UsersTable
