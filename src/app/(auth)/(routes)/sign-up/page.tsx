"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FormEvent, useState } from "react"

import OauthGoogle from "@/components/GoogleAuth"

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        throw new Error("Failed to submit form")
      }

      console.log("Form submitted with data:", data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-literata min-h-screen flex flex-col md:flex-row bg-white w-full">
      <div className="w-full  md:w-1/2 p-6 md:p-12 flex items-center justify-center order-2 md:order-1">
        <Card className="w-full relative max-w-md space-y-8 p-8 shadow-lg">
          <h1 className="font-literata mt-4 text-3xl font-bold text-gray-900">
            Welcome!
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@university.edu.in"
                  required
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="**********"
                  required
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>
              <div>
                <Input
                  id="name"
                  name="name"
                  type="name"
                  placeholder="Enter Full Name"
                  required
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>
            </div>
            {loading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className=" w-full bg-[#5b58eb]  hover:bg-[#112c71] text-white rounded-full"
              >
                Sign up
              </Button>
            )}

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/sign-in" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </div>

            <div className="mt-6">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>

              <OauthGoogle isSignup={true} />
            </div>
          </form>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-screen relative bg-gray-200 order-1 md:order-2">
        <Image
          src={"/signup_page.png"}
          alt={"University Campus"}
          height={1}
          width={1000}
          className={"w-[100%] h-full object-cover"}
        />
      </div>
    </div>
  )
}
