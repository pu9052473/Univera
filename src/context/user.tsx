"use client"
import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useMemo
} from "react"
import { useUser } from "@clerk/nextjs"

interface User {
  id: string
  role: { id: number; roleName: string }[]
  [key: string]: any
}

interface UserContextType {
  user: User | null
  dispatch: React.Dispatch<any>
}

export const UserContext = createContext<UserContextType>({
  user: null,
  dispatch: () => {}
})

const UserReducer = (
  state: User | null,
  action: { type: string; user: User | null }
) => {
  switch (action.type) {
    case "SET_USER":
      return action.user
    default:
      return state
  }
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, null)
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.publicMetadata.role && user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true)
          setError(null)

          const response = await fetch(
            `/api/profile?role=${user.publicMetadata.role}&userId=${user.id}`
          )

          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`)
          }

          const data = await response.json()
          console.log("data from context", data)
          dispatch({ type: "SET_USER", user: data.User })
        } catch (err) {
          console.log(`Error fetching user data @context/user: ${err}`)

          setError("Failed to load user data.")
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [user])

  const contextValue = useMemo(
    () => ({ user: state, dispatch }),
    [state, dispatch]
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}
