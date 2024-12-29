import { z } from "zod"

export const classSchema = z.object({
  name: z.string().min(1, { message: "Class Name is required" }),
  code: z.string().min(1, { message: "Class Code is required" }),
  semister: z.number().min(1, { message: "Semister must be grater than 0" })
})
