"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Loader } from "lucide-react"
import { useSignIn } from "@clerk/nextjs"
import { AlertCircle } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import OauthGoogle from "@/components/GoogleAuth"

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [emailAddress, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!isLoaded) return null
    try {
      const res = await signIn.create({
        identifier: emailAddress,
        password
      })

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId })
        router.push("/dashboard")
      } else {
        console.log(JSON.stringify(res, null, 2))
      }
    } catch (err: any) {
      console.error("Error", err.errors[0].message)
      setError(err.errors[0].message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="font-literata min-h-screen flex flex-col md:flex-row bg-white w-full">
      {/* Right side - Image */}
      <div className="w-full md:w-1/2 h-64 md:h-screen relative bg-gray-200 order-1 md:order-1">
        <Image
          src={"/signin_page.png"}
          alt={"University Campus"}
          height={1}
          width={1000}
          className={"w-[100%] h-full object-cover"}
        />
      </div>

      {/* Left side - Form */}
      <div className="w-full  md:w-1/2 p-6 md:p-12 flex items-center justify-center order-2 md:order-2">
        <Card className="w-full relative max-w-md space-y-8 p-8 shadow-lg">
          <h1 className="font-literata mt-4 text-3xl font-bold text-gray-900">
            Welcome Back to Univera!
          </h1>

          <form onSubmit={submit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@university.edu.in"
                  required
                  onChange={(e) => setEmailAddress(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#E7E7FF] rounded-full"
                />
              </div>
            </div>
            {error && (
              <Alert
                variant="destructive"
                className="flex items-center space-x-2 text-sm p-2"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                  <AlertDescription className="leading-tight">
                    {error}
                  </AlertDescription>
                </div>
              </Alert>
            )}
            {isLoading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className=" w-full bg-[#5b58eb]  hover:bg-[#112c71] text-white rounded-full"
              >
                Sign In
              </Button>
            )}

            <div className="text-center text-sm mt-4">
              <span className="text-gray-600">Create new account? </span>
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign up
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
    </div>
  )
}
