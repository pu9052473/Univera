import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { findUserData } from "../profile/(helper)"

export async function POST(req: Request) {
  try {
    const { name, code, totalSemister, userId, department } = await req.json() // Ensure valid payload

    //check user authorization
    const user = await findUserData(userId)
    if (!user || user.departmentAdmin?.id !== department.id) {
      return NextResponse.json(
        { message: "Access denied" },
        {
          status: 403
        }
      )
    }

    // Validate input
    if (!department || !userId || !name || !code || !totalSemister) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    // Create a new course in the database
    const course = await prisma.course.create({
      data: {
        name,
        code,
        totalSemister,
        universityId: Number(department.universityId),
        departmentId: Number(department.id)
      }
    })

    return NextResponse.json({ message: "Course created", course })
  } catch (error) {
    console.error("[COURSES]/create", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const departmentId = searchParams.get("departmentId") // Pagination params
    const userId = searchParams.get("userId") // Pagination params

    if (!departmentId || !userId) {
      return NextResponse.json({ error: "Missing required parameters" })
    }

    // Validate user belongs to the department (optional, based on schema)
    const user = await findUserData(userId)
    if (!user || user.departmentAdmin?.id !== Number(departmentId)) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    // Fetch courses by department
    const courses = await prisma.course.findMany({
      where: { departmentId: Number(departmentId) },
      orderBy: { createdAt: "asc" } // Order courses (optional)
    })

    return NextResponse.json(
      { message: "courses found", courses },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
