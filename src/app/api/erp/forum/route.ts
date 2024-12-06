import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: `Only POST requests are allowed ` }),
        { status: 405 }
      )
    }

    const { name, departmentId, courseId, year, userId, status } =
      await req.json()

    if (!name || !departmentId || !courseId || !year || !userId || !status) {
      console.error("Validation failed. Missing required fields.")
      return new Response(
        JSON.stringify({ error: "Missing required fields @api/erp/forum" }),
        { status: 400 }
      )
    }

    const forum = await prisma.forum.create({
      data: {
        name,
        departmentId,
        courseId,
        year,
        userId,
        status
      }
    })

    console.log("Forum created successfully:", forum)
    return new Response(JSON.stringify(forum), { status: 201 })
  } catch (error: any) {
    console.error(
      "Error while creating forum @api/erp/forum:",
      error.message,
      error
    )
    return new Response(
      JSON.stringify({
        error: "Failed to create forum @api/erp/forum",
        details: error.message
      }),
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const forums = await prisma.forum.findMany()

    return new Response(JSON.stringify(forums), { status: 200 })
  } catch (error) {
    console.log(`Failed to fetch forum @api/erp/forum ${error}`)
    return new Response(
      JSON.stringify({
        error: `Failed to fetch forum @api/erp/forum ${error}`
      }),
      { status: 500 }
    )
  }
}
