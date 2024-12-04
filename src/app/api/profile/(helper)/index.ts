// This would go in your backend API handler (e.g., `updateUserProfile.ts`)

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const updateUserProfile = async (
  userId: string,
  updatedFields: Record<string, any>,
  role: string
) => {
  try {
    let updatedUser
    if (role == "faculty") {
      updatedUser = await prisma.faculty.update({
        where: { clerkId: userId },
        data: updatedFields
      })
    } else if (role == "student") {
      updatedUser = await prisma.student.update({
        where: { clerkId: userId },
        data: updatedFields
      })
    }
    return updatedUser
  } catch (error) {
    throw new Error(`Error updating user profile, ${error}`)
  }
}

const findUserData = async (userId: string, role: string) => {
  try {
    let User
    if (role == "faculty") {
      User = await prisma.faculty.findUnique({
        where: { clerkId: userId },
        include: {
          Department: true,
          University: true,
          course: true
        }
      })
    } else if (role == "student") {
      User = await prisma.student.findUnique({
        where: { clerkId: userId },
        include: {
          Department: true,
          University: true,
          course: true
        }
      })
    }
    return User
  } catch (error) {
    throw new Error(`Error while getting user in api/(helper)/index ${error}`)
  }
}
export { updateUserProfile, findUserData }
