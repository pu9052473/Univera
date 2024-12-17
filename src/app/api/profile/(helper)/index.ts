// This would go in your backend API handler (e.g., `updateUserProfile.ts`)

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const updateUserProfile = async (
  userId: string,
  updatedFields: Record<string, any>
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: updatedFields
    })

    return updatedUser
  } catch (error) {
    throw new Error(`Error updating user profile, ${error}`)
  }
}

const findUserData = async (userId: string) => {
  try {
    const User = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        roles: true,
        faculty: true,
        student: true,
        course: true,
        university: true
      }
    })
    return User
  } catch (error) {
    throw new Error(`Error while getting user in api/(helper)/index ${error}`)
  }
}
export { updateUserProfile, findUserData }
