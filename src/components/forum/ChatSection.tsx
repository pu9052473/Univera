import React, { useEffect, useRef, useState } from "react"
import { Send, Smile, Paperclip, Image, X, File } from "lucide-react"

interface ChatSectionProps {
  messages: any[]
  userId: string | undefined
  inputMessage: string
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onLeaveChat: () => void
}

export const ChatSection = ({
  messages,
  userId,
  inputMessage,
  onInputChange,
  onSendMessage,
  onLeaveChat
}: ChatSectionProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim())
      onInputChange("")
    }
  }

  // Function to format date
  const formatDate = (messageDate) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return messageDate.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const messageDate = new Date(message.createdAt)
    const dateKey = messageDate.toDateString()

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: messageDate,
        messages: []
      }
    }
    acc[dateKey].messages.push(message)
    return acc
  }, {})

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker)
    setShowMediaOptions(false)
  }

  const toggleMediaOptions = () => {
    setShowMediaOptions(!showMediaOptions)
    setShowEmojiPicker(false)
  }

  const addEmoji = (emoji) => {
    onInputChange(inputMessage + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles((prevFiles) => [...prevFiles, ...files])
    setShowMediaOptions(false)
  }

  const removeFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    )
  }

  const handleFileUpload = () => {
    if (selectedFiles.length > 0) {
      // onFileUpload(selectedFiles);
      setSelectedFiles([])
    }
  }

  return (
    <div className="bg-secondary/10 rounded-2xl shadow-2xl overflow-hidden relative">
      {/* Chat Header */}
      <div className="bg-primary text-white flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-colorOne/20 rounded-full flex items-center justify-center">
            <span className="text-colorOne font-bold text-lg">FC</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Forum Chat</h2>
            <p className="text-xs text-secondary/70">3 members active</p>
          </div>
        </div>
        <button
          onClick={onLeaveChat}
          className="bg-colorTwo text-white px-4 py-2 rounded-lg hover:bg-colorTwo/90 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Leave Chat
        </button>
      </div>

      {/* File Preview Section */}
      {selectedFiles.length > 0 && (
        <div className="absolute bottom-20 left-4 right-4 z-20">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-textTwo">
                {selectedFiles.length} File{selectedFiles.length > 1 ? "s" : ""}{" "}
                Selected
              </h3>
              <button
                onClick={handleFileUpload}
                className="bg-colorThree text-white px-3 py-1 rounded-md text-sm hover:bg-colorThree/90"
              >
                Upload
              </button>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 bg-secondary/20 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <File className="w-8 h-8 text-colorThree" />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-colorTwo text-white rounded-full p-1 m-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
        accept="image/*,application/pdf,.doc,.docx,.txt"
      />

      {/* Messages Container */}
      <div className="h-[60vh] overflow-y-auto px-4 py-6 space-y-4 bg-secondary/5">
        {Object.entries(groupedMessages).map(
          ([dateKey, { date, messages }]) => (
            <React.Fragment key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px bg-textTwo/20 w-full"></div>
                <span className="px-3 text-sm text-textTwo/70 rounded-sm bg-white">
                  {formatDate(date)}
                </span>
                <div className="h-px bg-textTwo/20 w-full"></div>
              </div>

              {/* Messages for this date */}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.userId === userId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[70%] relative group ${
                      msg.userId === userId
                        ? "bg-colorThree text-white"
                        : "bg-colorOne/10 text-textTwo"
                    }`}
                  >
                    {/* User ID for non-current user messages */}
                    {msg.userId !== userId && (
                      <div className="text-xs mb-1 opacity-70">
                        {msg.userId}
                      </div>
                    )}

                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div
                      className={`absolute bottom-0 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs ${
                        msg.userId === userId ? "text-white" : "text-textTwo/50"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )
        )}

        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50 text-colorThree">
            No messages yet. Start chatting!
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 bg-white shadow-lg rounded-xl p-3 z-10 w-64">
          <div className="grid grid-cols-6 gap-2">
            {["😀", "👍", "❤️", "😂", "🎉", "👏", "😍", "🤔", "🙌", "🚀"].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:bg-secondary/20 rounded-md transition-colors"
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Media Options */}
      {showMediaOptions && (
        <div className="absolute bottom-20 right-4 bg-white shadow-lg rounded-xl p-4 z-10 w-64 space-y-2">
          <button
            onClick={() => {
              fileInputRef.current.accept = "image/*,video/*"
              fileInputRef.current.click()
            }}
            className="flex items-center space-x-3 hover:bg-secondary/20 p-3 rounded-lg w-full transition-colors"
          >
            <div className="bg-colorOne/20 p-2 rounded-full">
              <Image className="w-6 h-6 text-colorOne" />
            </div>
            <span className="text-textTwo">Photo/Video</span>
          </button>
          <button
            onClick={() => {
              fileInputRef.current.accept = "application/pdf,.doc,.docx,.txt"
              fileInputRef.current.click()
            }}
            className="flex items-center space-x-3 hover:bg-secondary/20 p-3 rounded-lg w-full transition-colors"
          >
            <div className="bg-colorThree/20 p-2 rounded-full">
              <File className="w-6 h-6 text-colorThree" />
            </div>
            <span className="text-textTwo">Document</span>
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-secondary/10 border-t border-primary/10">
        <div className="bg-white rounded-xl flex items-center shadow-sm">
          <button
            onClick={toggleMediaOptions}
            className="p-2 text-colorThree hover:bg-secondary/20 rounded-full m-1"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={toggleEmojiPicker}
            className="p-2 text-colorTwo hover:bg-secondary/20 rounded-full m-1"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-transparent rounded-xl focus:outline-none text-textTwo caret-colorOne"
          />
          <button
            onClick={() => {
              if (inputMessage.trim()) onSendMessage()
            }}
            disabled={!inputMessage.trim()}
            className="mx-2 p-2 rounded-full border bg-black bg-colorThree cursor-pointer text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
