import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { subjectId, tag } = await req.json()

    if (!subjectId || !tag) {
      return NextResponse.json(
        { error: "Invalid input @api/subjects/forum/tags" },
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
    console.log(error)
    return NextResponse.json(
      { error: "Failed to add tags @api/subjects/forum/tags" },
      { status: 500 }
    )
  }
}
