import { useState, useEffect } from "react"
import io from "socket.io-client"

let socket: any

interface ChatMessage {
  id: number
  message: string
  userId: string
  createdAt: string
}

export default function Chatbox({
  forumId,
  userId
}: {
  forumId: number
  userId: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState<string>("")

  useEffect(() => {
    socket = io()

    // for joining the forum
    socket.emit("joinForum", forumId)

    // Listen for new messages
    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.disconnect()
    }
  }, [forumId])

  const sendMessage = () => {
    if (newMessage.trim() === "") return
    socket.emit("sendMessage", { message: newMessage, userId, forumId })
    setNewMessage("") // Clear input
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <div className="h-64 overflow-y-auto border-b mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="text-sm font-bold">
              {msg.userId === userId ? "You" : msg.userId}
            </p>
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="w-full border rounded px-2 py-1 mb-2"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="w-full bg-blue-500 text-white py-1 rounded"
      >
        Send
      </button>
    </div>
  )
}
