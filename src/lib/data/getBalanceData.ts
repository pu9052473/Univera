import axios from "axios"

export async function getAllBalances(user: any | null) {
  if (!user) {
    return []
  }

  const roles = user.roles.map((r: any) => r.id)
  const isAdmin =
    roles.includes(1) ||
    roles.includes(3) ||
    roles.includes(12) ||
    roles.includes(10)

  if (!isAdmin) {
    return []
  }
  // api call of get
  const res = await axios.get("/api/leave/balance", {
    params: {
      userId: user.id,
      isModerator: true
    }
  })
  return res.data.balance
}

export async function getUserBalances(user: any | null) {
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
