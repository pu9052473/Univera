export {}

// Create a type for the roles
export type Roles = "university_admin" | "university_admin_staff" | "faculty"

export type chatMessage = {
  id: number
  message: string
  userId: string
  forumId: number
  createdAt: string
}

export type Forum = {
  id: number
  name: string
  userId: number
  subjectId: number
  departmentId: number
  moderatorId: number
  courseId: number
  forumTags: string[]
  isPrivate: boolean
  status: string
}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
