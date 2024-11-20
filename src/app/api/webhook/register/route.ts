import { Webhook } from "svix"
import { headers } from "next/headers"

import { WebhookEvent } from "@clerk/nextjs/server"

import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const webHook_Secret = process.env.NEXT_PUBLIC_WEBHOOK_SECRET
  if (!webHook_Secret) {
    throw new Error("Please add webhook secret in env")
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured - no svix headers")
  }

  const payload = await req.json()
  if (!payload || typeof payload !== "object") {
    return new Response("Invalid payload received", { status: 400 })
  }
  console.log("Received Payload:", payload)

  const body = JSON.stringify(payload)

  const wh = new Webhook(webHook_Secret)

  let event: WebhookEvent
  //event has many chances of failure so we are blocking it in try catch
  try {
    // Throws on error, returns the verified content on success
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent
  } catch (e) {
    console.error("Error verifying Webhook: ", e)
    return new Response("Error occured", { status: 400 })
  }

  //extracting data from event
  const eventType = event.type

  //handling events
  if (eventType === "user.created") {
    console.log("User created Webhook")

    try {
      const {
        id,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name
      } = event.data
      console.log(
        "id, email_addresses, primary_email_address_id, first_name, last_name: ",
        id,
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name
      )

      //log practice
      const primaryEmail = email_addresses.find(
        (email) => email.id === primary_email_address_id
      )

      if (!primaryEmail) {
        return new Response("No primary email found", { status: 400 })
      }
      const oldUser = await prisma.user.findFirst({
        where: { email: primaryEmail.email_address }
      })
      if (!oldUser) {
        const newUser = await prisma.user.create({
          data: {
            clerkId: id,
            id: id,
            email: primaryEmail.email_address,
            role: "USER"
          }
        })
        console.log("User created in DB", newUser)
      } else {
        console.log("user already in database") //not to create when user is already in data base
      }
    } catch (error) {
      console.error(
        "Error creating user in database:",
        error instanceof Error ? error.message : error
      )
      return new Response("Error creating user in database", { status: 400 })
    }
  }
  //returing a success response to the webhook provider
  return new Response("Webhook recieved successfully", { status: 200 })
}
