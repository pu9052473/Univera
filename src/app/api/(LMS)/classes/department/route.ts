import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get("departmentId")
    if (!departmentId) {
      return NextResponse.json(
        { message: "Department Id is required" },
        { status: 400 }
      )
    }
    const departmentClasses = await prisma.class.findMany({
      where: { departmentId: Number(departmentId) }
    })
    if (!departmentClasses) {
      return NextResponse.json({ message: "No class found" }, { status: 404 })
    }
    return NextResponse.json({ classes: departmentClasses }, { status: 200 })
  } catch (error) {
    console.log("Error while fetching courses: ", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
