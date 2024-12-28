import { NextResponse } from "next/server"
import {
  createUser,
  assignDean,
  assignHeadOfDepartment,
  assignPrincipal
} from "@/utils/clerk"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      password,
      roleIds,
      departmentId,
      courseId,
      universityId
    } = await req.json()
    console.log(
      "name,email,password,roleIds,departmentId,courseId,universityId:",
      name,
      email,
      password,
      roleIds,
      departmentId,
      courseId,
      universityId
    )
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

    if (
      !name ||
      !email ||
      !password ||
      !roleIds ||
      !departmentId ||
      !universityId
    ) {
      throw new Error("All fields are required")
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
    //creating a clerk and prisma teacher
    const user = await createUser({
      name: name,
      email: email,
      password: password,
      role: "authority",
      universityId,
      roleIds: roleIds as Array<number>,
      phone: "",
      courseId,
      departmentId
    })
    if (!user) {
      throw new Error("Error while creating authority")
    }

    if (roleIds.includes(10)) {
      //assign principal
      await assignPrincipal(Number(departmentId), user.clerkId)
    }

    //checks for hod
    if (roleIds.includes(11)) {
      await assignHeadOfDepartment(Number(courseId), user.clerkId)
    }

    //checks for dean
    if (roleIds.includes(12)) {
      //creating a clerk and prisma teacher
      await assignDean(Number(departmentId), user.clerkId)
    }

    return NextResponse.json(
      { message: "User created successfully" },
      {
        status: 201
      }
    )
  } catch (error) {
    console.log("Error creating User @api/list/authorities/create: ", error)
    return NextResponse.json(
      { message: "Error creating User" },
      { status: 500 }
    )
  }
}
