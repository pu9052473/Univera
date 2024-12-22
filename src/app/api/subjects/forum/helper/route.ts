import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const route = url.searchParams.get("route")

  // Check the route and handle accordingly
  if (route === "facultyDetails") {
    const courseId = url.searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      )
    }

    try {
      const faculty = await prisma.faculty.findMany({
        where: { courseId: Number(courseId) },
        orderBy: { createdAt: "asc" }
      })

      if (!faculty.length) {
        return NextResponse.json(
          { error: "No faculty found for this course" },
          { status: 404 }
        )
      }

      return NextResponse.json(faculty, { status: 200 })
    } catch (error) {
      console.log("Error fetching faculty:", error)
      return NextResponse.json(
        { error: "Failed to fetch faculty" },
        { status: 500 }
      )
    }
  } else if (route === "subjectDetails") {
    const subjectId = url.searchParams.get("subjectId")

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: Number(subjectId) },
        select: {
          forumTags: true,
          departmentId: true,
          courseId: true
        }
      })

      if (!subject) {
        return NextResponse.json(
          { error: "Subject not found @api/subjects/forum/tags" },
          { status: 404 }
        )
      }

      return NextResponse.json(subject, { status: 200 })
    } catch (error) {
      console.log(
        "Error fetching subject details @api/subjects/forum/tags:",
        error
      )
      return NextResponse.json(
        { error: "Internal server error @api/subjects/forum/tags" },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  }
}
