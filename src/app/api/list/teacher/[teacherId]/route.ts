import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { DeleteUser } from "@/utils/clerk"

export async function GET(req: Request, context: any) {
  try {
    const { teacherId } = await context.params

    const user = await prisma.faculty.findUnique({
      where: { clerkId: teacherId },
      include: {
        user: {
          include: {
            roles: true
          }
        },
        subject: true,
        department: true
      }
    })
    if (!user) {
      throw new Error("Error while getting user")
    }

    return NextResponse.json(
      { message: "Found Faculty data", faculty: user },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while getting user @/api/list/teacher/[teacherId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting user" },
      {
        status: 500
      }
    )
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const { teacherId } = await context.params
    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }

    const { roleIds, position, subjectIds } = await req.json()
    if (roleIds) {
      await prisma.user.update({
        where: { id: teacherId },
        data: {
          roles: {
            connect: roleIds.map((id: number) => ({ id }))
          }
        }
      })
    }

    const updatedFaculties = await prisma.faculty.update({
      where: { clerkId: teacherId },
      data: {
        position,
        subject: {
          set: subjectIds.map((id: number) => ({ id })) // Ensures only specified subjects are connected
        }
      }
    })
    if (!updatedFaculties) {
      throw new Error("Error while updating faculty")
    }

    return NextResponse.json(
      { message: "Faculty data updated", updatedFaculties },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      "Error while updating faculty @api/list/teacher/[teacherId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while updating" },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { teacherId } = await context.params

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }
    await DeleteUser(teacherId)
    await prisma.faculty.delete({ where: { clerkId: teacherId } })
    await prisma.user.delete({ where: { id: teacherId } })

    return NextResponse.json(
      { message: "Faculty Deleted" },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while deleting faculty @api/list/teacher/[teacherId]: ${error}`
    )
    return NextResponse.json(
      { message: "Error While Deleting Faculty" },
      {
        status: 500
      }
    )
  }
}
