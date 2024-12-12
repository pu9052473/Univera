interface ForumFilterProps {
  selectedRole: string
  selectedDepartment: string | null
  selectedYear: string | null
  onRoleChange: (role: any) => void
  onDepartmentChange: (value: string) => void
  onYearChange: (value: string) => void
}

export const ForumFilter = ({
  selectedRole,
  selectedDepartment,
  selectedYear,
  onRoleChange,
  onDepartmentChange,
  onYearChange
}: ForumFilterProps) => {
  const departments = ["CS", "IT", "ECE"]
  const years = ["1", "2", "3", "4"]

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Forum Filters</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {["student", "faculty"].map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedRole === role
                ? "bg-[#112C71] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <select
        value={selectedDepartment || ""}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {selectedRole === "student" && selectedDepartment && (
        <select
          value={selectedYear || ""}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
