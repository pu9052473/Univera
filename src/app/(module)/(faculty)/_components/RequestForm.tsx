"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { DropdownInput } from "@/components/(commnon)/EditableInputField"
import { leaveTypes } from "@/lib/dummy-data"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Prisma, Balances } from "@prisma/client"
import toast from "react-hot-toast"
import { useState } from "react"
import DialogWrapper from "./DialogWrapper"
import { Loader2, Calendar } from "lucide-react"

type userWithRelation = Prisma.UserGetPayload<{
  include: {
    balances: true
  }
}>

type Props = {
  user: userWithRelation
  refetch: () => void
  balance: Balances[]
}

const RequestForm = ({ user, refetch, balance }: Props) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    notes: z.string().max(500),
    leave: z.string({
      required_error: "Please select a leave type"
    }),
    startDate: z.string({
      required_error: "Start date is required"
    }),
    endDate: z.string({
      required_error: "End date is required"
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: ""
    }
  })

  async function validateData(
    values: z.infer<typeof formSchema>,
    setError: (
      name: keyof z.infer<typeof formSchema>,
      error: { type: string; message: string }
    ) => void
  ) {
    const balances = balance[0]
    if (!balances) {
      setError("leave", {
        type: "manual",
        message: "User balances are not available"
      })
      return false
    }

    let isValid = true
    const startDate = new Date(values.startDate)
    const endDate = new Date(values.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError("startDate", {
        type: "manual",
        message: "Invalid date format"
      })
      return false
    }

    const leaveDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1
    )

    if (leaveDays <= 0) {
      setError("endDate", {
        type: "manual",
        message: "End date must be after start date"
      })
      isValid = false
    }

    const leaveTypeToBalanceKey: Record<string, keyof typeof balances> = {
      ANNUAL: "annualAvailable",
      CASUAL: "casualAvailable",
      SPECIAL: "specialAvailable",
      HEALTH: "healthAvailable",
      MATERNITY: "maternityAvailable",
      PATERNITY: "paternityAvailable",
      UNPAID: "unpaidUsed"
    }

    const balanceKey = leaveTypeToBalanceKey[values.leave.toUpperCase()]
    if (!balanceKey) {
      setError("leave", {
        type: "manual",
        message: "Invalid leave type"
      })
      isValid = false
    }

    const availableCredit = balances[balanceKey] || 0
    if (
      values.leave.toUpperCase() !== "UNPAID" &&
      leaveDays > Number(availableCredit)
    ) {
      setError("leave", {
        type: "manual",
        message: `Only ${availableCredit} days available for ${values.leave} leave`
      })
      isValid = false
    }
    return isValid
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate,
        endDate: values.endDate,
        user
      }

      const isValid = await validateData(values, form.setError)
      if (!isValid) {
        setIsSubmitting(false)
        return
      }

      const res = await fetch(
        `/api/leave/leaves?departmentId=${user.departmentId}`,
        {
          method: "POST",
          body: JSON.stringify(formattedValues)
        }
      )

      const body = await res.json()
      if (res.ok) {
        toast.success(body.message, { duration: 4000 })
        setOpen(false)
        refetch()
        form.reset()
      } else {
        toast.error(body.message, { duration: 6000 })
      }
    } catch (err) {
      console.error(err)
      toast.error("An unexpected error occurred")
    }
    setIsSubmitting(false)
  }

  return (
    <DialogWrapper
      btnTitle="Apply for Leave"
      title="Submit Leave Application"
      descr="Please verify your selected dates before submission"
      isBtn={true}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="leave"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-semibold">
                    Leave Type
                  </FormLabel>
                  <div className="mt-1.5">
                    <DropdownInput
                      label=""
                      options={leaveTypes.map((leave) => ({
                        value: leave.value,
                        label: leave.label
                      }))}
                      placeholder="Select leave type"
                      value={field.value}
                      onChange={(selected) =>
                        form.setValue("leave", selected.value)
                      }
                      name="leave"
                    />
                  </div>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Start Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          name={field.name}
                          type="date"
                          className="h-10 pl-10"
                          onChange={(e) => field.onChange(e)}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      End Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          name={field.name}
                          type="date"
                          className="h-10 pl-10"
                          onChange={(e) => field.onChange(e)}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes to support your leave request..."
                      className="min-h-[120px] resize-none mt-1.5 p-3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs mt-1.5 text-gray-500">
                    Please provide any relevant details or documentation
                    requirements
                  </FormDescription>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto order-1 sm:order-none"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Applying...</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  )
}

export default RequestForm
