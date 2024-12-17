import { Loader, LucideIcon, Plus, Send } from "lucide-react"
import Link from "next/link"
import React, { ButtonHTMLAttributes } from "react"
import { Button } from "../ui/button"
import clsx from "clsx"

export interface ButtonV1Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon | null
  label?: string
  href?: string
  disabled?: boolean
  loading?: boolean
  varient?: "primary" | "outline"
}

export function ButtonV1({
  icon: Icon = Plus,
  label,
  disabled,
  href,
  varient = "primary",
  loading,
  ...props
}: ButtonV1Props) {
  if (varient == "primary") {
    const primaryButtonClasses = clsx(
      "py-2 pl-2 pr-3 text-white bg-Primary flex gap-1.5 items-center transition-all duration-300 ease-in-out hover:bg-[#1A3E99] hover:-translate-y-px hover:shadow-lg",
      props.className
    )

    if (href) {
      return (
        <Link href={href} className={primaryButtonClasses}>
          {Icon && <Icon className="w-5 h-5" />}
          {label && <p>{label}</p>}
        </Link>
      )
    }

    return (
      <Button
        {...props}
        disabled={disabled || loading}
        className={primaryButtonClasses}
      >
        {loading && <Loader />}
        {!loading && Icon && <Icon className="w-5 h-5" />}
        {!loading && label && <p>{label}</p>}
      </Button>
    )
  } else if (varient == "outline") {
    const primaryButtonClasses = clsx(
      "py-2 pl-2 pr-3 text-white border-2 border-Primary bg-white text-Primary flex gap-1.5 items-center transition-all duration-300 ease-in-out hover:text-white hover:border-white hover:bg-[#1A3E99] hover:shadow-lg",
      props.className
    )

    if (href) {
      return (
        <Link href={href} className={primaryButtonClasses}>
          {Icon && <Icon className="w-5 h-5" />}
          {label && <p>{label}</p>}
        </Link>
      )
    }

    return (
      <Button
        {...props}
        disabled={disabled || loading}
        className={primaryButtonClasses}
      >
        {loading && <Loader />}
        {!loading && Icon && <Icon className="w-5 h-5" />}
        {!loading && label && <p>{label}</p>}
      </Button>
    )
  }
}

interface SubmitButtonProps {
  label?: string
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function Submit({
  label = "submit",
  disabled,
  loading,
  ...props
}: SubmitButtonProps) {
  // clsx function intelligently merges class names and ensures that user-provided
  const buttonClasses = clsx(
    "py-2 pl-2 pr-3 text-white bg-[#112C71] rounded-md flex gap-1.5 items-center transition-all duration-300 ease-in-out hover:bg-[#1A3E99] hover:scale-105 hover:shadow-lg",
    props.className
  )

  return (
    <Button
      id="submit"
      {...props}
      type="submit"
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading ? <Loader /> : <Send size={20} />}
      {label && <p>{label}</p>}
    </Button>
  )
}
