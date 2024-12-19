import { Button } from "@/components/ui/button"
import React from "react"

interface UserFormProps {
  setStep: (n: number) => void
  name: string
  setName: (s: string) => void
  email: string
  setEmail: (s: string) => void
  password: string
  setPassword: (s: string) => void
  isEditable: boolean
}

export default function UserForm({
  setStep,
  name,
  email,
  password,
  setEmail,
  setName,
  setPassword,
  isEditable
}: UserFormProps) {
  return (
    <form>
      <label className="text-sm">Name</label>
      <input
        disabled={!isEditable}
        value={name}
        className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
        type="text"
        onChange={(e) => {
          setName(e.target.value)
        }}
      />

      <label className="text-sm">Email</label>
      <input
        disabled={!isEditable}
        value={email}
        className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
        type="text"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />

      <label className="text-sm">Password</label>
      <input
        disabled={!isEditable}
        value={password}
        className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
        type="text"
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />

      <Button
        type="button"
        className="flex justify-end"
        onClick={() => {
          setStep(2)
        }}
      >
        Next
      </Button>
    </form>
  )
}
