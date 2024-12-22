import React from "react"
import { Role } from "@prisma/client"

interface RoleFormProps {
  setStep: (n: number) => void
  roles: Role[]
  selectedRoleIds: number[]
  setSelectedRoleIds: (n: number[]) => void
}

export default function RoleForm({
  roles,
  selectedRoleIds,
  setSelectedRoleIds
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
      r.rolename === "principal" ||
      r.rolename === "head_of_department" ||
      r.rolename === "dean"
  )
  return (
    <form>
      <div>
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
    </form>
  )
}
