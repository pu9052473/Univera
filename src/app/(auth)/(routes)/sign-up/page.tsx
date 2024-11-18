"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="font-literata min-h-screen flex flex-col sm:flex-row bg-white w-full">
      {/* Main Background for small screens */}
      <div className="absolute inset-0 sm:hidden z-0">
        <Image
          src={"/signup_page.png"}
          alt={"Main Background"}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Absolute Background behind the form */}
      <div
        id="curv-mobile-background-container"
        className="absolute z-10 sm:hidden bottom-0 max-w-full w-full h-3/5 pt-48"
      >
        <Image
          id="curv-mobile-background"
          src={"/backgrounds/Rectangle-12.png"}
          alt={"Form Background"}
          layout="fill"
          objectFit="fill"
        />
      </div>

      <div
        id="form-container"
        className="max-sm:absolute relative max-sm:bottom-0 z-10 max-sm:h-1/2 w-full sm:w-1/2 p-6 flex items-center justify-center order-2 sm:order-2"
      >
        <Card className="w-full relative max-w-sm space-y-8 py-2 sm:p-4 md:p-8 sm:shadow-lg max-sm:shadow-none max-sm:border-0">
          <h1 className="font-literata mt-4 text-3xl max-sm:hidden font-bold text-gray-900">
            Welcome to Univera!
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
                  placeholder="Enter your password"
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
                className="w-full bg-[#5b58eb] hover:bg-[#112c71] text-white rounded-full"
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

            <div>
              <div className="relative flex justify-center items-center text-sm">
                <hr className="text-[#112C71] absolute max-sm:hidden border border-[#112C71] w-full bottom-[50%] z-10" />
                <span className="px-2 text-[#112C71] sm:bg-white z-20">
                  Or continue with
                </span>
              </div>

              <OauthGoogle isSignup={true} />
            </div>
          </form>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="w-full sm:w-1/2 h-64 sm:h-screen relative max-sm:hidden bg-gray-200 order-2 md:order-2">
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
