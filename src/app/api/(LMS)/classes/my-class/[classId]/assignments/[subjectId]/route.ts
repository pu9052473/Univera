import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  try {
    const { subjectId } = await context.params

    const Assignments = await prisma.assignment.findMany({
      where: { subjectId: Number(subjectId) },
      orderBy: { startDate: "asc" },
      include: {
        subject: true
      }
    })

    return NextResponse.json(
      { message: "Success", assignments: Assignments },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      `Error while getting assignments @api/classes/my-class/[classId]/assignments/[subjectId] ${error}`
    )

    return NextResponse.json(
      { message: "Error while getting assignments" },
      { status: 500 }
    )
  }
}
