import prisma from "@/lib/prisma"
import { LeaveStatus } from "@prisma/client"
import { NextResponse } from "next/server"

type EditBody = {
  notes: string
  status: LeaveStatus
  id: string
  days: number
  type: string
  year: string
  email: string
  user: string
  startDate: string
  userId: string
  userName: string
}

export async function PATCH(req: Request) {
  try {
    const body: EditBody = await req.json()

    const { notes, status, id, userId, userName } = body

    const updatedAt = new Date().toISOString()

    await prisma.leave.update({
      where: { id },
      data: {
        moderatorNote: notes,
        status,
        updatedAt,
        moderator: {
          connect: { id: userId }
        },
        updatedBy: userName
      }
    })

    return NextResponse.json({ message: "Success" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
