import React, { useState } from "react"
import { FiEdit } from "react-icons/fi"

interface EditableInputFieldProps {
  label: string
  placeholder: string
  value?: string
  name?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EditableInputField({
  label,
  placeholder,
  value,
  name,
  onChange
}: EditableInputFieldProps) {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e) // Propagate the change to the parent component
    }
  }

  return (
    <div className="flex justify-center flex-col gap-1 h-full w-full">
      <label className="block font-medium">{label}</label>
      <div
        className={`flex items-center border-b ${isEditing ? "border-blue-500" : "border-gray-300"} w-full`}
      >
        <input
          className={`w-full placeholder-gray-400 bg-transparent outline-none ${isEditing ? "" : "cursor-not-allowed"}`}
          placeholder={placeholder}
          value={value}
          name={name}
          disabled={!isEditing}
          onChange={handleChange}
        />
        <FiEdit
          onClick={toggleEdit}
          className={`cursor-pointer h-4 w-4 transition-colors ${isEditing ? "text-blue-500" : "text-black"}`}
        />
      </div>
    </div>
  )
}
