import React, { useCallback, useEffect, useRef, useState } from "react"
import { Send, Smile, Paperclip, File, Trash2 } from "lucide-react"
import { chatMessage, UploadedFile } from "@/types/globals"
import { UploadthingUploader } from "./UploadthingUploader"
import { useUploadThing } from "@/utils/uploadthing"

interface ChatSectionProps {
  messages: any[]
  userId: string | undefined
  inputMessage: string
  onInputChange: (value: string) => void
  onSendMessage: (
    message?: string,
    attachments?: UploadedFile[]
  ) => Promise<void>
  onLeaveChat: () => void
  uploadedFiles: UploadedFile[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  handleDeleteMessage: (id: number) => void
}

interface GroupedMessages {
  [dateKey: string]: {
    date: string | Date // or Date if it's a Date object
    messages: chatMessage[]
  }
}

interface FileWithPreview extends File {
  preview?: string
}

// Update getFileType to handle both string URLs and attachment objects
const getFileType = (attachment: string | UploadedFile): "image" | "other" => {
  const url = typeof attachment === "string" ? attachment : attachment.url
  const extension = url.split(".").pop()?.toLowerCase()
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"]
  return imageExtensions.includes(extension || "") ? "image" : "other"
}

export const ChatSection = ({
  messages,
  userId,
  inputMessage,
  onInputChange,
  onSendMessage,
  onLeaveChat,
  uploadedFiles,
  setUploadedFiles,
  handleDeleteMessage
}: ChatSectionProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false)
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)

  // console.log("messages from chatsection", messages)

  const handleSend = async () => {
    if ((inputMessage.trim() || uploadedFiles.length > 0) && !uploading) {
      if (files.length > 0) {
        await startUpload(files)
      } else {
        // console.log("else called")
        // Directly send the message if there are no files to upload
        onSendMessage(inputMessage.trim())
        onInputChange("")
        setUploadedFiles([])
      }
    }
  }

  // Function to format date
  const formatDate = (messageDate: any) => {
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
  const groupedMessages = messages.reduce<GroupedMessages>((acc, message) => {
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

  const addEmoji = (emoji: any) => {
    onInputChange(inputMessage + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // function to upload attachments in uploadthing
  const { startUpload, routeConfig } = useUploadThing("attachmentsUploader", {
    onClientUploadComplete: (res) => {
      // console.log("Uploaded files res:", res)
      // console.log("Uploaded successfully!")
      // Clean up previews before clearing files
      const uploadedFileData = res.map((file) => ({
        url: file.url,
        fileType: file.name.split(".").pop()?.toLowerCase() || "",
        fileName: file.name
      }))

      setUploadedFiles((prev: UploadedFile[]) => {
        // console.log("setUploadedFiles calles")
        const updatedFiles = [...prev, ...uploadedFileData]
        // console.log("Updated files after setUploadedFiles:", updatedFiles)

        // Call onSendMessage with the updated files
        onSendMessage(inputMessage.trim() || "", updatedFiles)
        // console.log("Message sent with updated files:", updatedFiles)

        return updatedFiles
      })
      setUploading(false)

      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })

      setFiles([])
      setShowMediaOptions(false)
      onInputChange("")
    },
    onUploadError: (error) => {
      console.log("Error occurred while uploading: " + error.message)
      setUploading(false)
    },
    onUploadBegin: () => {
      setUploading(true)
    }
  })

  // Generate preview for files
  const generatePreview = (file: File) => {
    const fileWithPreview = file as File & { preview?: string }
    if (file.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }
    return fileWithPreview
  }

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const UniqueFiles = acceptedFiles.filter((file) => {
      return !files.some((existingFile) => existingFile.name === file.name)
    })

    const filesWithPreviews = UniqueFiles.map(generatePreview)
    setFiles((prevFiles) => [...prevFiles, ...filesWithPreviews])
  }, [])

  // Remove file from the list
  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove)
      if (prevFiles[indexToRemove].preview) {
        URL.revokeObjectURL(prevFiles[indexToRemove].preview!)
      }
      return newFiles
    })
  }

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const renderAttachments = (attachments: UploadedFile[]) => {
    return attachments.map((attachment, index) => {
      const fileType = getFileType(attachment) // Add logic to get file type if needed

      return (
        <div key={index} className="mt-2 space-y-2 ">
          {fileType === "image" ? (
            <div className="relative group">
              <img
                src={attachment.url}
                alt={attachment.fileName}
                className="max-w-full max-h-48 rounded-lg object-contain"
              />
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
              >
                <span className="opacity-0 group-hover:opacity-100 text-TextTwo bg-black bg-opacity-50 px-2 py-1 rounded">
                  Open in new tab
                </span>
              </a>
            </div>
          ) : (
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <File className="w-5 h-5" />
              <span className="text-sm truncate">{attachment.fileName}</span>
            </a>
          )}
        </div>
      )
    })
  }

  const renderMessages = (messages: any[], userId: string) => {
    return messages.map((msg) => {
      const isOwn = msg.userId === userId

      return (
        <div
          key={msg.id}
          className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"} group/message`}
        >
          {!isOwn && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs">
              {msg.userId.charAt(0).toUpperCase()}
            </div>
          )}

          <div
            className={`relative px-4 py-3 rounded-2xl max-w-[70%] transition-all duration-200 ${
              isOwn
                ? "bg-gradient-to-r from-colorThree to-colorThree/90 text-TextTwo rounded-br-sm"
                : "bg-gradient-to-r from-colorOne/10 to-colorOne/5 text-textTwo rounded-bl-sm"
            }`}
          >
            {!isOwn && (
              <div className="text-xs font-medium mb-1 opacity-70">
                {msg.userId}
              </div>
            )}

            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.message}
            </p>

            {msg.attachments && renderAttachments(msg.attachments)}

            <div
              className={`absolute -bottom-5 ${isOwn ? "right-0" : "left-0"} text-xs opacity-0 group-hover/message:opacity-70 transition-opacity duration-300 ${
                isOwn ? "text-TextTwo/70" : "text-textTwo/70"
              }`}
            >
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </div>

            {isOwn && (
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute -top-3 -right-3 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 
                  group-hover/message:opacity-100 transition-all duration-200 hover:bg-red-600 
                  transform hover:scale-110 shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="chatbox-container h-[85vh] flex flex-col bg-secondary/10 rounded-2xl relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between bg-primary text-TextTwo p-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-colorOne/20 rounded-full flex items-center justify-center text-colorOne font-bold">
            FC
          </div>
          <div>
            <h2 className="text-lg font-semibold">Forum Chat</h2>
            <p className="text-sm text-secondary/70">3 members active</p>
          </div>
        </div>
        <button
          onClick={onLeaveChat}
          className="bg-colorTwo text-TextTwo px-4 py-2 rounded-lg hover:bg-colorTwo/90 transition-transform transform hover:scale-105 shadow-md"
        >
          Back
        </button>
      </header>

      {/* Messages Section */}
      <main className="flex-1 h-[80vh] overflow-y-auto px-4 py-6 space-y-4 bg-secondary/5">
        {Object.entries(groupedMessages).map(
          ([dateKey, { date, messages }]) => (
            <React.Fragment key={dateKey}>
              <div className="flex justify-center my-4">
                <span className="bg-white text-secondary px-3 py-1 rounded shadow">
                  {formatDate(date)}
                </span>
              </div>
              {renderMessages(messages, String(userId))}
            </React.Fragment>
          )
        )}
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50 text-colorThree">
            No messages yet. Start chatting!
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Floating Panels */}
      {showMediaOptions && (
        <div className="absolute bottom-20 right-4 w-72 bg-white rounded-xl shadow-xl z-10 transition-transform">
          <div className="p-4 border-b border-secondary/30">
            <h3 className="text-sm font-medium text-TextTwo">Upload Files</h3>
          </div>
          <div className="p-4">
            <UploadthingUploader
              files={files}
              uploading={uploading}
              setUploading={setUploading}
              setShowMediaOptions={setShowMediaOptions}
              onDrop={onDrop}
              removeFile={removeFile}
              routeConfig={routeConfig}
            />
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 w-64 bg-white rounded-xl shadow-xl z-10 p-4 transition-transform">
          <div className="grid grid-cols-6 gap-2">
            {["😀", "👍", "❤️", "😂", "🎉", "👏", "😍", "🤔", "🙌", "🚀"].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl hover:bg-secondary/20 rounded-md transition-transform"
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Input Section */}
      <footer className="p-2 sm:p-4 bg-secondary/10 border-t border-primary/10 w-full">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-md max-w-[95%] mx-auto">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={toggleMediaOptions}
              className="p-1.5 sm:p-2 rounded-full text-colorThree hover:bg-secondary/20"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={toggleEmojiPicker}
              className="p-1.5 sm:p-2 rounded-full text-colorTwo hover:bg-secondary/20"
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              files.length === 0 ? "Type a message..." : "Add caption..."
            }
            className="flex-1 bg-transparent py-2 px-2 sm:px-3 focus:outline-none text-textTwo text-sm sm:text-base min-w-0"
          />

          <button
            onClick={handleSend}
            disabled={
              uploading || (inputMessage.trim() === "" && files.length === 0)
            }
            className="p-1.5 sm:p-2 rounded-full bg-colorThree text-black shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ml-1 sm:ml-2"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </footer>
    </div>
  )
}
