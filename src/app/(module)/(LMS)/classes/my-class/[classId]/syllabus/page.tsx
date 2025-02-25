"use client"

import { UploadthingUploader } from "@/components/(commnon)/UploadthingUploader"
import { FileWithPreview, UploadedFile } from "@/types/globals"
import { useUploadThing } from "@/utils/uploadthing"
import React, { useCallback, useContext, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { UserContext } from "@/context/user"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Upload } from "lucide-react"

async function fetchSubjects(courseId: string) {
  const response = await axios.get(`/api/subjects?courseId=${courseId}`)
  return response.data.subjects || []
}

export default function ClassSyllabusPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  )
  const [title, setTitle] = useState<string>("")
  const { user } = useContext(UserContext)

  const { data: subjects } = useQuery({
    queryKey: ["subjects", user?.courseId],
    queryFn: () => fetchSubjects(String(user?.courseId)),
    enabled: !!user?.courseId
  })

  console.log(subjects)

  // collect all the subject who have subject.faculties.id same as user.id
  const userSubjects = subjects?.filter((subject: any) =>
    subject.faculties.some((faculty: any) => faculty.id === user?.id)
  )

  console.log(userSubjects)

  const { startUpload, routeConfig } = useUploadThing("attachmentsUploader", {
    onClientUploadComplete: () => {
      setUploading(false)
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    },
    onUploadError: () => {
      toast.error("Failed to upload file")
      setUploading(false)
    },
    onUploadBegin: () => {
      setUploading(true)
    }
  })

  const generatePreview = (file: File) => {
    const fileWithPreview = file as File & { preview?: string }
    if (file.type.startsWith("image/")) {
      fileWithPreview.preview = URL.createObjectURL(file)
    }
    return fileWithPreview
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const UniqueFiles = acceptedFiles.filter((file) => {
        return !files.some((existingFile) => existingFile.name === file.name)
      })
      const filesWithPreviews = UniqueFiles.map(generatePreview)
      setFiles((prevFiles) => [...prevFiles, ...filesWithPreviews])
    },
    [files]
  )

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove)
      if (prevFiles[indexToRemove].preview) {
        URL.revokeObjectURL(prevFiles[indexToRemove].preview!)
      }
      return newFiles
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      let uploadedFileData: UploadedFile[] = []

      // Handle new file uploads
      const newFiles = files.filter((file) => !file.existing)
      if (newFiles.length > 0) {
        const uploadedFiles = await startUpload(newFiles)

        if (uploadedFiles) {
          uploadedFileData = uploadedFiles.map((file) => ({
            url: file.url,
            fileType: file.name.split(".").pop()?.toLowerCase() || "",
            fileName: file.name
          }))
        }
      }

      console.log("[...uploadedFileData, ...existingFiles]", [
        ...uploadedFileData
      ])

      const response = await axios.patch("/api/subjects/syllabus", {
        title,
        subjectId: selectedSubjectId,
        uploadedBy: user?.name,
        file: uploadedFileData
      })

      if (response.status === 200) {
        toast.success("Syllabus uploaded successfully")
      } else {
        toast.error("Failed to upload syllabus")
      }
    } catch (error) {
      console.log("Error uploading syllabus:", error)
      toast.error("Error uploading syllabus")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-6">Upload Syllabus</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Subject</Label>
          <Select onValueChange={setSelectedSubjectId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-gray-100">
              {userSubjects?.map((subject: any) => (
                <SelectItem
                  key={subject.id}
                  value={subject.id}
                  className="text-black"
                >
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Upload File</Label>
          <UploadthingUploader
            files={files}
            uploading={uploading}
            setUploading={setUploading}
            onDrop={onDrop}
            removeFile={removeFile}
            routeConfig={routeConfig}
          />
        </div>
        <ButtonV1
          type="submit"
          disabled={!selectedSubjectId || !title}
          className="w-full"
          icon={Upload}
          label="Upload Syllabus"
        />
      </form>
    </div>
  )
}
