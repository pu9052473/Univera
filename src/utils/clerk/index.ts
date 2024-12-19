"use server"
import prisma from "@/lib/prisma"
import { clerkClient } from "@clerk/nextjs/server"

export async function createUser({
  name,
  email,
  password,
  phone,
  role,
  roleIds
}: {
  name: string
  phone: string
  email: string
  password: string
  role: string
  roleIds: number[]
}) {
  console.log(
    "name,email,password,phone,role,roleIds:",
    name,
    email,
    password,
    phone,
    role,
    roleIds
  )
  //clerk user
  const clerkclient = await clerkClient()
  try {
    const existingUsers = await clerkclient.users.getUserList({
      emailAddress: [email]
    })

    let user

    if (existingUsers.data.length == 0) {
      console.log(existingUsers.data)
      user = await clerkclient.users.createUser({
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
    } else {
      user = existingUsers.data[0]
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
          connect: roleIds.map((id) => ({ id })) // Connect all roles
        }
      }
    })
    if (!prismaUser) {
      throw new Error("Error creating user")
    }

    return prismaUser
  } catch (error) {
    // console.error('Clerk error:', error.errors);
    console.log("Error creating user @utils/clerk", error)
  }
}

export async function assignHeadOfDepartment(courseId: number, userId: string) {
  try {
    if (!courseId || !userId) {
      throw new Error("courseId or userId is required")
    }
    const Course = await prisma.course.update({
      where: { id: courseId },
      data: { hodId: userId },
      include: { hod: true }
    })
    return Course
  } catch (error) {
    console.log("Error creating user @utils/clerk", error)
    throw new Error("Error creating user @utils/clerk")
  }
}

export async function assignPrincipal(departmentId: number, userId: string) {
  try {
    if (!departmentId || !userId) {
      throw new Error("departmentId or userId is required")
    }
    const department = await prisma.department.update({
      where: { id: departmentId },
      data: { principalId: userId },
      include: { principal: true }
    })
    return department
  } catch (error) {
    console.log("Error creating user @utils/clerk", error)
    throw new Error("Error creating user @utils/clerk")
  }
}

export async function assignDean(departmentId: number, userId: string) {
  try {
    if (!departmentId || !userId) {
      throw new Error("departmentId or userId is required")
    }
    const department = await prisma.department.update({
      where: { id: departmentId },
      data: { principalId: userId },
      include: { principal: true }
    })
    return department
  } catch (error) {
    console.log("Error creating user @utils/clerk", error)
    throw new Error("Error creating user @utils/clerk")
  }
}

export async function assignAdmin(departmentId: number, userId: string) {
  try {
    if (!userId) {
      throw new Error("userId is required")
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
    throw new Error("Error creating user @utils/clerk")
  }
}

export async function DeleteUser(userId: string) {
  try {
    if (!userId) {
      throw new Error("userId is required")
    }
    const clerkclient = await clerkClient()

    const deletedClerkUser = await clerkclient.users.deleteUser(userId)
    return deletedClerkUser
  } catch (error: any) {
    console.log("Error deleting user @utils/clerk: ", error.errors)
    throw new Error("Error deleting user @utils/clerk")
  }
}
