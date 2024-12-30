import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
  try {
    const { classId } = await context.params

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }
    if (!classId) {
      throw new Error("Class Id is required")
    }

    const Class = await prisma.class.findFirst({
      where: {
        id: Number(classId)
      },
      include: {
        faculties: {
          include: {
            class: true,
            user: {
              include: {
                roles: true
              }
            }
          }
        },
        mentor: true,
        coordinator: true,
        course: {
          include: {
            subjects: true,
            faculties: {
              include: {
                class: true,
                user: {
                  include: {
                    roles: true
                  }
                }
              }
            },
            students: {
              include: {
                class: true,
                user: true
              }
            }
          }
        }
      }
    })

    if (!Class) {
      return NextResponse.json(
        { message: "Class not found" },
        {
          status: 404
        }
      )
    }

    return NextResponse.json({ message: "Class found", Class }, { status: 200 })
  } catch (error) {
    console.log("Error while getting class @api/(LMS)classes/[classId]", error)
    return NextResponse.json(
      { message: "Error while getting class" },
      {
        status: 500
      }
    )
  }
}

export async function PATCH(res: Request, context: any) {
  try {
    const { searchParams } = new URL(res.url)
    const assignFaculty = await searchParams.get("assignFaculty")
    const removeFaculty = await searchParams.get("removeFaculty")
    const assignStudent = await searchParams.get("assignStudent")
    const removeStudent = await searchParams.get("removeStudent")
    const { classId } = await context.params
    const {
      updatedClass,
      facultyIds,
      removedFaultyId,
      studentIds,
      removedStudentId
    } = await res.json()
    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role

    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }

    if (!classId) {
      throw new Error("Class Id is required")
    }

    // Adding faculties to class
    if (assignFaculty) {
      if (
        !facultyIds ||
        !Array.isArray(facultyIds) ||
        facultyIds.length === 0
      ) {
        return NextResponse.json(
          { error: "Valid faculty IDs array is required" },
          { status: 400 }
        )
      }
      try {
        const Class = await prisma.class.update({
          where: {
            id: Number(classId)
          },
          data: {
            faculties: {
              connect: facultyIds.map((id: string) => ({
                id: id
              }))
            }
          }
        })

        return NextResponse.json(
          {
            message: "Faculties assigned successfully",
            data: Class
          },
          {
            status: 200
          }
        )
      } catch (error) {
        console.error(
          "Error assigning faculties @api/(LMS)classes/[classId]:",
          error
        )
        return NextResponse.json(
          {
            error: "Failed to assign faculties"
          },
          {
            status: 500
          }
        )
      }
    }

    //Remove Faculty from class
    if (removeFaculty) {
      if (!removedFaultyId) {
        return NextResponse.json(
          { error: "Valid Removing facultyID is required" },
          { status: 400 }
        )
      }
      try {
        const Class = await prisma.class.update({
          where: {
            id: Number(classId)
          },
          data: {
            faculties: {
              disconnect: { id: removedFaultyId }
            }
          }
        })

        return NextResponse.json(
          { message: "Faculty removed successfully", class: Class },
          { status: 200 }
        )
      } catch (error) {
        console.error(
          "Error Removing faculties @api/(LMS)classes/[classId]:",
          error
        )
        return NextResponse.json(
          { error: "Failed to remove faculties" },
          { status: 500 }
        )
      }
    }
    // Adding faculties to class
    if (assignStudent) {
      if (
        !studentIds ||
        !Array.isArray(studentIds) ||
        studentIds.length === 0
      ) {
        return NextResponse.json(
          { error: "Valid student IDs array is required" },
          { status: 400 }
        )
      }
      try {
        const Class = await prisma.class.update({
          where: {
            id: Number(classId)
          },
          data: {
            students: {
              connect: studentIds.map((id: string) => ({
                id: id
              }))
            }
          }
        })

        return NextResponse.json(
          {
            message: "Students assigned successfully",
            data: Class
          },
          {
            status: 200
          }
        )
      } catch (error) {
        console.error(
          "Error assigning Students: @api/(LMS)classes/[classId]",
          error
        )
        return NextResponse.json(
          {
            error: "Failed to assign Students"
          },
          {
            status: 500
          }
        )
      }
    }

    //Remove Faculty from class
    if (removeStudent) {
      if (!removedStudentId) {
        return NextResponse.json(
          { error: "Valid Removing stdudentId is required" },
          { status: 400 }
        )
      }
      try {
        const Class = await prisma.class.update({
          where: {
            id: Number(classId)
          },
          data: {
            students: {
              disconnect: { id: removedStudentId }
            }
          }
        })

        return NextResponse.json(
          { message: "Student removed successfully", class: Class },
          { status: 200 }
        )
      } catch (error) {
        console.error(
          "Error Removing Student @api/(LMS)classes/[classId]:",
          error
        )
        return NextResponse.json(
          { error: "Failed to remove Student" },
          { status: 500 }
        )
      }
    }

    // Update class with new coordinator
    if (updatedClass.coordinatorId) {
      const updatedClassData = await prisma.class.update({
        where: {
          id: Number(classId)
        },
        data: {
          coordinator: {
            connect: { id: updatedClass.coordinatorId }
          }
        }
      })
      if (!updatedClassData) {
        return NextResponse.json(
          { message: "Error updating coordinator" },
          { status: 500 }
        )
      }
      return NextResponse.json(
        {
          message: "Coordinator updated successfully",
          data: updatedClassData
        },
        {
          status: 200
        }
      )
    }

    // Update class with new Mentor
    if (updatedClass.mentorId) {
      const updatedClassData = await prisma.class.update({
        where: {
          id: Number(classId)
        },
        data: {
          mentor: {
            connect: { id: updatedClass.mentorId }
          }
        }
      })
      if (!updatedClassData) {
        return NextResponse.json(
          { message: "Error updating coordinator" },
          { status: 500 }
        )
      }
      return NextResponse.json(
        {
          message: "Mentor updated successfully",
          class: updatedClassData
        },
        {
          status: 200
        }
      )
    }

    //else update class details
    const Class = await prisma.class.update({
      where: { id: Number(classId) },
      data: updatedClass
    })

    if (!Class) {
      throw new Error("Error while updating class")
    }
    return NextResponse.json(
      { message: "Class updated successfully", Class },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error while updating class @api/(LMS)classes/[classId]", error)
    return NextResponse.json(
      { message: "Error while updating class" },
      { status: 500 }
    )
  }
}

export async function DELETE(res: Request, context: any) {
  try {
    const { classId } = await context.params

    const clerkU = await currentUser()
    const role = clerkU?.publicMetadata.role
    //check user authorization
    if (role !== "authority" && role !== "super_user") {
      return NextResponse.json(
        { message: "You are not allowed to create a Subject" },
        {
          status: 401
        }
      )
    }
    if (!classId) {
      throw new Error("Class Id is missing")
    }

    await prisma.class.delete({
      where: { id: Number(classId) }
    })
    return NextResponse.json(
      { message: "Class deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error while deleting class @api/(LMS)classes/[classId]", error)
    return NextResponse.json(
      { message: "Error while deleting class" },
      { status: 500 }
    )
  }
}
