import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  try {
    const {
      title,
      description,
      departmentId,
      universityId,
      announcerId,
      attachments,
      category
    } = await req.json()

    if (
      !title ||
      !departmentId ||
      !universityId ||
      !departmentId ||
      !announcerId ||
      !category
    ) {
      console.log("Validation failed. Missing required fields.")
      return NextResponse.json(
        { error: "Missing required fields @api/announcements" },
        { status: 400 }
      )
    }

    // Common data object for both create and update
    const data = {
      title,
      description,
      departmentId,
      universityId,
      announcerId,
      attachments,
      category
    }

    let announcement

    if (id) {
      try {
        announcement = await prisma.announcement.update({
          where: { id: Number(id) },
          data: {
            ...data,
            updatedAt: new Date()
          }
        })
      } catch (error) {
        // Check if the error is an instance of Prisma's known error type
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          // If announcement doesn't exist, create it with the specified ID
          announcement = await prisma.announcement.create({
            data: {
              ...data,
              id: Number(id)
            }
          })
        } else {
          throw error
        }
      }
    } else {
      announcement = await prisma.announcement.create({
        data: {
          ...data
        }
      })
    }

    return NextResponse.json(announcement, { status: id ? 200 : 201 })
  } catch (error: any) {
    console.log(
      "Error while creating announcement @api/announcements:",
      error.message
    )
    return NextResponse.json(
      {
        error: "Failed to create announcement @api/announcements",
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  if (!id) {
    console.log("Validation failed. Missing id @api/announcements:")
    return NextResponse.json(
      { error: "Missing id @api/announcements" },
      { status: 400 }
    )
  }

  try {
    const announcement = await prisma.announcement.deleteMany({
      where: { id: Number(id) }
    })

    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    console.log(`Failed to delete announcement @api/announcements ${error}`)
    return NextResponse.json(
      { error: `Failed to delete announcement @api/announcements ${error}` },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const route = url.searchParams.get("route")

  // Check the route and handle accordingly
  if (route === "findMany") {
    const departmentId = url.searchParams.get("departmentId")
    const universityId = url.searchParams.get("universityId")

    if (!departmentId || !universityId) {
      console.error(
        "Validation failed. Missing departmentId and universityId @api/announcements:"
      )
      return NextResponse.json(
        { error: "Missing departmentId and universityId @api/announcements" },
        { status: 400 }
      )
    }

    try {
      const announcements = await prisma.announcement.findMany({
        where: {
          departmentId: Number(departmentId),
          universityId: Number(universityId)
        },
        orderBy: { createdAt: "desc" }
      })

      return NextResponse.json(announcements, { status: 200 })
    } catch (error) {
      console.log(`Failed to fetch forum @api/announcements ${error}`)
      return NextResponse.json(
        { error: `Failed to fetch forum @api/announcements ${error}` },
        { status: 500 }
      )
    }
  } else if (route === "findOne") {
    const announcementId = url.searchParams.get("announcementId")

    if (!announcementId) {
      console.error(
        "Validation failed. Missing announcementId @api/announcements:"
      )
      return NextResponse.json(
        { error: "Missing announcementId @api/announcements" },
        { status: 400 }
      )
    }

    try {
      const announcement = await prisma.announcement.findUnique({
        where: { id: Number(announcementId) },
        select: {
          id: true,
          title: true,
          departmentId: true,
          universityId: true,
          announcerId: true,
          category: true,
          description: true,
          attachments: true
        }
      })

      if (!announcement) {
        return NextResponse.json(
          { error: "announcement not found @api/announcements" },
          { status: 404 }
        )
      }

      return NextResponse.json(announcement, { status: 200 })
    } catch (error) {
      console.log(
        "Error fetching announcement details @api/announcements:",
        error
      )
      return NextResponse.json(
        { error: "Internal server error  @api/announcements" },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  }
}
