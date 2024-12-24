"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { classSchema } from "@/helpers/classSchema.z"
import { Course } from "@prisma/client"
import { useRouter } from "next/navigation"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { CircleX } from "lucide-react"

interface ClassFormProps {
  courses: any
  departmentId: number
  universityId: number
  courseId: number
}

export default function ClassForm({
  courses,
  departmentId,
  universityId,
  courseId
}: ClassFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      code: "",
      semister: 0
    }
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (data: z.infer<typeof classSchema>) => {
    try {
      const response = await axios.post("/api/classes/create", {
        ...data,
        universityId: universityId,
        departmentId: departmentId,
        courseId: courseId
      })
      if (response.status === 201) {
        toast.success(response.data.message)
        router.push(`/classes`)
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
    <Form {...form}>
      <form
        className="mt-8 max-w-2xl p-6 bg-white shadow-md rounded-lg border border-gray-200"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-xl font-semibold text-gray-800 mb-6">
          Create a New Class
        </h1>

        <div className="grid gap-4">
          {/* Class Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Class Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 'CE 2'"
                    {...field}
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Class Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Class Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 'CSE-1'"
                    {...field}
                    className="focus:ring-2 focus:ring-blue-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Semister */}
          <FormField
            control={form.control}
            name="semister"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Semister</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., '4'"
                    {...field}
                    className="focus:ring-2 focus:ring-blue-400"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value, 10) : ""
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Course */}
          <div>
            <label
              htmlFor="courseId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course
            </label>
            <input
              name="courseId"
              value={courses.find((c: Course) => c.id === courseId)?.name}
              disabled
              className="block w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-x-2 mt-4">
            <ButtonV1
              label="Cancel"
              varient="outline"
              icon={CircleX}
              href="/classes"
            />
            <ButtonV1
              type="submit"
              className="py-5 pl-3 pr-3"
              label={isSubmitting ? "Submitting..." : "Submit"}
              disabled={!isValid || isSubmitting}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
