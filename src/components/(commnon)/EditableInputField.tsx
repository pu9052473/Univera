import clsx from "clsx"
import React from "react"
import toast from "react-hot-toast"
import { FiEdit } from "react-icons/fi"

interface EditableInputFieldProps {
  label: string
  placeholder: string
  value: string | number
  name: string
  className?: string
  isEditing: boolean
  disabled?: boolean
  setEditingField: (field: string | null) => void
  isDirty?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function EditableInputField({
  label,
  placeholder,
  value,
  name,
  className,
  isEditing,
  setEditingField,
  onChange,
  disabled,
  isDirty
}: EditableInputFieldProps) {
  const toggleEdit = () => {
    if (disabled) {
      toast.error("Can't update this field", {
        style: {
          background: "#ffc107",
          color: "#112C71"
        }
      })
      return
    }
    if (!isDirty) {
      setEditingField(isEditing ? null : name)
    }
  }

  const FieldClass = clsx(
    "w-full placeholder-gray-400 bg-transparent outline-none focus:ring-0",
    {
      "cursor-not-allowed text-gray-500": !isEditing,
      "text-black": isEditing
    },
    className
  )

  return (
    <div className="flex flex-col gap-2 w-full max-w-md shrink min-w-[100px]">
      <label className="block font-semibold text-gray-700">{label}</label>
      <div
        className={clsx(
          "flex items-center rounded-md border px-3 py-2 transition-colors",
          {
            "border-blue-500 shadow-md": isEditing,
            "border-gray-300 hover:border-gray-400": !isEditing
          }
        )}
      >
        <input
          className={FieldClass}
          placeholder={placeholder}
          value={value}
          name={name}
          disabled={!isEditing}
          onChange={onChange}
        />
        <FiEdit
          onClick={toggleEdit}
          className={clsx(
            "ml-2 cursor-pointer transition-transform transform",
            {
              "text-blue-500 hover:scale-110": isEditing,
              "text-gray-500 hover:text-gray-700 hover:scale-105": !isEditing
            }
          )}
          size={18}
        />
      </div>
      {isEditing && (
        <span className="text-sm text-gray-500">
          Update your {label} and submit to save.
        </span>
      )}
    </div>
  )
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface DropdownInputProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  name: string
  onChange: ({ name, value }: { name: string; value: string }) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  isEditing: boolean
  isDirty?: boolean
  setEditingField: (field: string | null) => void
}

export function EditableDropdownInput({
  label,
  options,
  value,
  name,
  onChange,
  disabled = false,
  isEditing,
  setEditingField,
  isDirty,
  placeholder = "Select an option",
  className
}: DropdownInputProps) {
  const handleChange = (value: string) => {
    onChange({ name, value })
  }

  const toggleEdit = () => {
    if (disabled) {
      toast.error("Can't update this field", {
        style: {
          background: "#ffc107",
          color: "#112C71"
        }
      })
      return
    }
    console.log(isEditing)

    if (!isDirty) {
      setEditingField(isEditing ? null : name)
    }
  }

  return (
    <div className={clsx("flex flex-col gap-2 w-full max-w-md", className)}>
      <label htmlFor={name} className="block font-semibold text-gray-700">
        {label}
      </label>
      <div
        className={clsx("rounded-md border px-3 py-2 transition-colors", {
          "border-gray-300 hover:border-gray-400": !disabled,
          "border-gray-200 cursor-not-allowed bg-gray-100": disabled
        })}
      >
        <FiEdit
          onClick={toggleEdit}
          className={clsx(
            "ml-2 cursor-pointer transition-transform transform",
            {
              "text-blue-500 hover:scale-110": isEditing,
              "text-gray-500 hover:text-gray-700 hover:scale-105": !isEditing
            }
          )}
          size={18}
        />
        <Select value={value} onValueChange={handleChange} disabled={disabled}>
          <SelectTrigger
            className={clsx("w-full bg-transparent outline-none focus:ring-0")}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
