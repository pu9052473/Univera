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
    const faculties = await Promise.all(
      department.faculties.map(async (f) => {
        const user = await prisma.user.findUnique({
          where: {
            id: f.clerkId
          },
          include: {
            Department: true,
            roles: true
          }
        })
        return user
      })
    )

    return NextResponse.json(
      { message: "Found faculties", faculties },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("error while finding faculties @list/teacher", error)
    return NextResponse.json(
      { message: "error while finding faculties" },
      {
        status: 500
      }
    )
  }
}
