"use client"

import React, { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import io, { Socket } from "socket.io-client"

// ForumSidebar Component
const ForumSidebar = ({
  filteredForums,
  selectedForum,
  onForumSelect,
  onCreateForum,
  canCreateForum
}) => {
  return (
    <div className="h-full bg-[#112C71] text-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Forums</h2>
        {canCreateForum && (
          <button
            onClick={onCreateForum}
            className="bg-[#56E1E9] text-[#0A2353] px-3 py-1 rounded-md hover:bg-opacity-80 transition-colors"
          >
            Create Forum
          </button>
        )}
      </div>
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        {filteredForums.length > 0 ? (
          filteredForums.map((forum) => (
            <div
              key={forum.id}
              onClick={() => onForumSelect(forum.id)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedForum === forum.id
                  ? "bg-[#CECDF9] text-[#0A2353]"
                  : "hover:bg-[#CECDF9]/20"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{forum.name}</p>
                  <p className="text-sm opacity-70">
                    Dept: {forum.departmentId} | Year: {forum.year}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={
                    selectedForum === forum.id
                      ? "text-[#0A2353]"
                      : "text-[#56E1E9]"
                  }
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-center opacity-70">No forums available</p>
        )}
      </div>
    </div>
  )
}

// ForumFilter Component
const ForumFilter = ({
  selectedRole,
  selectedDepartment,
  selectedYear,
  onRoleChange,
  onDepartmentChange,
  onYearChange
}) => {
  const departments = ["CS", "IT", "ECE"]
  const years = ["1", "2", "3", "4"]

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Forum Filters</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {["student", "faculty"].map((role) => (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedRole === role
                ? "bg-[#112C71] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <select
        value={selectedDepartment || ""}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="w-full p-2 border rounded-md mb-4"
      >
        <option value="">Select Department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {selectedRole === "student" && selectedDepartment && (
        <select
          value={selectedYear || ""}
          onChange={(e) => onYearChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

// ChatSection Component
const ChatSection = ({
  messages,
  userId,
  inputMessage,
  onInputChange,
  onSendMessage,
  onLeaveChat
}) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Forum Chat</h2>
        <button
          onClick={onLeaveChat}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
        >
          Leave
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-4 mb-4">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 p-2 rounded-lg max-w-[80%] ${
                  msg.userId === userId
                    ? "self-end bg-[#56E1E9] text-[#0A2353] ml-auto"
                    : "bg-[#CECDF9] text-[#0A2353]"
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {msg.userId === userId ? "You" : msg.userId}
                </p>
                <p>{msg.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages yet</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2">
          <input
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={onSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-[#112C71] text-white px-4 py-2 rounded-md hover:bg-opacity-80 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState("student")
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedYear, setSelectedYear] = useState(null)
  const [forums, setForums] = useState([])
  const [filteredForums, setFilteredForums] = useState([])
  const [selectedForum, setSelectedForum] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [error, setError] = useState(null)

  const userData = useUser()
  const userId = userData.user?.id
  const socketRef = useRef<Socket | null>(null) // Store socket in a ref
  console.log("userId", userId)

  useEffect(() => {
    // Initialize socket connection with the path to the WebSocket API
    const socket = io("http://localhost:3000")
    socketRef.current = socket

    socketRef.current.on("connect", () => {
      console.log("WebSocket connected:", socketRef.current?.id)
    })

    socketRef.current.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error)
    })

    socketRef.current.on("connect_timeout", () => {
      console.error("WebSocket connection timed out")
    })

    socketRef.current.on("disconnect", (reason) => {
      console.log("WebSocket disconnected. Reason:", reason)
    })

    // Fetch existing messages from API
    fetch(`/api/forum/messages?forumId=${selectedForum}`)
      .then((res) => {
        if (!res.ok) {
          console.log("Failed to fetch messages")
        }
        return res.json()
      })
      .then((data) => {
        console.log("Fetched messages from DB:", data)
        setMessages((prev) => mergeMessages(prev, data))
      })
      .catch(console.error)

    // On socket connection
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server")
    })

    socketRef.current?.emit("join_forum", selectedForum) // Join the forum room
    console.log("Connected to WebSocket server with forum", selectedForum)

    // Listen for new messages from the server
    socketRef.current.on("receive_message", (newMessage: any) => {
      console.log("Received message from server:", newMessage)
      setMessages((prev) => [...prev, newMessage]) // Add new message
    })

    // On socket disconnection
    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server")
    })

    // Cleanup on component unmount or forum change
    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("leave_forum", selectedForum) // Leave the forum room
        socketRef.current.disconnect() // Disconnect only if connected
      }
    }
  }, [selectedForum])

  const mergeMessages = (existingMessages: any[], newMessages: any[]) => {
    const safeNewMessages = Array.isArray(newMessages) ? newMessages : []
    const allMessages = [...existingMessages, ...safeNewMessages]
    console.log("All messages before deduplication:", allMessages)

    // Remove duplicates based on the `id` field
    const uniqueMessages = Array.from(
      new Map(allMessages.map((msg) => [msg.id, msg])).values()
    )
    console.log("Unique messages after deduplication:", uniqueMessages)

    return uniqueMessages
  }

  const handleRoleChange = (role: "student" | "faculty") => {
    setSelectedRole(role)
    setSelectedDepartment(null) // Reset department selection on role change
    setSelectedYear(null) // Reset year selection
    setForums([]) // Clear forums on role change
  }

  useEffect(() => {
    // Fetch forums data dynamically based on userId
    const fetchForums = async () => {
      try {
        const response = await fetch(`/api/forum`)
        if (!response.ok)
          throw new Error("Failed to fetch the forums @app/page")

        const data = await response.json()
        setForums(data)
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching forums @app/page"
        )
      }
    }

    fetchForums()
  }, [userId])

  const handleForumSelect = (forumId: any) => {
    setSelectedForum(forumId)
  }

  useEffect(() => {
    // Filter forums data based on selected department and year
    const filtered = forums.filter(
      (forum) =>
        (!selectedDepartment || forum.department === selectedDepartment) &&
        (!selectedYear || forum.year === selectedYear)
    )

    setFilteredForums(filtered)
  }, [forums, selectedDepartment, selectedYear])

  // console.log("selectedDepartment", selectedDepartment)
  // console.log("selectedYear", selectedYear)

  const handleCreateForum = async () => {
    if (!selectedDepartment || !selectedYear) return
    console.log("entered in post")

    try {
      const response = await fetch(`/api/forum`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `some dout`,
          departmentId: 2,
          courseId: 2,
          year: 1,
          userId: `${userId}`,
          status: "pending"
        })
      })

      if (!response.ok) throw new Error("Failed to create the forum @app/page")
      const newForum = await response.json()
      setForums((prev) => [...prev, newForum])
    } catch (error: any) {
      setError(
        error.message || "An error occurred while creating forum @app/page"
      )
    }
  }

  // console.log("forums", forums)
  // console.log("filterdForums", filteredForums)

  // const handleForumSelect = (forumId: number) => {
  //   setSelectedForum(forumId)
  // }

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        message: inputMessage,
        userId,
        forumId: selectedForum,
        createdAt: new Date().toISOString()
      }

      // Ensure socket is defined before emitting
      if (socketRef.current) {
        socketRef.current.emit("send_message", newMessage)
        console.log("Socket is connected, sending message...", newMessage)
      } else {
        console.log("Socket is not connected.")
      }

      setInputMessage("")
    }
  }

  const leaveChat = async () => {
    try {
      const response = await fetch("/api/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedForum, messages })
      })

      if (response.ok) {
        console.log("Messages stored successfully.")
      } else {
        console.log("Failed to store messages.", error)
      }
    } catch (error) {
      console.error("Error saving messages:", error)
    }
  }

  console.log("selected forum", selectedForum)
  console.log("new message", inputMessage)
  console.log("messages", messages)
  console.log("filteredForums", filteredForums)

  return (
    <div className="min-h-screen bg-[#CECDF9] p-6 grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <ForumSidebar
          filteredForums={filteredForums}
          selectedForum={selectedForum}
          onForumSelect={handleForumSelect}
          onCreateForum={handleCreateForum}
          canCreateForum={!!selectedDepartment && !!selectedYear}
        />
      </div>
      <div className="col-span-9 grid grid-rows-[auto,1fr] gap-4">
        <ForumFilter
          selectedRole={selectedRole}
          selectedDepartment={selectedDepartment}
          selectedYear={selectedYear}
          onRoleChange={handleRoleChange}
          onDepartmentChange={setSelectedDepartment}
          onYearChange={setSelectedYear}
        />
        {selectedForum && (
          <ChatSection
            messages={messages}
            userId={userId}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSendMessage={sendMessage}
            onLeaveChat={leaveChat}
          />
        )}
      </div>
    </div>
  )
}
