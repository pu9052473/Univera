import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = await searchParams.get("departmentId")

    const department = await prisma.department.findUnique({
      where: { id: Number(departmentId) },
      include: {
        faculties: true,
        principal: true
      }
    })

    if (!department) {
      throw new Error("Can't find department")
    }

    return NextResponse.json(
      { message: "Found department", faculties: department.faculties },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("error while finding department @list/teacher", error)
    return NextResponse.json(
      { message: "error while finding department" },
      {
        status: 500
      }
    )
  }
}
