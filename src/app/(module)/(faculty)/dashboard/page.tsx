"use client"
import React, { useContext } from "react"
import {
  ProfileBanner,
  ExploreGrid
} from "@/app/(module)/(faculty)/_components/DashboardComponents"
import ProfileCompletion from "@/app/(module)/(faculty)/_components/ProfileCompletion"
import { UserContext } from "@/context/user"
import { DashboardSkeleton } from "@/components/(commnon)/Skeleton"

const App = () => {
  const { user } = useContext(UserContext)
  if (!user) return <DashboardSkeleton />
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ProfileBanner user={user} />
            <div className="bg-[#ADF9FE] rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-6">Explore</h3>
              <ExploreGrid />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-4">
                  Profile Completion
                </h3>
                <ProfileCompletion completionPercentage={75} />
                <button className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Announcements</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  See all
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Prelim payment due</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Exam schedule</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Nunc vulputate libero et velit interdum, ac aliquet odio
                    mattis.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Concern Person</h3>
              <div className="flex items-center space-x-4">
                <img
                  src="/api/placeholder/150/150"
                  alt="Concern Person"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">Ritaben Meme</h4>
                  <p className="text-sm text-gray-600">Assistant</p>
                  <p className="text-sm text-gray-600">example@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
