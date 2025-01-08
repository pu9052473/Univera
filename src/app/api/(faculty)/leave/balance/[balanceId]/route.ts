import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

interface EditBody {
  [key: string]: number | string
  id: string
}

export async function PATCH(req: Request) {
  try {
    const body: EditBody = await req.json()

    const { id, ...data } = body

    await prisma.balances.update({
      where: { id },
      data
    })

    return NextResponse.json({ message: "Success" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
