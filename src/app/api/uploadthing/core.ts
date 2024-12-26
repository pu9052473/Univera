import { createUploadthing, type FileRouter } from "uploadthing/next"

const uploadThing = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: uploadThing({
    image: { maxFileSize: "4MB" }
  }).onUploadComplete(() => {}),

  attachmentsUploader: uploadThing({
    image: { maxFileSize: "512GB", maxFileCount: 100 },
    video: { maxFileSize: "512GB", maxFileCount: 100 },
    audio: { maxFileSize: "512GB", maxFileCount: 100 },
    blob: { maxFileSize: "512GB", maxFileCount: 100 },
    pdf: { maxFileSize: "512GB", maxFileCount: 100 },
    text: { maxFileSize: "512GB", maxFileCount: 100 }
  }).onUploadComplete(() => {}),

  videoUploader: uploadThing({
    video: { maxFileSize: "512GB", maxFileCount: 5 }
  }).onUploadComplete(() => {})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
