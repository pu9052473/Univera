import { findUserData, updateUserProfile } from "./(helper)"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  try {
    const { userId, updatedFields, role } = await req.json()
    const updatedUser = await updateUserProfile(userId, updatedFields, role)
    if (!updatedUser) {
      throw new Error("Error while updating user profile")
    }
    return NextResponse.json(
      { message: "User profile updated succesfully", updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error in PATCH api/profile", error)
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId") as string
    const role = searchParams.get("role") as string

    const User = await findUserData(userId, role)

    if (!User) {
      throw new Error("User not found")
    }
    return NextResponse.json({ message: "User Found", User }, { status: 200 })
  } catch (error) {
    console.log("Error in Get api/profile", error)
    return NextResponse.json(
      { message: "Error while getting user data" },
      { status: 500 }
    )
  }
}
