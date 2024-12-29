"use client"
import React, { useContext } from "react"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formSchema } from "@/helpers/FormSchema.z"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { UserContext } from "@/context/user"
const CreatePage = () => {
  const { user } = useContext(UserContext)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      totalSemister: 0
    }
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("User not authenticated")
      return
    }

    const payload = {
      ...values,
      userId: user.id, // Clerk's user ID
      department: user?.Department
    }

    try {
      const res = await axios.post(`/api/courses`, payload)
      if (res.status === 200) {
        toast.success(res.data.message)
        router.push(`/courses`)
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input
                      // disabled = {isSubmitting}
                      placeholder="e.g 'BTech CSE'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input
                      // disabled = {isSubmitting}
                      placeholder="e.g 'CSE I'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What is the code of this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalSemister"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semister</FormLabel>
                  <FormControl>
                    <Input
                      type="string"
                      // disabled = {isSubmitting}
                      placeholder="e.g '4'"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value, 10) : ""
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    How many sem does this course has course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/courses">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              {/* <Link href='/'> */}
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
              {/* </Link> */}
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePage
