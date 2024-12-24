"use client"

import { useDropzone } from "@uploadthing/react"
import { generateClientDropzoneAccept } from "uploadthing/client"
import {
  X,
  FileText,
  Image as ImageIcon,
  File,
  Film,
  Music,
  Upload
} from "lucide-react"

interface FileWithPreview extends File {
  preview?: string
}

interface UploadthingUploaderProps {
  files: FileWithPreview[]
  uploading: boolean
  setUploading: (value: boolean) => void
  setShowMediaOptions: (value: boolean) => void
  onDrop: (files: File[]) => void
  removeFile: (index: number) => void
  routeConfig: any
}

export function UploadthingUploader({
  files,
  uploading,
  onDrop,
  removeFile,
  routeConfig
}: UploadthingUploaderProps) {
  // Get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="w-8 h-8" />
    if (fileType.startsWith("video/")) return <Film className="w-8 h-8" />
    if (fileType.startsWith("audio/")) return <Music className="w-8 h-8" />
    if (fileType.includes("pdf") || fileType.includes("document"))
      return <FileText className="w-8 h-8" />
    return <File className="w-8 h-8" />
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Determine allowed file types
  const fileTypes = routeConfig?.config ? Object.keys(routeConfig.config) : []

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined
  })

  return (
    <div className="space-y-3 cursor-pointer">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragActive
            ? "border-ColorThree bg-lamaPurpleLight"
            : "border-ColorTwo/30 hover:border-ColorTwo bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload
              className={`w-8 h-8 ${isDragActive ? "text-ColorThree" : "text-ColorTwo"}`}
            />
          </div>
          <p className="text-sm text-TextTwo font-medium text-center">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-TextTwo/60 text-center">
            or click to browse
          </p>
        </div>
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-Secondary/30 overflow-hidden">
          <div className="p-3 border-b border-Secondary/30 flex justify-between items-center bg-lamaSkyLight">
            <h4 className="text-sm font-medium text-TextTwo">
              Selected Files ({files.length})
            </h4>
          </div>

          <div className="p-3 grid grid-cols-1 gap-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group flex items-center bg-lamaSkyLight/50 rounded-lg p-2 hover:bg-lamaSkyLight transition-colors"
              >
                {/* Preview or Icon */}
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-Secondary/30">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-ColorTwo">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-TextTwo truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-TextTwo/60">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                {!uploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 p-1 rounded-full text-TextTwo/40 hover:text-ColorTwo hover:bg-Secondary/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="bg-lamaPurpleLight text-ColorThree p-3 rounded-lg flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Uploading...
        </div>
      )}
    </div>
  )
}
