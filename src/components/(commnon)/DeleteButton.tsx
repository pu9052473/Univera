import clsx from "clsx"
import { useState } from "react"

interface DeleteButtonProps {
  label: string
  onDelete: () => void
  className?: string
}

export default function DeleteButton({
  label,
  onDelete,
  className
}: DeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const btnClassName = clsx(
    "bg-primary text-black text-md hover:bg-red-500 hover:text-white rounded-lg px-4 py-2",
    className
  )
  if (showConfirm) {
    return (
      <div className="fixed bg-black/80 inset-0 flex items-center h-full justify-center">
        <div className="bg-white p-4 rounded-lg">
          <div>Are you sure you want to delete?</div>
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={() => setShowConfirm(false)}>
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete()
                setShowConfirm(false)
              }}
              type="button"
              className="primary"
            >
              Yes,&nbsp;delete!
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={btnClassName}
      onClick={() => setShowConfirm(true)}
    >
      {label}
    </button>
  )
}
