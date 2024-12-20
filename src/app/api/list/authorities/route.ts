import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get("departmentId")
    if (!departmentId) {
      throw new Error("departmentId not found")
    }

    //find department and include departmentPrincipal and course
    const department = await prisma.department.findUnique({
      where: {
        id: Number(departmentId)
      },
      include: {
        principal: {
          include: {
            Department: true,
            roles: true
          }
        },
        Dean: {
          include: {
            Department: true,
            roles: true
          }
        },
        courses: {
          include: {
            hod: {
              include: {
                Department: true,
                roles: true
              }
            }
          }
        }
      }
    })
    const dean = department?.Dean
    const principal = department?.principal
    const hods = department?.courses
      ?.map((course) => course.hod)
      .filter((hod) => hod) // Excludes undefined or falsy values
    // const hods = department?.courses && department?.courses.map((course) => course.hod)
    let authorities: any[] = []

    if (hods && hods.length > 0) {
      authorities = [...authorities, ...hods]
    }
    if (principal) {
      authorities = [...authorities, principal]
    }
    if (dean) {
      authorities = [...authorities, dean]
    }
    return NextResponse.json(
      { message: "Found Authorities", authorities },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error while getting Authorities @/api/list/authorities", error)
    return NextResponse.json(
      { message: "Error while getting Authorities" },
      { status: 500 }
    )
  }
}
