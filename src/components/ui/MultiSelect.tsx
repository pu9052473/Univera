import React from "react"

interface MultiSelectProps {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select..."
}) => {
  const toggleSelection = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="border rounded-md p-2 bg-[#EDF9FD]">
      <div className="flex flex-wrap gap-2">
        {selected.length > 0 ? (
          selected.map((value) => (
            <div
              key={value}
              className="px-2 py-1 bg-[#56E1E9] text-white text-sm rounded-md cursor-pointer"
              onClick={() => toggleSelection(value)}
            >
              {value} ✕
            </div>
          ))
        ) : (
          <p className="text-gray-500">{placeholder}</p>
        )}
      </div>
      <div className="mt-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`option-${option.value}`}
              checked={selected.includes(option.value)}
              onChange={() => toggleSelection(option.value)}
              className="cursor-pointer"
            />
            <label
              htmlFor={`option-${option.value}`}
              className="cursor-pointer text-[#0A2353]"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
