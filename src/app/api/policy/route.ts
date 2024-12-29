import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  const user = await currentUser()
  const role = user?.publicMetadata.role

  console.log("come in api policy")

  //check user authorization
  if (
    role !== "dean" &&
    role !== "principal" &&
    role !== "head_of_department" &&
    role !== "department_admin" &&
    role !== "university_admin"
  ) {
    return NextResponse.json(
      { message: "You are not allowed to create or update policy" },
      {
        status: 401
      }
    )
  }

  try {
    const {
      title,
      description,
      departmentId,
      universityId,
      authorId,
      effectiveDate,
      expiryDate,
      attachments,
      category
    } = await req.json()

    if (
      !title ||
      !departmentId ||
      !universityId ||
      !departmentId ||
      !authorId ||
      !category ||
      !effectiveDate
    ) {
      console.log("Validation failed. Missing required fields.")
      return NextResponse.json(
        { error: "Missing required fields @api/policy" },
        { status: 400 }
      )
    }

    // Common data object for both create and update
    const data = {
      title,
      description,
      departmentId,
      universityId,
      authorId,
      effectiveDate,
      expiryDate,
      attachments,
      category
    }

    let policy

    if (id) {
      try {
        policy = await prisma.policy.update({
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
          policy = await prisma.policy.create({
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
      policy = await prisma.policy.create({
        data: {
          ...data
        }
      })
    }

    return NextResponse.json(policy, { status: id ? 200 : 201 })
  } catch (error: any) {
    console.log("Error while creating policy @api/policys:", error.message)
    return NextResponse.json(
      {
        error: "Failed to create policy @api/policys",
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const user = await currentUser()
  const role = user?.publicMetadata.role

  //check user authorization
  if (
    role !== "dean" &&
    role !== "principal" &&
    role !== "head_of_department" &&
    role !== "department_admin" &&
    role !== "university_admin"
  ) {
    return NextResponse.json(
      { message: "You are not allowed to delete a policy" },
      {
        status: 401
      }
    )
  }

  if (!id) {
    console.log("Validation failed. Missing id @api/policies:")
    return NextResponse.json(
      { error: "Missing id @api/policys" },
      { status: 400 }
    )
  }

  try {
    const policy = await prisma.policy.deleteMany({
      where: { id: Number(id) }
    })

    return NextResponse.json(policy, { status: 200 })
  } catch (error) {
    console.log(`Failed to delete policy @api/policys ${error}`)
    return NextResponse.json(
      { error: `Failed to delete policy @api/policy ${error}` },
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
        "Validation failed. Missing departmentId and universityId @api/policy:"
      )
      return NextResponse.json(
        { error: "Missing departmentId and universityId @api/policy" },
        { status: 400 }
      )
    }

    try {
      const policy = await prisma.policy.findMany({
        where: {
          departmentId: Number(departmentId),
          universityId: Number(universityId)
        },
        orderBy: { createdAt: "desc" }
      })

      return NextResponse.json(policy, { status: 200 })
    } catch (error) {
      console.log(`Failed to fetch forum @api/policy ${error}`)
      return NextResponse.json(
        { error: `Failed to fetch forum @api/policy ${error}` },
        { status: 500 }
      )
    }
  } else if (route === "findOne") {
    const policyId = url.searchParams.get("policyId")

    if (!policyId) {
      console.error("Validation failed. Missing policyId @api/policy:")
      return NextResponse.json(
        { error: "Missing policyId @api/policy" },
        { status: 400 }
      )
    }

    try {
      const policy = await prisma.policy.findUnique({
        where: { id: Number(policyId) },
        select: {
          id: true,
          title: true,
          departmentId: true,
          universityId: true,
          authorId: true,
          category: true,
          effectiveDate: true,
          expiryDate: true,
          description: true,
          attachments: true
        }
      })

      if (!policy) {
        return NextResponse.json(
          { error: "policy not found @api/policy" },
          { status: 404 }
        )
      }

      return NextResponse.json(policy, { status: 200 })
    } catch (error) {
      console.log("Error fetching policy details @api/policy:", error)
      return NextResponse.json(
        { error: "Internal server error  @api/policy" },
        { status: 500 }
      )
    }
  } else {
    return NextResponse.json({ error: "Route not found" }, { status: 404 })
  }
}
