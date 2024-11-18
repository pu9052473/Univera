import CustomSideBar from "@/components/(commnon)/CustomSideBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import React from "react"

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="h-full flex items-center justify-center">
        <CustomSideBar />
        {children}
      </div>
    </SidebarProvider>
  )
}
