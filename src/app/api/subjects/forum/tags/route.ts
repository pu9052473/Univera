import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const user = await currentUser()
  const role = user?.publicMetadata.role

  //check user authorization
  if (role !== "authority" && role !== "faculty" && role !== "student") {
    return NextResponse.json(
      { message: "You are not allowed to create a forum tags" },
      {
        status: 401
      }
    )
  }
  try {
    const { subjectId, tag } = await req.json()

    if (!subjectId || !tag) {
      return NextResponse.json(
        { message: "Invalid input @api/subjects/forum/tags" },
        { status: 400 }
      )
    }

    // Update subject with matching id as subjectId to add tags
    await prisma.subject.updateMany({
      where: { id: parseInt(subjectId, 10) },
      data: { forumTags: { push: tag } } // Adds tags to existing array
    })

    return NextResponse.json({ message: "Tags added successfully to subject" })
  } catch (error) {
    console.log("Error while adding tags: @api/subjects/forum/tags", error)
    return NextResponse.json({ message: "Failed to add tags" }, { status: 500 })
  }
}
