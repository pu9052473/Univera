import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const courseIdParams = searchParams.get("courseId")
  const courseId = courseIdParams ? parseInt(courseIdParams, 10) : NaN

  // Validate the conversion
  if (isNaN(courseId)) {
    return NextResponse.json(
      { error: "Invalid courseId, must be a number" },
      { status: 400 }
    )
  }

  if (!courseId) {
    console.log("Validation failed. Missing courseId @api/subjects:")
    return NextResponse.json(
      { error: "Missing courseId @api/subjects" },
      { status: 400 }
    )
  }

  try {
    const subjects = await prisma.subject.findMany({
      where: { courseId }
    })

    // console.log("subjects from", subjects)

    return NextResponse.json(subjects, { status: 200 })
  } catch (error) {
    console.log(`Failed to fetch subjects @api/subjects ${error}`)
    return NextResponse.json(
      { error: `Failed to fetch subjects @api/subjects ${error}` },
      { status: 500 }
    )
  }
}
