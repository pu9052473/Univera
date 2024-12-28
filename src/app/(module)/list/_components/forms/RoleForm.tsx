import React from "react"
import { Button } from "@/components/ui/button"
import { Role } from "@prisma/client"

interface RoleFormProps {
  setStep: (n: number) => void
  roles: Role[]
  selectedRoleIds: number[]
  setSelectedRoleIds: (n: number[]) => void
  handleTeacherSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void
  position: string
  setPosition: (s: string) => void
  submitBtnId: string
}

export default function RoleForm({
  setStep,
  roles,
  selectedRoleIds,
  setSelectedRoleIds,
  handleTeacherSubmit,
  position,
  setPosition,
  submitBtnId
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

  const roleOptions = roles.filter(
    (r) =>
      r.rolename === "coordinator" ||
      r.rolename === "lab_assitant" ||
      r.rolename === "mentor"
  )

  return (
    <div>
      <div>
        <label className="text-sm">Position</label>
        <input
          value={position ?? ""}
          onChange={(e) => setPosition(e.target.value)}
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
        />

        <label className="text-sm">Role</label>
        {roleOptions &&
          roleOptions.length > 0 &&
          roleOptions.map((r: Role) => (
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
          onClick={() => setStep(2)}
        >
          Back
        </Button>

        {/* Next Button */}
        <Button
          type="button"
          id={submitBtnId}
          className="flex justify-end"
          onClick={handleTeacherSubmit}
        >
          Submit
        </Button>

        {/* delete button */}
      </div>
    </div>
  )
}
