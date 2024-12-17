"use server"
import prisma from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"

export async function createUser({
  name,
  email,
  password,
  phone,
  role,
  roleId
}: {
  name: string
  phone: string
  email: string
  password: string
  role: string
  roleId: number
}) {
  //clerk user
  const clerkclient = await clerkClient()
  try {
    const user = await clerkclient.users.createUser({
      firstName: name,
      emailAddress: [email],
      password,
      publicMetadata: {
        role
      }
    })
    if (!user) {
      throw new Error("Error creating user")
    }

    //create prisma user
    const prismaUser = await prisma.user.create({
      data: {
        id: user.id,
        clerkId: user.id,
        name,
        email,
        phone,
        roles: {
          connect: {
            id: roleId
          }
        }
      }
    })
    if (!prismaUser) {
      throw new Error("Error creating user")
    }

    return prismaUser
  } catch (error) {
    console.log("Error creating user @utils/clerk", error)
  }
}

export async function assignAdmin(departmentId: number, userId: string) {
  try {
    if (!userId) {
      throw new Error("No userId is required")
    }
    console.log("userId: ", userId)

    const department = await prisma.department.update({
      where: { id: departmentId },
      data: { adminId: userId },
      include: { admin: true }
    })
    return department
  } catch (error) {
    console.log("Error creating user @utils/clerk", error)
  }
}
