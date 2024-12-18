/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const roles = await prisma.role.findMany()
    if (roles.length == 0) {
      throw new Error("No roles found")
    }
    return NextResponse.json(
      { message: "Found roles", roles },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("Error getting roles @api/role:", error)
    return NextResponse.json("Error getting roles", {
      status: 500
    })
  }
}
