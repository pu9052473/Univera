import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const user = await currentUser()
  const role = user?.publicMetadata.role

  //check user authorization
  if (role !== "authority" && role !== "faculty" && role !== "student") {
    return NextResponse.json(
      { message: "You are not allowed to create a forum" },
      {
        status: 401
      }
    )
  }

  try {
    const {
      name,
      departmentId,
      courseId,
      userId,
      moderatorId,
      isPrivate,
      forumTags,
      subjectId
    } = await req.json()
    if (
      !name ||
      !departmentId ||
      !courseId ||
      !userId ||
      !moderatorId ||
      !forumTags ||
      forumTags.length === 0 ||
      !subjectId
    ) {
      console.log("Validation failed. Missing required fields.")
      return NextResponse.json(
        { error: "Missing required fields @api/subjects/forum" },
        { status: 400 }
      )
    }

    const forum = await prisma.forum.create({
      data: {
        name,
        departmentId,
        courseId,
        userId,
        moderatorId,
        forumTags,
        isPrivate,
        subjectId: parseInt(subjectId, 10),
        status: "active"
      }
    })

    return NextResponse.json(forum, { status: 201 })
  } catch (error: any) {
    console.log(
      "Error while creating forum @api/subjects/forum:",
      error.message
    )
    return NextResponse.json(
      {
        error: "Failed to create forum @api/subjects/forum",
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subjectId = searchParams.get("subjectId")

  if (!subjectId) {
    console.error("Validation failed. Missing subjectId @api/subjects:")
    return NextResponse.json(
      { error: "Missing subjectId @api/subjects" },
      { status: 400 }
    )
  }

  try {
    const forums = await prisma.forum.findMany({
      where: { subjectId: Number(subjectId) }
    })

    return NextResponse.json(forums, { status: 200 })
  } catch (error) {
    console.log(`Failed to fetch forum @api/subjects/forum ${error}`)
    return NextResponse.json(
      { error: `Failed to fetch forum @api/subjects/forum ${error}` },
      { status: 500 }
    )
  }
}
