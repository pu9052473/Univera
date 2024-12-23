import React from "react"

interface UserFormProps {
  setStep: (n: number) => void
  name: string
  setName: (s: string) => void
  email: string
  setEmail: (s: string) => void
  password: string
  setPassword: (s: string) => void
  isEditing: boolean
}

export default function UserForm({
  name,
  email,
  password,
  setEmail,
  setName,
  setPassword,
  isEditing
}: UserFormProps) {
  return (
    <form>
      <label className="text-sm">Name</label>
      <input
        disabled={isEditing}
        value={name}
        className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
        type="text"
        onChange={(e) => {
          setName(e.target.value)
        }}
      />

      <label className="text-sm">Email</label>
      <input
        disabled={isEditing}
        value={email}
        className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
        type="text"
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      {!isEditing && (
        <>
          <label className="text-sm">Password</label>
          <input
            disabled={isEditing}
            value={password}
            className="placeholder-transparent h-10 w-full bg-gray-200 rounded-lg border-gray-300 text-gray-900 p-1 mb-4"
            type="text"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </>
      )}
    </form>
  )
}
