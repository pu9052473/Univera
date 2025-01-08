"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { IoPencil } from "react-icons/io5"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import { leaveStatus } from "@/lib/dummy-data"
import { useState } from "react"
import DialogWrapper from "../../_components/DialogWrapper"
import { DropdownInput } from "@/components/(commnon)/EditableInputField"

type EditLeaveProps = {
  id: string
  days: number
  type: string
  year: string
  email: string
  user: string
  startDate: string
  userId: string
  userName: string
  refetch: () => void
}

const EditLeave = ({
  id,
  days,
  type,
  year,
  email,
  user,
  userId,
  userName,
  startDate,
  refetch
}: EditLeaveProps) => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const formSchema = z.object({
    notes: z.string().max(500),

    status: z.enum(leaveStatus)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: ""
    }
  })

  async function editLeave(values: z.infer<typeof formSchema>) {
    try {
      const formValues = {
        ...values,
        notes: values.notes,
        status: values.status,
        id,
        days,
        type,
        year,
        email,
        user,
        userName,
        userId: userId,
        startDate
      }
      setSubmitting(true)
      const res = await fetch(`/api/leave/leaves/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formValues)
      })

      if (res.ok) {
        toast.success("Edit Successful", { duration: 4000 })
        setOpen(false)
        refetch()
      } else {
        toast.error(`An error occured`, { duration: 6000 })
      }
    } catch (error) {
      console.error(error)
      toast.error("An Unexpected error occured")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DialogWrapper
      icon={IoPencil}
      title="Edit Leave"
      isBtn={false}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(editLeave)} className="space-y-8">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Make a Decision</FormLabel>
                <DropdownInput
                  label="Leave Type"
                  options={leaveStatus.map((leave) => ({
                    value: leave,
                    label: leave
                  }))}
                  placeholder="Select a leave"
                  value={field.value}
                  onChange={(selected: any) =>
                    form.setValue("status", selected.value)
                  }
                  name="status"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Notes" {...field} />
                </FormControl>
                <FormDescription>
                  Add extra notes to support your decision.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button id="leave-update" type="submit">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </DialogWrapper>
  )
}

export default EditLeave
