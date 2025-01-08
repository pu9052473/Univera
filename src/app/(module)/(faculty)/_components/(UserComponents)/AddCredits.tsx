"use client"

import { FaPlus } from "react-icons/fa6"
import CreditField from "./CreditField"
import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import DialogWrapper from "../DialogWrapper"
import axios from "axios"

const creditTypes = [
  "annual",
  "special",
  "health",
  "casual",
  "maternity",
  "paternity"
] as const

const initialCreditValues: { [key: string]: number } = {
  annual: 0,
  special: 0,
  health: 0,
  casual: 0,
  maternity: 0,
  paternity: 0
}

type Props = {
  email: string
  name: string
}

const AddCredits = ({ email, name }: Props) => {
  const [creditValues, setCreditValues] = useState(initialCreditValues)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleCreditChange = (type: string, value: number) => {
    setCreditValues((prevValues) => ({ ...prevValues, [type]: value }))
  }

  async function SubmitCredits(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const year = new Date().getFullYear().toString()

      const formattedValues = {
        ...creditValues,
        year,
        email,
        name
      }
      const res = await fetch("/api/leave/balance", {
        method: "POST",
        body: JSON.stringify(formattedValues)
      })
      if (res.ok) {
        toast.success("Credits Submitted", { duration: 4000 })
        setOpen(false)
        router.refresh()
      } else {
        const body = await res.json()

        toast.error(`An error occured ${body.message}`, { duration: 6000 })
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
    <DialogWrapper
      title="Add Credits"
      descr="The Credits you are about to add are for this year only!"
      icon={FaPlus}
      isBtn={false}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <form onSubmit={SubmitCredits}>
        {creditTypes.map((type) => (
          <div key={type} className="my-3">
            {["Credit"].map((suffix) => (
              <CreditField
                key={type + suffix}
                name={`${type}${suffix}`}
                label={`${
                  type.charAt(0).toUpperCase() + type.slice(1)
                } ${suffix}`}
                onChange={(value) => handleCreditChange(type, value)}
              />
            ))}
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </DialogWrapper>
  )
}

export default AddCredits
