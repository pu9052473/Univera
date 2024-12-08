const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  // Seed Roles
  const roles = [
    { id: 1, rolename: "admin" },
    { id: 6, rolename: "superuser" },
    { id: 2, rolename: "student" },
    { id: 3, rolename: "faculty" },
    { id: 4, rolename: "assistant_professor" },
    { id: 5, rolename: "professor" }
  ]
  await prisma.role.createMany({ data: roles, skipDuplicates: true })
  // Seed Users
  const admin = await prisma.user.create({
    data: {
      email: "ku578@karnavatiuniversity.edu.in",
      clerkId: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      id: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      roles: { connect: { id: roles[0].id } }
    }
  })

  const faculty1 = await prisma.user.create({
    data: {
      email: "dev-faculty1@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbD30knEj1V0jeyFkim67Bo73",
      id: "user_2pWbD30knEj1V0jeyFkim67Bo73",
      roles: { connect: { id: roles[3].id } }
    }
  })

  const faculty2 = await prisma.user.create({
    data: {
      email: "dev-faculty2@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbMrpqSrAAOHCAKRZ5uWVFz7W",
      id: "user_2pWbMrpqSrAAOHCAKRZ5uWVFz7W",
      roles: { connect: { id: roles[3].id } }
    }
  })
  const faculty3 = await prisma.user.create({
    data: {
      email: "dev-faculty3@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbOT0zpbSXgUKmyUvHDiWBU42",
      id: "user_2pWbOT0zpbSXgUKmyUvHDiWBU42",
      roles: { connect: { id: roles[3].id } }
    }
  })
  const faculty4 = await prisma.user.create({
    data: {
      email: "dev-faculty4@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbQmzbDpySFUgDa6UbuOxBf3a",
      id: "user_2pWbQmzbDpySFUgDa6UbuOxBf3a",
      roles: { connect: { id: roles[3].id } }
    }
  })

  const student1 = await prisma.user.create({
    data: {
      email: "dev-student1@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      id: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      roles: { connect: { id: roles[2].id } }
    }
  })

  const student2 = await prisma.user.create({
    data: {
      email: "dev-student2@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbXiKHxXfDENAvXSfV0bcgYOu",
      id: "user_2pWbXiKHxXfDENAvXSfV0bcgYOu",
      roles: { connect: { id: roles[2].id } }
    }
  })
  const student3 = await prisma.user.create({
    data: {
      email: "dev-student3@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbYujKlenmASI5FzPVlxrIyyC",
      id: "user_2pWbYujKlenmASI5FzPVlxrIyyC",
      roles: { connect: { id: roles[2].id } }
    }
  })
  const student4 = await prisma.user.create({
    data: {
      email: "dev-student4@karnavatiuniversity.edu.in",
      clerkId: "user_2pWbaWfOHlu8paRAdnceN9lZA0a",
      id: "user_2pWbaWfOHlu8paRAdnceN9lZA0a",
      roles: { connect: { id: roles[2].id } }
    }
  })
  // Seed University
  const university = await prisma.university.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Karnavati University",
      location: "Ahmedabad, India",
      established: 2012,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    }
  })

  // Seed Departments
  const departments = [
    {
      id: 1,
      name: "B Tech",
      code: "BT101",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: 2,
      name: "Bsc",
      code: "BSC102",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    }
  ]
  await prisma.department.createMany({
    data: departments,
    skipDuplicates: true
  })

  // Seed Courses
  const courses = [
    {
      id: 1,
      name: "Comuter Engineering",
      code: "CE1",
      credits: 4,
      departmentId: 1,
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: 2,
      name: "Mechanical Engineering",
      code: "ME1",
      credits: 4,
      departmentId: 1,
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: 3,
      name: "BSC-It",
      code: "BSC-IT1",
      credits: 4,
      departmentId: 2,
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: 4,
      name: "BSC-Chemistry",
      code: "BSC-CHEM1",
      credits: 4,
      departmentId: 2,
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    }
  ]
  await prisma.course.createMany({ data: courses, skipDuplicates: true })

  // Seed Faculties
  const faculties = [
    {
      id: "user_2pWbD30knEj1V0jeyFkim67Bo73",
      name: "Dr. Ravi Kumar",
      email: "dev-faculty1@karnavatiuniversity.edu.in",
      phone: "+91-9876543210",
      departmentId: 1,
      courseId: 1,
      clerkId: "user_2pWbD30knEj1V0jeyFkim67Bo73",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbMrpqSrAAOHCAKRZ5uWVFz7W",
      name: "Prof. Sneha Patel",
      email: "dev-faculty2@karnavatiuniversity.edu.in",
      phone: "+91-9876543211",
      departmentId: 1,
      courseId: 2,
      clerkId: "user_2pWbMrpqSrAAOHCAKRZ5uWVFz7W",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbOT0zpbSXgUKmyUvHDiWBU42",
      name: "Dr. Arjun Mehta",
      email: "dev-faculty3@karnavatiuniversity.edu.in",
      phone: "+91-9876543212",
      departmentId: 2,
      courseId: 3,
      clerkId: "user_2pWbOT0zpbSXgUKmyUvHDiWBU42",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbQmzbDpySFUgDa6UbuOxBf3a",
      name: "Prof. Kavita Shah",
      email: "dev-faculty4@karnavatiuniversity.edu.in",
      phone: "+91-9876543213",
      departmentId: 2,
      courseId: 3,
      clerkId: "user_2pWbQmzbDpySFUgDa6UbuOxBf3a",
      universityId: university.id,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    }
  ]
  await prisma.faculty.createMany({ data: faculties, skipDuplicates: true })

  // Seed Students
  const students = [
    {
      id: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      name: "Amit Shah",
      email: "dev-student1@karnavatiuniversity.edu.in",
      phone: "+91-9876543220",
      year: 2,
      departmentId: 1,
      courseId: 1,
      universityId: university.id,
      clerkId: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbXiKHxXfDENAvXSfV0bcgYOu",
      name: "Priya Desai",
      email: "dev-student2@karnavatiuniversity.edu.in",
      phone: "+91-9876543221",
      year: 3,
      departmentId: 1,
      courseId: 2,
      universityId: university.id,
      clerkId: "user_2pWbXiKHxXfDENAvXSfV0bcgYOu",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbYujKlenmASI5FzPVlxrIyyC",
      name: "Rajesh Singh",
      email: "dev-student3@karnavatiuniversity.edu.in",
      phone: "+91-9876543222",
      year: 1,
      departmentId: 2,
      courseId: 3,
      universityId: university.id,
      clerkId: "user_2pWbYujKlenmASI5FzPVlxrIyyC",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "user_2pWbaWfOHlu8paRAdnceN9lZA0a",
      name: "Sneha Verma",
      email: "dev-student4@karnavatiuniversity.edu.in",
      phone: "+91-9876543223",
      year: 4,
      departmentId: 2,
      courseId: 3,
      universityId: university.id,
      clerkId: "user_2pWbaWfOHlu8paRAdnceN9lZA0a",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z")
    }
  ]
  await prisma.student.createMany({ data: students, skipDuplicates: true })

  console.log("Data seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
