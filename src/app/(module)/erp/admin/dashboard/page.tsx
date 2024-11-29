import React from "react"
import { Submit } from "@/components/(commnon)/ButtonV1"
import { EditableInputField } from "@/components/(commnon)/EditableInputField"

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center w-[98%] p-2">
      <div className="flex flex-col w-[85%] items-center lg:items-start mb-10">
        <h1 className="text-2xl font-bold mb-2.5">User Profile</h1>
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <span className="text-4xl">👤</span>
        </div>
      </div>

      <div className="flex flex-wrap w-[85%] max-w-6xl justify-evenly gap-4 lg:gap-10">
        {/* Left Section */}
        <div className="flex-1 space-y-4">
          <EditableInputField
            label="Full Name"
            placeholder="Enter your full name"
          />
          <EditableInputField label="Email" placeholder="Enter your email" />
          <EditableInputField
            label="Personal Email"
            placeholder="Enter your personal email"
          />
          <EditableInputField
            label="Address"
            placeholder="Enter your address"
          />
          <EditableInputField
            label="Contact Number"
            placeholder="Enter your contact number"
          />
          <EditableInputField label="Salary" placeholder="Enter your salary" />
          <div>
            <label className="block font-medium">Upload Document:</label>
            <div className="flex items-center">
              <p className="text-gray-500">📎 Resume.pdf</p>
              <button className="ml-4 py-1 px-3 bg-blue-600 text-white rounded-md">
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 space-y-4">
          <EditableInputField
            label="Department"
            placeholder="Enter your department"
          />
          <EditableInputField label="Role" placeholder="Enter your role" />
          <EditableInputField
            label="Role Description"
            placeholder="Enter your role description"
          />
          <EditableInputField
            label="Qualification"
            placeholder="Enter your qualification"
          />
          <EditableInputField
            label="Post/Position"
            placeholder="Enter your post/position"
          />
          <EditableInputField
            label="Contact Number"
            placeholder="Enter your contact number"
          />
          <EditableInputField
            label="New Password"
            placeholder="Enter your new password"
          />
        </div>
      </div>

      <div className="mt-10 w-[85%] flex justify-center sm:justify-start">
        <Submit className="px-4 bg-blue-600 text-white rounded-md" />
      </div>
    </div>
  )
}

export default UserProfile
