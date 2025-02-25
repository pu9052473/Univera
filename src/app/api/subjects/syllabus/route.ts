import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const { title, subjectId, file, uploadedBy } = await req.json() // Parse request body

    if (!title || !subjectId || !file || !uploadedBy || file.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      )
    }

    const updatedSubject = await prisma.subject.update({
      where: { id: Number(subjectId) },
      data: {
        syllabus: {
          push: {
            title,
            uploadedBy,
            link: file[0].url
          }
        }
      }
    })

    return new Response(
      JSON.stringify({
        message: "Syllabus uploaded successfully",
        subject: updatedSubject
      }),
      {
        status: 200
      }
    )
  } catch (error) {
    console.error("Error uploading syllabus:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500
    })
  }
}
