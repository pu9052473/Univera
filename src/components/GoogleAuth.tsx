"use client"

import { OAuthStrategy } from "@clerk/types"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AiOutlineGoogle } from "react-icons/ai"
import Image from "next/image"

export default function OauthGoogle({ isSignup }: { isSignup: boolean }) {
  const { signIn, setActive } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()

  async function handleSignIn(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null

    const signInWithOAuth = () =>
      signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/dashboard"
      })

    try {
      const userNeedsToBeCreated =
        signIn.firstFactorVerification?.status === "transferable"
      const userExistsButNeedsSignIn =
        signUp.verifications.externalAccount?.status === "transferable" &&
        signUp.verifications.externalAccount.error?.code ===
          "external_account_exists"

      if (userExistsButNeedsSignIn) {
        const res = await signIn.create({ transfer: true })
        if (res.status === "complete") {
          await setActive({ session: res.createdSessionId })
          router.push("/dashboard")
          return
        }
      } else if (userNeedsToBeCreated) {
        const res = await signUp.create({ transfer: true })
        if (res.status === "complete") {
          await setActive({ session: res.createdSessionId })
          router.push("/dashboard")
          return
        }
      } else {
        signInWithOAuth()
      }
    } catch (error) {
      console.error("OAuth Sign-In Error:", error)
    }
  }

  return (
    <div>
      <button
        onClick={() => handleSignIn("oauth_google")}
        className="w-full bg-[#5b58eb] hover:bg-[#112c71] text-white flex items-center justify-center mt-4 gap-2 p-2 rounded-full"
      >
        <Image src={"/google.png"} alt={"google icon"} width={24} height={24} />
        {isSignup ? "SignUp" : "SignIn"} with Google
      </button>
    </div>
  )
}
