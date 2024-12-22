"use client"
import Link from "next/link"
import Left from "@/components/Icons/Left"
import { AuthorityForm } from "../_components/AuthorityForm"

export default function SubjectsPage() {
  return (
    <section className="mt-8 max-w-lg mx-auto flex flex-col">
      <div className="mt-8 flex">
        <Link
          className="flex justify-center gap-2 border-2 w-full border-black font-semibold rounded-lg px-6 py-2"
          href={"/list/authorities"}
        >
          Back
          <Left />
        </Link>
      </div>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <h1 className="text-xl text-gray-500 font-bold uppercase mt-8">
          Add Authorities:
        </h1>
        <div className="h-full w-full flex flex-col gap-2">
          <AuthorityForm data={null} />
        </div>
      </div>
    </section>
  )
}
