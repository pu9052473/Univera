import React from "react"
import { Button } from "@/components/ui/button"
import { Role } from "@prisma/client"

interface RoleFormProps {
  setStep: (n: number) => void
  roles: Role[]
  selectedRoleIds: number[]
  setSelectedRoleIds: (n: number[]) => void
  handleTeacherSubmit: () => void
  position: string
  setPosition: (s: string) => void
}

export default function RoleForm({
  setStep,
  roles,
  selectedRoleIds,
  setSelectedRoleIds,
  handleTeacherSubmit,
  position,
  setPosition
}: RoleFormProps) {
  const handleRoleSelection = (roleId: number) => {
    if (selectedRoleIds.includes(roleId)) {
      // Remove the roleId if already selected
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId))
    } else {
      // Add the roleId if not already selected
      setSelectedRoleIds([...selectedRoleIds, roleId])
    }
  }

  return (
    <form>
      <div>
        <label className="text-sm">Position</label>
        <input
          value={position ?? ""}
          onChange={(e) => setPosition(e.target.value)}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
        />

        <label className="text-sm">Role</label>
        {roles &&
          roles.length > 0 &&
          roles.map((r: Role) => (
            <div className="flex gap-4" key={r.id}>
              <label htmlFor={r.rolename}>{r.rolename}</label>
              <input
                type="checkbox"
                value={r.id}
                name="role"
                id={r.rolename}
                checked={selectedRoleIds.includes(r.id)}
                onChange={() => handleRoleSelection(r.id)}
              />
            </div>
          ))}
      </div>

      <div className="flex gap-4 mt-4">
        {/* Back Button */}
        <Button
          type="button"
          className="flex justify-end"
          onClick={() => setStep(1)}
        >
          Back
        </Button>

        {/* Next Button */}
        <Button
          type="button"
          className="flex justify-end"
          onClick={handleTeacherSubmit}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
