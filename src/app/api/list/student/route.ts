import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = await searchParams.get("courseId")

    if (!courseId) {
      throw new Error("CourseId not found")
    }
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        students: {
          include: {
            user: true
          }
        }
      }
    })

    if (!course) {
      throw new Error("Can't find course")
    }

    return NextResponse.json(
      { message: "Found students", students: course.students },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("error while finding course @list/student", error)
    return NextResponse.json(
      { message: "error while finding course" },
      {
        status: 500
      }
    )
  }
}
