import React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

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
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  )
}
