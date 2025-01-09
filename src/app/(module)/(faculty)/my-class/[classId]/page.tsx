"use client"

import React from "react"
import { ExploreGrid } from "../../_components/DashboardComponents"
import { useParams } from "next/navigation"

export default function Page() {
  const { classId } = useParams()
  return (
    <div className="min-h-screen">
      <div className=" mx-auto p-2">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Explore Section */}
            <div className="">
              {/* Header Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-TextTwo">
                    Explore
                  </h3>
                  {/* Optional: Add navigation or filter controls here */}
                  <div className="flex gap-4">
                    {/* Add any additional controls if needed */}
                  </div>
                </div>

                {/* ExploreGrid Component */}
                <div className="relative">
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0" />

                  {/* Main Grid */}
                  <div className="relative z-10">
                    <ExploreGrid
                      isClassPage={true}
                      classId={Array.isArray(classId) ? classId[0] : classId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* You can add sidebar content here if needed */}
          </div>
        </div>
      </div>
    </div>
  )
}
