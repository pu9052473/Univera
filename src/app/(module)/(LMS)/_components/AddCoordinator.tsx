import { DropdownInput } from "@/components/(commnon)/EditableInputField"
import { Prisma } from "@prisma/client"
import React, { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Submit } from "@/components/(commnon)/ButtonV1"

type FacultyWithRelations = Prisma.FacultyGetPayload<{
  include: {
    user: {
      include: {
        roles: true // Include roles relation
      }
    }
  }
}>

interface AddCoordinatorProps {
  CoordinatorUsers: FacultyWithRelations[]
  classId: string
  refetch: () => void
}

export function AddCoordinator({
  CoordinatorUsers,
  classId,
  refetch
}: AddCoordinatorProps) {
  const [selectedCoordinator, setSelectedCoordinator] = useState<string>("")

  const UserOption = CoordinatorUsers.reduce<
    { value: string; label: string }[]
  >((options, user) => {
    const roles = user.user.roles.map((role) => role.id)
    if (roles.includes(5)) {
      options.push({ value: user.user.id, label: user.user.name })
    }
    return options
  }, [])

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedCoordinator(value)
  }

  const handleSave = async () => {
    try {
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          coordinatorId: selectedCoordinator
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="">
      {UserOption.length > 0 ? (
        <DropdownInput
          className="max-w-2xl w-full"
          label="Select User as Coordinator"
          onChange={handleChange}
          placeholder={
            UserOption.find(
              (option) => String(option.value) === String(selectedCoordinator)
            )?.label || "Select a Coordinator"
          }
          value={
            UserOption.find(
              (option) => String(option.value) === String(selectedCoordinator)
            )?.value || ""
          }
          name="coordinatorId"
          options={UserOption}
        />
      ) : (
        <p className="text-gray-500">
          No coordinators found in this department to assign to this class.
        </p>
      )}
      <Submit
        id="save-coordinator"
        label="Save"
        onClick={handleSave}
        disabled={UserOption.length === 0}
      />
    </div>
  )
}

interface AddMentorProps {
  MentorUsers: FacultyWithRelations[]
  classId: string
  refetch: () => void
}

export function AddMentor({ MentorUsers, classId, refetch }: AddMentorProps) {
  const [selectedMentor, setSelectedMentor] = useState<string>("")

  const UserOption = MentorUsers.reduce<{ value: string; label: string }[]>(
    (options, user) => {
      const roles = user.user.roles.map((role) => role.id)
      if (roles.includes(13)) {
        options.push({ value: user.user.id, label: user.user.name })
      }
      return options
    },
    []
  )

  const handleChange = ({ value }: { name: string; value: string }) => {
    setSelectedMentor(value)
  }

  const handleSave = async () => {
    try {
      const res = await axios.patch(`/api/classes/${classId}`, {
        updatedClass: {
          mentorId: selectedMentor
        }
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        refetch()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong")
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="">
      {UserOption.length > 0 ? (
        <DropdownInput
          className="max-w-2xl w-full"
          label="Select User as Mentor"
          onChange={handleChange}
          placeholder={
            UserOption.find(
              (option) => String(option.value) === String(selectedMentor)
            )?.label || "Select a Mentor"
          }
          value={
            UserOption.find(
              (option) => String(option.value) === String(selectedMentor)
            )?.value || ""
          }
          name="mentorId"
          options={UserOption}
        />
      ) : (
        <p className="text-gray-500">
          No mentors found in this department to assign to this class.
        </p>
      )}
      <Submit
        id="save-Mentor"
        label="Save"
        onClick={handleSave}
        disabled={UserOption.length === 0}
      />
    </div>
  )
}
