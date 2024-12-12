import React from "react"
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
  return (
    <div
      style={{
        color: colorPalette.Secondary,
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
        <CourseCard
          title="FIT1043 S2 2024"
          description="Introduction to data science"
          color={colorPalette.ColorOne}
        />
        <CourseCard
          title="FIT1045 S2 2024"
          description="Introduction to programming"
          color={colorPalette.ColorOne}
        />
        <CourseCard
          title="FIT1047 S2 2024"
          description="Introduction to computer systems, networks and security"
          color={colorPalette.ColorTwo}
        />
        <CourseCard
          title="FIT Club Space"
          description="FIT Club Space"
          color={colorPalette.ColorThree}
        />
      </div>
    </div>
  )
}

interface CourseCardProps {
  title: string
  description: string
  color: string
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  color
}) => {
  return (
    <div
      style={{
        backgroundColor: "#F1F5F9",
        padding: "30px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2)`
        }
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
        <div style={{ color, fontWeight: "bold", fontSize: "1.2rem" }}>99+</div>
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
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)"
            }
          }}
        >
          <IoChevronForward style={{ fontSize: "1.5rem" }} />
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
