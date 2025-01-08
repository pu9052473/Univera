import axios from "axios"

export async function getAllLeaveDays(user: any | null) {
  if (!user) {
    return []
  }
  const roles = user.roles.map((r: any) => r.id)
  const isAdmin =
    roles.includes(1) ||
    roles.includes(3) ||
    roles.includes(12) ||
    roles.includes(10) //university_admin, department_admin

  if (!isAdmin) {
    return []
  }
  const res = await axios.get("/api/leave/leaves", {
    params: {
      userId: user.id
    }
  })
  console.log("res; ", res)
  return res.data.leaves
}

export async function getUserLeaveDays(user: any | null) {
  if (!user) {
    return []
  }

  try {
    const res = await axios.get("/api/leave/leaves", {
      params: {
        userEmail: user.email,
        isMyLeaves: true
      }
    })

    return res.data.leaves
  } catch (error) {
    console.error("Error fetching user leave days:", error)
    throw new Error("Error fetching user leave days")
  }
}
