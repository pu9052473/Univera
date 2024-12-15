import { z } from "zod"

export const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required"
  }),
  code: z.string().min(1, {
    message: "Code is required"
  }),
  totalSemister: z.number().min(1)
})
