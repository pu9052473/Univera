"use client"

import React, { useState, useEffect, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import io, { Socket } from "socket.io-client"
import { ForumSidebar } from "@/components/forum/ForumSidebar"
import { ForumFilter } from "@/components/forum/ForumFilter"
import { ChatSection } from "@/components/forum/ChatSection"

export default function Home() {
  const [selectedRole, setSelectedRole] = useState("student")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  )
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [forums, setForums] = useState([])
  const [filteredForums, setFilteredForums] = useState([])
  const [selectedForumId, setSelectedForumId] = useState<number | null>(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  // const [error, setError] = useState(null);

  const userData = useUser()
  const userId = userData.user?.id
  const socketRef = useRef<Socket | null>(null) // Store socket in a ref
  console.log("userId", userId)

  useEffect(() => {
    // Initialize socket connection with the path to the WebSocket API
    const socket = io("http://localhost:3001")
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

    // Fetch messages from DB and localStorage on forum change
    const fetchMessages = async () => {
      const localMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )

      try {
        const res = await fetch(
          `/api/forum/messages?forumId=${selectedForumId}`
        )
        if (!res.ok)
          console.log("Failed to fetch messages from DB @(module)/forum/page")

        const dbMessages = await res.json()
        setMessages(mergeMessages(dbMessages, localMessages))
      } catch (error) {
        console.error("Error fetching messages:", error)
        setMessages(localMessages) // Fallback to local messages if DB fetch fails
      }
    }

    fetchMessages()

    // On socket connection
    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server")
    })

    socketRef.current?.emit("join_forum", selectedForumId) // Join the forum room
    console.log("Connected to WebSocket server with forum", selectedForumId)

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
        socketRef.current.emit("leave_forum", selectedForumId) // Leave the forum room
        socketRef.current.disconnect() // Disconnect only if connected
      }
    }
  }, [selectedForumId])

  const mergeMessages = (existingMessages: any[], newMessages: any[]) => {
    const safeNewMessages = Array.isArray(newMessages) ? newMessages : []
    const safeExistingMessages = Array.isArray(existingMessages)
      ? existingMessages
      : []

    const allMessages = [...safeExistingMessages, ...safeNewMessages]
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
        console.log(
          error.message || "An error occurred while fetching forums @app/page"
        )
      }
    }

    fetchForums()
  }, [userId])

  const handleForumSelect = (forumId: any) => {
    setSelectedForumId(forumId)
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
      console.log(
        error.message || "An error occurred while creating forum @app/page"
      )
    }
  }

  const sendMessage = async () => {
    if (inputMessage.trim() && selectedForumId) {
      const newMessage = {
        id: Date.now(),
        message: inputMessage,
        userId,
        forumId: selectedForumId,
        createdAt: new Date().toISOString()
      }

      // Storing message locally
      const localMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )
      const updatedMessages = [...localMessages, newMessage]
      localStorage.setItem(
        `forum_${selectedForumId}`,
        JSON.stringify(updatedMessages)
      )

      if (socketRef.current) {
        socketRef.current.emit("send_message", newMessage)
        console.log("Socket is connected, sending message...", newMessage)
      } else {
        console.log("Socket is not connected.")
      }

      setInputMessage("")
    }
  }

  useEffect(() => {
    if (selectedForumId) {
      const saveInterval = setInterval(
        () => {
          const localMessages = JSON.parse(
            localStorage.getItem(`forum_${selectedForumId}`) || "[]"
          )

          if (localMessages.length > 0) {
            saveChatMessages(selectedForumId, localMessages) // call the function to save chat
          }
        },
        1 * 60 * 1000
      ) // every minutes call the function

      return () => clearInterval(saveInterval) // clear the interval
    }
  }, [messages, selectedForumId])

  // Reusable saveChatMessages function
  const saveChatMessages = async (
    selectedForumId: number,
    localMessages: any[]
  ) => {
    try {
      const response = await fetch("/api/forum/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedForumId, localMessages })
      })

      if (response.ok) {
        console.log("Messages stored successfully.")
        localStorage.removeItem(`forum_${selectedForumId}`)
      } else {
        console.error("Failed to store messages.")
      }
    } catch (error) {
      console.error("Error saving messages:", error)
    }
  }

  // for store the messages when user leave chatbox
  const handleLeaveChat = async () => {
    if (selectedForumId) {
      const localMessages = JSON.parse(
        localStorage.getItem(`forum_${selectedForumId}`) || "[]"
      )
      await saveChatMessages(selectedForumId, localMessages)
    }
  }

  console.log("selected forum", selectedForumId)
  console.log("messages", messages)
  console.log("filteredForums", filteredForums)

  return (
    <div className="min-h-screen bg-[#CECDF9] p-6 grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <ForumSidebar
          filteredForums={filteredForums}
          selectedForumId={selectedForumId}
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
        {selectedForumId && (
          <ChatSection
            messages={messages}
            userId={userId}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSendMessage={sendMessage}
            onLeaveChat={handleLeaveChat}
          />
        )}
      </div>
    </div>
  )
}
