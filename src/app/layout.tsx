import React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast"
import { QueryProvider } from "@/utils/QueryProvider"

export const metadata: Metadata = {
  title: "Univera: your own one stop soltuion",
  description: "This is the one stop solution for all the university work."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-glyphic`}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: "#CECDF9",
              color: "#112C71"
            },
            success: {
              duration: 3000,
              style: {
                background: "#28a745",
                color: "#fff"
              }
            },
            error: {
              style: {
                background: "#FF4D4F",
                color: "#fff"
              }
            }
          }}
        />
        <QueryProvider>
          <ClerkProvider>{children}</ClerkProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
