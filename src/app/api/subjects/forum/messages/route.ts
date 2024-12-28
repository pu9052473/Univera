import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Reusable function to fetch messages by forumId
async function fetchMessagesByForumId(forumId: number) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { forumId: forumId },
      orderBy: { createdAt: "asc" }
    })
    return messages
  } catch (error) {
    throw new Error(`Failed to fetch messages from the database: ${error}`)
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const forumId = searchParams.get("forumId")

  try {
    if (!forumId) {
      return new Response(JSON.stringify({ error: "forumId is required" }), {
        status: 400
      })
    }

    // call fetchMessagesByForumId to get messages using given forumId
    const messages = await fetchMessagesByForumId(parseInt(forumId))

    return new Response(JSON.stringify(messages), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: `Failed to fetch messages @api/erp/forum/messages ${error}`
      }),
      { status: 500 }
    )
  }
}

// POST function for saving new messages and avoiding duplicates
export async function POST(req: Request) {
  const user = await currentUser()
  const role = user?.publicMetadata.role

  //check user authorization
  if (role !== "authority" && role !== "faculty" && role !== "student") {
    return NextResponse.json(
      { message: "You are not allowed to create a messages" },
      {
        status: 401
      }
    )
  }

  try {
    const { selectedForumId, processedMessages } = await req.json()

    if (!processedMessages || !Array.isArray(processedMessages)) {
      throw new Error("Invalid or missing 'messages' in request")
    }

    // Fetch existing message IDs for the given forumId
    const existingMessages = await fetchMessagesByForumId(
      Number(selectedForumId)
    )

    // Create a set of existing message IDs
    const existingMessageIds = new Set(existingMessages.map((msg) => msg.id))

    // Filter out any messages that already exist in the database
    const newMessages = processedMessages.filter(
      (msg: any) => !existingMessageIds.has(msg.id)
    )

    // If there are new messages, insert them into the database
    if (newMessages.length > 0) {
      await prisma.chatMessage.createMany({
        data: newMessages.map((msg: any) => ({
          message: msg.message,
          userId: msg.userId,
          forumId: Number(msg.forumId),
          attachments: msg.attachments
        }))
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.log("Failed to save message @api/erp/forum/messages", error)
    return new Response(
      JSON.stringify({
        message: `Failed to save message`
      }),
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  const user = await currentUser()
  const role = user?.publicMetadata.role

  //check user authorization
  if (role !== "authority" && role !== "faculty" && role !== "student") {
    return NextResponse.json(
      { message: "You are not allowed to delete a messages" },
      {
        status: 401
      }
    )
  }

  try {
    const { forumId, messageIds } = await req.json()

    if (!forumId || !Array.isArray(messageIds)) {
      throw new Error("Invalid or missing 'messages' in request")
    }

    // Fetch existing message IDs for the given forumId
    const existingMessages = await fetchMessagesByForumId(Number(forumId))

    // Create a set of existing message IDs
    const existingMessageIds = new Set(existingMessages.map((msg) => msg.id))

    // Filter out message IDs that are not in the database
    const messagesToDelete = messageIds.filter((id) =>
      existingMessageIds.has(id)
    )

    if (messagesToDelete.length > 0) {
      // Delete only messages that exist in the database
      await prisma.chatMessage.deleteMany({
        where: {
          forumId: Number(forumId),
          id: { in: messageIds }
        }
      })
    }

    return new Response(
      JSON.stringify({ message: "Messages deleted successfully" }),
      {
        status: 200
      }
    )
  } catch (error) {
    console.log("Failed to delete message @api/erp/forum/messages", error)
    return new Response(
      JSON.stringify({
        message: `Failed to delete message ${error}`
      }),
      { status: 500 }
    )
  }
}
