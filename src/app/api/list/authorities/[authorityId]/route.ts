import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { assignDean, assignPrincipal, DeleteUser } from "@/utils/clerk"

export async function GET(req: Request, context: any) {
  try {
    const { authorityId } = await context.params

    const user = await prisma.user.findUnique({
      where: { clerkId: authorityId },
      include: {
        Department: true,
        roles: true,
        course: true
      }
    })
    if (!user) {
      throw new Error("Error while getting user")
    }

    return NextResponse.json(
      { message: "Found Authority data", authority: user },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while getting user @/api/list/teacher/[authorityId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting user" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const { authorityId } = await context.params
    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to update authority" },
        { status: 401 }
      )
    }

    const { roleIds, courseId, departmentId } = await req.json()
    if (!roleIds) {
      throw new Error("RoleIds not found")
    }

    //checks for principal
    if (roleIds.includes(10)) {
      const department = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
        include: {
          principal: true
        }
      })
      if (department?.principal) {
        //principal already exists
        return NextResponse.json(
          { message: "Principal already exists" },
          { status: 409 }
        )
      }
    }

    //checks for hod
    if (roleIds.includes(11)) {
      if (!courseId) {
        throw new Error("CourseId not found")
      }
      const course = await prisma.course.findUnique({
        where: { id: Number(courseId) },
        include: {
          hod: true
        }
      })
      if (course?.hod) {
        //Hod already exists
        return NextResponse.json(
          { message: "Hod already exists" },
          { status: 409 }
        )
      }
    }

    //checks for dean
    if (roleIds.includes(12)) {
      const department = await prisma.department.findUnique({
        where: { id: Number(departmentId) },
        include: {
          Dean: true
        }
      })
      if (department?.Dean) {
        //Dean already exists
        return NextResponse.json(
          { message: "Dean already exists" },
          { status: 409 }
        )
      }
    }

    if (roleIds.includes(10)) {
      //principal role
      if (!departmentId) {
        throw new Error("DepartmentId not found")
      }
      assignPrincipal(departmentId, authorityId)
    }
    if (roleIds.includes(12)) {
      //dean role
      if (!departmentId) {
        throw new Error("DepartmentId not found")
      }
      assignDean(departmentId, authorityId)
    }

    if (roleIds.includes(11)) {
      //head of department role
      if (!courseId) {
        throw new Error("CourseId not found")
      }
      //disconnect old course
      await prisma.course.update({
        where: { hodId: authorityId },
        data: { hodId: null }
      })
      //connect new course
      await prisma.course.update({
        where: { id: Number(courseId) },
        data: {
          hod: {
            connect: { id: authorityId }
          }
        }
      })
    }

    const updatedAuthorities = await prisma.user.update({
      where: { id: authorityId },
      data: {
        roles: {
          set: roleIds.map((id: number) => ({ id }))
        }
      }
    })
    if (!updatedAuthorities) {
      throw new Error("Error while updating Authority")
    }

    return NextResponse.json(
      { message: "Authority data updated" },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      "Error while updating Authority @api/list/authority/[authorityId]: ",
      error
    )
    return NextResponse.json(
      { message: "Error while updating Authority" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { authorityId } = await context.params
    const { roleIds } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: authorityId },
      include: { hodCourse: true }
    })
    const courseId = user?.hodCourse?.id

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to Delete authority" },
        { status: 401 }
      )
    }

    if (roleIds.includes(4)) {
      return NextResponse.json(
        { message: "Delete this user from faculty section" },
        {
          status: 409
        }
      )
    }

    if (roleIds.includes(10)) {
      //principal role
      await prisma.department.update({
        where: { principalId: authorityId },
        data: {
          principal: {
            disconnect: { id: authorityId }
          }
        }
      })
    }
    if (roleIds.includes(12)) {
      //dean role
      await prisma.department.update({
        where: { deanId: authorityId },
        data: {
          Dean: {
            disconnect: { id: authorityId }
          }
        }
      })
    }
    if (roleIds.includes(11)) {
      //head of department role
      if (!courseId) {
        throw new Error("CourseId not found")
      }
      await prisma.course.update({
        where: { id: Number(courseId) },
        data: {
          hod: {
            disconnect: { id: authorityId }
          }
        }
      })
    }

    await DeleteUser(authorityId)
    await prisma.user.delete({ where: { clerkId: authorityId } })

    return NextResponse.json({ message: "Authority Deleted" }, { status: 200 })
  } catch (error) {
    console.log(
      "Error while deleting Authority @api/list/teacher/[authorityId]:",
      error
    )
    return NextResponse.json(
      { message: "Error While Deleting Authority" },
      { status: 500 }
    )
  }
}
