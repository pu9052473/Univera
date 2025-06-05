import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const {
    slotId,
    lecturerId,
    reason,
    date,
    editingProxyId,
    updateStatusOnly,
    proxyId,
    status
  } = await req.json()

  if (updateStatusOnly && proxyId && status) {
    try {
      const updated = await prisma.proxySlot.update({
        where: { id: Number(proxyId) },
        data: { status }
      })
      return NextResponse.json(
        { message: `Proxy slot ${status.toLowerCase()} successfully`, updated },
        { status: 200 }
      )
    } catch (error) {
      console.error("Error updating proxy slot status:", error)
      return NextResponse.json(
        { error: "Failed to update status" },
        { status: 500 }
      )
    }
  }

  if (!slotId || !lecturerId || !date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    )
  }

  try {
    if (editingProxyId) {
      // Update existing proxy slot
      const updatedProxySlot = await prisma.proxySlot.update({
        where: { id: Number(editingProxyId) },
        data: {
          slotId: Number(slotId),
          lecturerId: String(lecturerId),
          reason: reason || "No reason provided",
          date: String(date)
        }
      })
      return NextResponse.json(
        { message: "Proxy slot updated successfully", updatedProxySlot },
        { status: 200 }
      )
    } else {
      const proxySlot = await prisma.proxySlot.create({
        data: {
          slotId: Number(slotId),
          lecturerId: String(lecturerId),
          reason: reason || "No reason provided",
          status: "PENDING",
          date: String(date)
        }
      })

      return NextResponse.json(
        { message: "Proxy slot created successfully", proxySlot },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error("Error creating proxy slot:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get("userId")
  try {
    if (!userId) {
      return NextResponse.json(
        { message: "Class Id is required" },
        { status: 400 }
      )
    }

    const proxySlots = await prisma.proxySlot.findMany({
      where: {
        OR: [{ slot: { facultyId: userId } }, { lecturerId: userId }]
      },
      include: {
        slot: true
      },
      orderBy: {
        date: "desc"
      }
    })

    return NextResponse.json(proxySlots, { status: 200 })
  } catch (error) {
    console.error("Error fetching proxy slots:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
