import React from "react"
import { Button } from "@/components/ui/button"
import { Role } from "@prisma/client"

interface RoleFormProps {
  setStep: (n: number) => void
  roles: Role[]
}

export default function RoleForm({ setStep, roles }: RoleFormProps) {
  return (
    <form>
      <div>
        <label className="text-sm">Position</label>
        <input
          className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
          type="text"
        />

        <label className="text-sm">Role</label>
        {roles &&
          roles.length > 0 &&
          roles.map((r: any) => (
            <div className="flex gap-4" key={r.id}>
              <label htmlFor={r.id}>{r.rolename}</label>
              <input type="checkbox" value={r.id} name="role" id={r.id} />
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
          type="submit"
          className="flex justify-end"
          onClick={() => setStep(3)}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}
