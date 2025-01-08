"use client"

import { FormEvent, useReducer, useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { IoPencil } from "react-icons/io5"
import { Button } from "@/components/ui/button"
import { Balances } from "@prisma/client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import DialogWrapper from "../../_components/DialogWrapper"

type State = {
  [key: string]: number
}

type Action = {
  type: string
  value: number
}
type Props = {
  balance: Balances
  refetch: () => void
}

const EditBalances = ({ balance, refetch }: Props) => {
  const initialState: State = {
    annualCredit: balance.annualCredit ?? (0 as number),
    casualCredit: balance.casualCredit ?? (0 as number),
    healthCredit: balance.healthCredit ?? (0 as number),
    maternityCredit: balance.maternityCredit ?? (0 as number),
    paternityCredit: balance.paternityCredit ?? (0 as number),
    specialCredit: balance.specialCredit ?? (0 as number),
    unpaidCredit: balance.unpaidCredit ?? (0 as number)
  }

  const reducer = (state: State, action: Action): State => {
    return {
      ...state,
      [action.type]: action.value
    }
  }

  const [open, setOpen] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()

  const handleInputChange =
    (type: string) => (e: FormEvent<HTMLInputElement>) => {
      dispatch({
        type,
        value: e.currentTarget.valueAsNumber
      })
    }

  async function submitEditedBal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const id = balance.id
      const formattedValues = {
        ...state,
        id
      }

      const res = await fetch(`/api/leave/balance/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formattedValues)
      })

      if (res.ok) {
        toast.success("Edit Successful", { duration: 4000 })
        setOpen(false)
        router.refresh()
        refetch()
      } else {
        toast.error(`An error occured`, { duration: 6000 })
      }
    } catch (error) {
      console.error(error)
      toast.error("An Unexpected error occured")
    }
  }

  return (
    <DialogWrapper
      title="Edit Credits"
      icon={IoPencil}
      isBtn={false}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <form onSubmit={submitEditedBal}>
        <div className="grid grid-cols-3 gap-2 my-3">
          {Object.keys(initialState).map((key) => (
            <div className="flex flex-col" key={key}>
              <Label className="text-xs">{key}</Label>
              <Input
                type="number"
                onChange={handleInputChange(key)}
                value={String(state[key])}
              />
            </div>
          ))}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </DialogWrapper>
  )
}

export default EditBalances
