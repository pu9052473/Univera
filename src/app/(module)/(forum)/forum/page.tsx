"use client"

import { UserContext } from "@/context/user"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import React, { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { IoChevronForward } from "react-icons/io5"

const colorPalette = {
  Primary: "#112C71",
  Secondary: "#CECDF9",
  TextTwo: "#0A2353",
  ColorOne: "#56E1E9",
  ColorTwo: "#BB63FF",
  ColorThree: "#5B58EB"
}

const CoursesPage: React.FC = () => {
  const router = useRouter()
  const userData = useUser()
  const { user } = useContext(UserContext)
  const userRole = userData.user?.publicMetadata.role
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    if (user) {
      const fetchSubjects = async () => {
        try {
          const courseId =
            userRole === "student"
              ? user.student.courseId
              : userRole === "faculty"
                ? user.faculty.courseId
                : null

          if (!courseId) {
            toast.error("No valid courseId found for userRole")
            return
          }

          const response = await fetch(`/api/subjects?courseId=${courseId}`)
          if (!response.ok) {
            toast.error("Failed to fetch the subjects")
          }

          const data = await response.json()
          setSubjects(data.subjects)
        } catch (error: any) {
          toast.error("An error occurred while fetching subjects:", error)
        }
      }

      fetchSubjects()
    }
  }, [user])

  return (
    <div
      style={{
        color: colorPalette.ColorTwo,
        fontFamily: "Roboto, sans-serif",
        padding: "40px 20px"
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>Subjects</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "30px"
        }}
      >
        {subjects.length > 0 ? (
          subjects.map((subject: any, index: number) => (
            <CourseCard
              key={subject.id}
              title={subject.name}
              description={subject.description || "No description available"}
              color={
                [
                  colorPalette.ColorOne,
                  colorPalette.ColorTwo,
                  colorPalette.ColorThree
                ][index % 3]
              }
              onClick={() => router.push(`/forum/${subject.id}`)}
            />
          ))
        ) : (
          <p> No subject forums available for your course</p>
        )}
      </div>
    </div>
  )
}

interface CourseCardProps {
  title: string
  description: string
  color: string
  onClick?: () => void
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  color,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "#F1F5F9",
        padding: "30px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
        transition: "transform 0.3s ease",
        cursor: "pointer"
      }}
    >
      <div>
        <h3 style={{ color, fontSize: "1.5rem", marginBottom: "10px" }}>
          {title}
        </h3>
        <p style={{ color: colorPalette.TextTwo, fontSize: "1.1rem" }}>
          {description}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px"
        }}
      >
        {/* notification-dynamicaly */}
        <div style={{ color, fontWeight: "bold", fontSize: "1.2rem" }}></div>
        <div
          style={{
            backgroundColor: color,
            color: colorPalette.Primary,
            padding: "10px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.3s ease"
          }}
        >
          <IoChevronForward style={{ fontSize: "1.5rem" }} />
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
