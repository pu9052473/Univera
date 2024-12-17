import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subjectId = searchParams.get("subjectId")
    const user = await currentUser()
    const role = user?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }

    const subject = await prisma.subject.findUnique({
      where: { id: Number(subjectId) }
    })
    if (!subject) {
      throw new Error("Error while getting subject")
    }

    return NextResponse.json(
      { message: "Found subject details", subject },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while fetching subjects @api/subjects/[subjectId] ${error}`
    )
    return NextResponse.json(
      { message: "Error fetching subject" },
      {
        status: 500
      }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const { updatedSubject } = await req.json()
    const subjectId = searchParams.get("subjectId")
    const user = await currentUser()
    // const {name,code,credits,semester} = await req.json()
    const role = user?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }
    const subject = await prisma.subject.update({
      where: {
        id: Number(subjectId)
      },
      data: updatedSubject
    })

    if (!subject) throw new Error("Error while getting subject")

    return NextResponse.json(
      { message: "Subject Updated", subject },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while fetching subjects @api/subjects/[subjectId] ${error}`
    )
    return NextResponse.json(
      { message: "Error fetching subject" },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = await new URL(req.url)
    const subjectId = await searchParams.get("subjectId")
    const user = await currentUser()
    const role = user?.publicMetadata.role

    //check user authorization
    if (role !== "department_admin" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }

    const deletedSubject = await prisma.subject.delete({
      where: { id: Number(subjectId) }
    })
    if (!deletedSubject) {
      throw new Error("Error while deleting subject")
    }
    return NextResponse.json(
      { message: "subject Deleted", subject: deletedSubject },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log(
      `Error while deleting subject @api/subjects/[subjectId] ${error}`
    )
    return NextResponse.json(
      { message: "Error while deleting subject" },
      {
        status: 500
      }
    )
  }
}
