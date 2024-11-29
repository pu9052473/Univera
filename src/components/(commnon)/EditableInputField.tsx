"use client"

import React, { useState } from "react"
import { FiEdit } from "react-icons/fi"

interface EditableInputFieldProps {
  label: string
  placeholder: string
  value?: string
  onSave?: (newValue: string) => void
}

export function EditableInputField({
  label,
  placeholder,
  value = "",
  onSave
}: EditableInputFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const toggleEdit = () => {
    if (isEditing && onSave) {
      onSave(inputValue)
    }
    setIsEditing(!isEditing)
  }

  return (
    <div>
      <label className="block font-medium">{label}</label>
      <div
        className={`flex items-center border-b ${isEditing ? "border-blue-500" : "border-gray-300"}`}
      >
        <input
          className={`flex-grow placeholder-gray-400 bg-transparent outline-none ${isEditing ? "" : "cursor-not-allowed"}`}
          placeholder={placeholder}
          value={inputValue}
          disabled={!isEditing}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={toggleEdit}>
          <FiEdit
            className={`text-gray-500 transition-colors ${isEditing ? "text-blue-500" : ""}`}
          />
        </button>
      </div>
    </div>
  )
}
