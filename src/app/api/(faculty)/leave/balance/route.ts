import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

type SubmittedCredits = {
  annual: number
  health: number
  casual: number
  special: number
  maternity: number
  paternity: number
  unpaid: number
  email: string
  year: string
  name: string
}

export async function POST(req: Request) {
  try {
    const body: SubmittedCredits = await req.json()
    const {
      annual,
      health,
      maternity,
      paternity,
      casual,
      special,
      year,
      email,
      name
    } = body

    const existingCredits = await prisma.balances.findFirst({
      where: {
        year,
        email
      }
    })

    if (existingCredits) {
      return NextResponse.json(
        { message: "Credits for the current period already exists" },
        { status: 400 }
      )
    }
    await prisma.balances.create({
      data: {
        name,
        email,
        year,
        specialCredit: special,
        casualCredit: casual,
        annualCredit: annual,
        healthCredit: health,
        maternityCredit: maternity,
        paternityCredit: paternity,

        specialAvailable: special,
        casualAvailable: casual,
        annualAvailable: annual,
        healthAvailable: health,
        maternityAvailable: maternity,
        paternityAvailable: paternity
      }
    })

    return NextResponse.json(
      { message: "Balance Added succesfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = await new URL(req.url)
    const userId = await searchParams.get("userId")
    const isMyBalances = await searchParams.get("isMyBalances")
    const isModerator = await searchParams.get("isModerator")
    const departmentId = await searchParams.get("departmentId")
    const email = await searchParams.get("email")

    if (isMyBalances) {
      if (!email) {
        throw new Error("Cannot find email")
      }
      const MyBalances = await prisma.balances.findMany({
        where: { email: email }
      })

      return NextResponse.json(
        { message: "Found Balances", balances: MyBalances },
        {
          status: 200
        }
      )
    }

    if (isModerator) {
      if (!departmentId) {
        throw new Error("Cannot find departmentId")
      }
      const Department = await prisma.department.findUnique({
        where: {
          id: Number(departmentId)
        },
        include: {
          faculties: {
            include: {
              user: {
                include: {
                  balances: true
                }
              }
            }
          }
        }
      })
      const balancesArray =
        Department?.faculties.flatMap((faculty) => faculty.user.balances) || []
      return NextResponse.json(
        {
          message: "Found users balances",
          faculties: Department?.faculties,
          balances: balancesArray
        },
        {
          status: 200
        }
      )
    }

    if (!userId) {
      throw new Error("Cannot find userId")
    }

    const balance = await prisma.balances.findMany({
      where: {
        user: {
          id: userId
        }
      }
    })
    if (!balance) {
      return NextResponse.json(
        { message: "Can't Find balance data" },
        {
          status: 404
        }
      )
    }
    return NextResponse.json(
      { message: "Found leaves", balance },
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error("Error getting balances @api/leave/balance: ", error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
