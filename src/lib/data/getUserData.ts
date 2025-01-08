import prisma from "@/lib/prisma"

export async function getAllUsers(user: any) {
  if (!user) {
    return []
  }
  const roles = user.roles.map((r: any) => r.id)
  const isAdmin = roles.includes(1) || roles.includes(3) //university_admin, department_admin

  if (!isAdmin) {
    return []
  }
  try {
    const usersData = await prisma.user.findMany({
      orderBy: [{ name: "desc" }]
    })

    return usersData
  } catch (error: any) {
    console.error("Error fetching all users:", error)
    throw new Error("Error fetching all users")
  }
}
