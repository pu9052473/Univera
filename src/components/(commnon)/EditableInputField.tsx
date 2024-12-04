import clsx from "clsx"
import React from "react"
import toast from "react-hot-toast"
import { FiEdit } from "react-icons/fi"

interface EditableInputFieldProps {
  label: string
  placeholder: string
  value: string
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
      console.log("You cannot edit this field")
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
    <div className="flex flex-col gap-2 w-full">
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
