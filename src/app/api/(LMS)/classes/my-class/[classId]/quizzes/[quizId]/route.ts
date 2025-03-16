import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  try {
    const { quizId } = await context.params
    const Quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: { questions: true }
    })
    return NextResponse.json({ message: "Found Quiz", Quiz }, { status: 200 })
  } catch (error) {
    console.log(
      "Error while getting quiz @/api/classes/my-class/[classId]/quizes/[quizId]",
      error
    )
    return NextResponse.json(
      { message: "Error while getting quiz" },
      { status: 500 }
    )
  }
}
