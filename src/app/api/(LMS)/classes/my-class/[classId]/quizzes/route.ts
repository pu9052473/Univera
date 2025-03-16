import prisma from "@/lib/prisma"
import { generateQuizFromDocument } from "@/utils/gemini"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Parse multipart form data
    const body = await req.json()
    const {
      title,
      description,
      duration,
      tags,
      classId,
      subjectId,
      departmentId,
      universityId,
      topic
    } = body

    if (
      !title ||
      !duration ||
      !tags ||
      !classId ||
      !subjectId ||
      !departmentId ||
      !universityId ||
      !topic
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // // Extract text from PDF
    // const buffer = Buffer.from(await file.arrayBuffer());
    // const pdfData = await parse(buffer);
    // const documentText = pdfData.text;

    // Generate quiz using AI
    const quizDetails = { title, description, duration, tags }
    const AIResponse = await generateQuizFromDocument(topic, quizDetails)
    // Calculate total marks and number of questions
    const AIQuestions = await JSON.parse(AIResponse)
    const totalMarks = AIQuestions.reduce(
      (sum: number, q: any) => sum + q.marks,
      0
    )
    const prismaUser = await prisma.user.findUnique({
      where: {
        id: user.id
      }
    })
    // Store quiz in database
    const quiz = await prisma.quiz.create({
      data: {
        title: title,
        description: description,
        documentUrl: "document Url", // Store file name or upload to cloud storage
        tags: tags,
        createdByName: prismaUser?.name || "User", // Replace with actual user name from auth
        creatorId: "user_2qcqOVn3ZSTCeUmQVWwIH0o6VTn",
        duration: duration,
        numberOfQuestions: AIQuestions.length,
        totalMarks: totalMarks,
        visibility: "public",
        status: "draft",
        classId: Number(classId),
        subjectId: Number(subjectId),
        departmentId: Number(departmentId),
        universityId: Number(universityId)
      }
    })
    const questionsData = AIQuestions.map((q: any) => ({
      title: q.title,
      description: q.description || null,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
      quizId: quiz.id
    }))

    await prisma.question.createMany({
      data: questionsData
    })

    return NextResponse.json(
      { message: "Successfully generated", quiz },
      { status: 201 }
    )
  } catch (error) {
    console.log(
      "Error while generating quiz @/api/classes/my-class/[classId]/quizzes",
      error
    )
    return NextResponse.json(
      { message: "Failed to generate quiz" },
      { status: 500 }
    )
  }
}
