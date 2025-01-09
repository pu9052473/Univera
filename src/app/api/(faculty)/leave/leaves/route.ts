import { NextRequest, NextResponse } from "next/server"
import { differenceInDays, parseISO } from "date-fns"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

type SubmittedLeave = {
  notes: string
  leave: string
  startDate: string
  endDate: string
  user: {
    email: string
    image: string
    name: string
    role: string
  }
}

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json(
      { message: "You are not allowed to make a leave" },
      {
        status: 405
      }
    )
  }

  try {
    const body: SubmittedLeave = await req.json()
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get("departmentId")
    const { startDate, endDate, leave, notes, user } = body

    const startDateObj = parseISO(startDate)
    const endDateObj = parseISO(endDate)
    const calcDays = differenceInDays(endDateObj, startDateObj) + 1
    if (!departmentId) {
      throw new Error("Cannot find departmentId")
    }

    const existingLeave = await prisma.leave.findFirst({
      where: {
        startDate,
        endDate,
        userEmail: user.email
      }
    })

    if (existingLeave) {
      return NextResponse.json(
        { message: "Leave entry already exists" },
        { status: 400 }
      )
    }

    //check if balance is there or not
    const existingBalance = await prisma.balances.findUnique({
      where: { email: user.email }
    })
    if (!existingBalance) {
      return NextResponse.json(
        { message: "No balance data found" },
        { status: 400 }
      )
    }

    // Adjust balances dynamically based on leave type
    if (leave === "ANNUAL") {
      const annualAvailable = existingBalance.annualAvailable ?? 0
      const annualUsed = existingBalance.annualUsed ?? 0

      if (annualAvailable < calcDays) {
        return NextResponse.json(
          { message: "Insufficient annual leave balance" },
          { status: 400 }
        )
      }

      await prisma.balances.update({
        where: { email: user.email },
        data: {
          annualAvailable: annualAvailable - calcDays,
          annualUsed: annualUsed + calcDays
        }
      })
    } else if (leave === "HEALTH") {
      const healthAvailable = existingBalance.healthAvailable ?? 0
      const healthUsed = existingBalance.healthUsed ?? 0

      if (healthAvailable < calcDays) {
        return NextResponse.json(
          { message: "Insufficient health leave balance" },
          { status: 400 }
        )
      }
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          healthAvailable: healthAvailable - calcDays,
          healthUsed: healthUsed + calcDays
        }
      })
    } else if (leave === "MATERNITY") {
      const maternityAvailable = existingBalance.maternityAvailable ?? 0
      const maternityUsed = existingBalance.maternityUsed ?? 0

      if (maternityAvailable <= calcDays) {
        return NextResponse.json(
          { message: "Insufficient maternity leave balance" },
          { status: 400 }
        )
      }
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          maternityAvailable: maternityAvailable - calcDays,
          maternityUsed: maternityUsed + calcDays
        }
      })
    } else if (leave === "PATERNITY") {
      const paternityAvailable = existingBalance.paternityAvailable ?? 0
      const paternityUsed = existingBalance.paternityUsed ?? 0
      if (paternityAvailable < calcDays) {
        return NextResponse.json(
          { message: "Insufficient paternity leave balance" },
          { status: 400 }
        )
      }
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          paternityAvailable: paternityAvailable - calcDays,
          paternityUsed: paternityUsed + calcDays
        }
      })
    } else if (leave === "SPECIAL") {
      const specialAvailable = existingBalance.specialAvailable ?? 0
      const specialUsed = existingBalance.specialUsed ?? 0

      if (specialAvailable < calcDays) {
        return NextResponse.json(
          { message: "Insufficient special leave balance" },
          { status: 400 }
        )
      }
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          specialAvailable: specialAvailable - calcDays,
          specialUsed: specialUsed + calcDays
        }
      })
    } else if (leave === "CASUAL") {
      const casualAvailable = existingBalance.casualAvailable ?? 0
      const casualUsed = existingBalance.casualUsed ?? 0

      if (casualAvailable < calcDays) {
        return NextResponse.json(
          { message: "Insufficient casual leave balance" },
          { status: 400 }
        )
      }
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          casualAvailable: casualAvailable - calcDays,
          casualUsed: casualUsed + calcDays
        }
      })
    } else if (leave === "UNPAID") {
      const unpaidUsed = existingBalance.unpaidUsed ?? 0
      await prisma.balances.update({
        where: { email: user.email },
        data: {
          unpaidUsed: unpaidUsed + calcDays
        }
      })
    } else {
      return NextResponse.json(
        { message: "Invalid leave type provided" },
        { status: 400 }
      )
    }

    const department = await prisma.department.findFirst({
      where: { id: Number(departmentId) }
    })

    const authorityIds = []
    if (department?.principalId) {
      authorityIds.push(department?.principalId)
    }
    if (department?.deanId) {
      authorityIds.push(department?.deanId)
    }
    const year = new Date().getFullYear().toString()
    await prisma.leave.create({
      data: {
        startDate,
        endDate,
        userEmail: user.email,
        type: leave,
        userNote: notes,
        userName: user.name,
        days: calcDays,
        year,
        moderator: {
          connect: authorityIds.map((id) => ({ id }))
        }
      }
    })

    return NextResponse.json({ message: "Leave Submitted" }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = await new URL(req.url)
    const userId = await searchParams.get("userId")
    const isMyLeaves = await searchParams.get("isMyLeaves")
    const userEmail = await searchParams.get("userEmail")

    if (isMyLeaves) {
      if (!userEmail) {
        throw new Error("Cannot find userEmail")
      }
      const MyLeaves = await prisma.leave.findMany({
        where: { userEmail: userEmail }
      })

      return NextResponse.json(
        { message: "Found Leaves", leaves: MyLeaves },
        {
          status: 200
        }
      )
    }

    if (!userId) {
      throw new Error("Cannot find userId")
    }
    const leaves = await prisma.leave.findMany({
      where: {
        moderator: {
          some: {
            id: userId
          }
        }
      },
      include: {
        moderator: true
      },
      orderBy: [{ createdAt: "desc" }]
    })
    if (!leaves) {
      return NextResponse.json(
        { message: "Can't Find Leave data" },
        {
          status: 404
        }
      )
    }
    return NextResponse.json(
      { message: "Found leaves", leaves },
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
