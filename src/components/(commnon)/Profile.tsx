import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import Image from "next/image"

// Define the types for the profile fields and the form data
interface ProfileProps {
  clerkUser: any
  fields: string[]
  defaults: any
  onSubmit: (updatedFields: Record<string, string>) => void
}

const Profile: React.FC<ProfileProps> = ({
  clerkUser,
  fields,
  onSubmit,
  defaults
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false)

  // Initialize form data with an empty string for each field
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce(
      (acc, field) => {
        acc[field] = ""
        return acc
      },
      {} as Record<string, string>
    )
  )

  useEffect(() => {
    if (defaults) {
      // Update formData with the fetched defaults
      setFormData((prevData) => {
        const updatedData = { ...prevData }
        Object.keys(prevData).forEach((key) => {
          if (defaults[key] !== undefined) {
            updatedData[key] = defaults[key]
          }
        })
        return updatedData
      })
    }
  }, [defaults])

  // Handle input change for all fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    const defaultValue = defaults[name]

    const isEqual = (() => {
      // Handle null/undefined
      if (defaultValue === null || value === null) {
        return defaultValue === value
      }

      // Handle number/string conversion
      if (typeof defaultValue === "number" && typeof value === "string") {
        return defaultValue.toString() === value
      }

      // Default case
      return defaultValue === value
    })()
    console.log("isEqual: ", isEqual)

    if (!isDirty) setIsDirty(!isEqual)

    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Filter out fields that are different from defaults and not empty
    const updatedFields = Object.keys(formData)
      .filter(
        (field) => formData[field] !== "" && formData[field] !== defaults[field]
      )
      .reduce(
        (acc, field) => {
          acc[field] = formData[field]
          return acc
        },
        {} as Record<string, string>
      )

    // Only submit if there are updated fields
    if (Object.keys(updatedFields).length > 0) {
      // Pass updated fields to the onSubmit function
      onSubmit(updatedFields)
    } else {
      console.log("No changes detected")
    }
  }

  console.log(clerkUser)

  return (
    <div className="flex flex-col items-center w-full p-10">
      <div className="flex flex-col w-full items-center lg:items-start mb-10">
        <h1 className="text-2xl font-bold mb-2.5">
          {defaults.name}&#39; profile
        </h1>
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <Image
            src={clerkUser.imageUrl}
            className="h-full w-full rounded-full"
            height={40}
            width={40}
            alt="👤"
          />
        </div>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl"
        onSubmit={handleSubmit}
      >
        {fields.includes("name") && (
          <EditableInputField
            label="Full Name"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        {fields.includes("email") && (
          <EditableInputField
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        )}
        {fields.includes("address") && (
          <EditableInputField
            label="Address"
            placeholder="Enter your address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        )}
        {fields.includes("phone") && (
          <EditableInputField
            label="Contact Number"
            placeholder="Enter your contact number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        )}
        {fields.includes("salary") && (
          <EditableInputField
            label="Salary"
            placeholder="Enter your salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        )}
        {fields.includes("department") && (
          <EditableInputField
            label="Department"
            placeholder="Enter your department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        )}
        {fields.includes("role") && (
          <EditableInputField
            label="Role"
            placeholder="Enter your role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
        )}
        {fields.includes("qualification") && (
          <EditableInputField
            label="Qualification"
            placeholder="Enter your qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
          />
        )}
        {fields.includes("newPassword") && (
          <EditableInputField
            label="New Password"
            placeholder="Enter your new password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        )}
        <div className="col-span-2 flex justify-center sm:justify-start mt-10">
          <Submit
            disabled={!isDirty}
            className={`px-4 bg-blue-600 text-white rounded-md ${!isDirty ? "cursor-not-allowed" : ""}`}
          />
        </div>
      </form>
    </div>
  )
}

export default Profile
