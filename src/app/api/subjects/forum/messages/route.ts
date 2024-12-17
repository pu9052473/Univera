import prisma from "@/lib/prisma"

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
  try {
    const { selectedForumId, localMessages } = await req.json()

    // Fetch existing message IDs for the given forumId
    const existingMessages = await fetchMessagesByForumId(
      Number(selectedForumId)
    )

    // Create a set of existing message IDs
    const existingMessageIds = new Set(existingMessages.map((msg) => msg.id))

    // Filter out any messages that already exist in the database
    const newMessages = localMessages.filter(
      (msg: any) => !existingMessageIds.has(msg.id)
    )

    // If there are new messages, insert them into the database
    if (newMessages.length > 0) {
      await prisma.chatMessage.createMany({
        data: newMessages.map((msg: any) => ({
          message: msg.message,
          userId: msg.userId,
          forumId: Number(msg.forumId)
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
        error: `Failed to save message @api/erp/forum/messages ${error}`
      }),
      { status: 500 }
    )
  }
}
