import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"
import Image from "next/image"

interface ProfileProps {
  clerkUser: any
  fields: string[]
  defaults: any
  loading: boolean
  onSubmit: (updatedFields: Record<string, string>) => void
}

const initForm = {
  name: "",
  email: "",
  phone: ""
}

const Profile: React.FC<ProfileProps> = ({
  clerkUser,
  fields,
  onSubmit,
  defaults,
  loading
}) => {
  const [isDirty, setIsDirty] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>(initForm)
  useEffect(() => {
    if (defaults) {
      setFormData(
        fields.reduce(
          (acc, field) => {
            acc[field] = defaults[field] || ""
            return acc
          },
          {} as Record<string, string>
        )
      )
    }
  }, [defaults])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
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
    setIsDirty(!isEqual)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingField) return

    const updatedFields = {
      [editingField]: formData[editingField]
    }

    if (formData[editingField] !== defaults[editingField]) {
      onSubmit(updatedFields)
      setIsDirty(false)
      setEditingField(null)
    } else {
      console.log("No changes detected")
    }
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 sm:p-10 bg-gray-100">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-10 space-y-6 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-gray-800 text-center md:text-left">
              {defaults && defaults.name}&#39;s Profile
            </h1>
            <div
              className="relative h-24 w-24 rounded-full shadow-lg overflow-hidden bg-gray-200 
                         transition-transform duration-300 hover:scale-105 
                         focus-within:ring-2 focus-within:ring-blue-400"
            >
              <Image
                src={clerkUser?.imageUrl ?? "/user.jpg"}
                className="object-cover h-full w-full"
                height={96}
                width={96}
                alt="Profile"
                priority
              />
            </div>
          </div>
          <div className="text-center md:text-right text-gray-600 space-y-2">
            <p>
              Last Updated:{" "}
              {defaults &&
                new Date(defaults.updatedAt).toISOString().split("T")[0]}
            </p>
            <p className="text-sm">Manage your personal information</p>
          </div>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full bg-white p-6 md:p-10 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          {fields.includes("name") && (
            <EditableInputField
              key={"name"}
              label={"Name"}
              placeholder={"Enter your Name"}
              name={"name"}
              value={formData["name"]}
              onChange={handleChange}
              isEditing={editingField === "name"}
              setEditingField={setEditingField}
              isDirty={isDirty}
              className="border rounded-lg p-3 transition-all duration-300"
            />
          )}
          {fields.includes("phone") && (
            <EditableInputField
              key={"phone"}
              label={"Phone number"}
              placeholder={"Enter your Phonenumber"}
              name={"phone"}
              value={formData["phone"]}
              onChange={handleChange}
              isEditing={editingField === "phone"}
              setEditingField={setEditingField}
              isDirty={isDirty}
              className="border rounded-lg p-3 transition-all duration-300"
            />
          )}
          {fields.includes("email") && (
            <EditableInputField
              key={"email"}
              label={"Email"}
              placeholder={"Enter your email"}
              name={"email"}
              value={formData["email"]}
              onChange={handleChange}
              isEditing={editingField === "email"}
              disabled={true}
              setEditingField={setEditingField}
              isDirty={isDirty}
              className="border rounded-lg p-3 transition-all duration-300"
            />
          )}

          <div className="col-span-2 flex flex-col sm:flex-row justify-between items-center mt-6">
            <p
              className={`mb-4 sm:mb-0 text-sm ${
                isDirty ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {isDirty ? "You have unsaved changes" : ""}
            </p>
            <Submit
              disabled={!isDirty}
              className={`w-full sm:w-auto px-6 py-3 font-medium rounded-lg transition-all ${
                !isDirty
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              loading={loading}
              label={isDirty ? "Save Changes" : "No Changes"}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
