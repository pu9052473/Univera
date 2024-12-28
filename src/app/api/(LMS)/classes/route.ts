import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")
    const facultyId = searchParams.get("facultyId")
    const isFaculty = searchParams.get("isFaculty")

    if (isFaculty) {
      if (!facultyId) {
        throw new Error("Faculty Id not found")
      }
      const faculty = await prisma.faculty.findUnique({
        where: { id: facultyId },
        include: {
          class: {
            include: {
              coordinator: true,
              mentor: true
            }
          }
        }
      })
      if (!faculty) {
        return NextResponse.json(
          { message: "No faculty found" },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { message: "Found faculty data", classes: faculty?.class },
        { status: 200 }
      )
    }

    if (!courseId) {
      throw new Error("Course Id is required")
    }

    const classes = await prisma.class.findMany({
      where: {
        courseId: Number(courseId)
      }
    })
    if (!classes || classes.length === 0) {
      return NextResponse.json(
        { message: "No Classes found" },
        {
          status: 404
        }
      )
    }
    return NextResponse.json(
      { message: "Classes found", classes },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("Error while getting classes @api/(LMS)classes", error)
    return NextResponse.json(
      { message: "Error while getting classes" },
      {
        status: 500
      }
    )
  }
}
