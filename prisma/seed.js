const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  // Define roles
  const roles = await prisma.role.createMany({
    data: [
      { rolename: "university_admin" },
      { rolename: "super_user" },
      { rolename: "department_admin" },
      { rolename: "faculty" },
      { rolename: "assistant_professor" },
      { rolename: "student" },
      { rolename: "non_teaching_staff" },
      { rolename: "non_teaching_staff_admin" },
      { rolename: "principal" },
      { rolename: "head_of_department" },
      { rolename: "dean" }
    ]
  })

  //create a super user
  await prisma.user.create({
    data: {
      id: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      clerkId: "user_2pt3xWxXnLZhNLryELX1JgcK2IS",
      email: "kp648027@gmail.com",
      name: "kishan patel",
      phone: "8888888888",
      roles: {
        connect: {
          id: 2
        }
      }
    }
  })
  // Create a university admin user
  const universityAdmin = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      email: "ku578@karnavatiuniversity.edu.in",
      name: "University Admin",
      clerkId: "user_2oo7c0B50nyD00rgejt5Q8e44cg",
      roles: {
        connect: {
          id: 1
        }
      }
    }
  })

  // Create a student user
  const studentUser = await prisma.user.create({
    data: {
      phone: "9898989898",
      id: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      email: "dev-student1@karnavatiuniversity.edu.in",
      name: "student1",
      clerkId: "user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      roles: {
        connect: {
          id: 6
        }
      }
    }
  })

  // Create a university
  await prisma.university.create({
    data: {
      name: "Karnavati University",
      location: "Ahmedabad, India",
      established: 2000,
      adminId: universityAdmin.id
    }
  })
  //create department admin
  const dAdmin = await prisma.user.create({
    data:{
      phone: "9898989898",
      id: "user_2q5KypapxytUXjrf2IPf8Ng7gGF",
      email: "departmentadmin_engineering@karnavatiuniversity.edu.in",
      name: "Engineering Admin",
      clerkId: "user_2q5KypapxytUXjrf2IPf8Ng7gGF",
      roles: {
        connect: {
          id: 3
        }
      }
    }
  })
  //create department
  await prisma.department.create({
    data:{
      id:1,
      name:"Engineering",
      code:"ENG101",
      universityId:1,
      adminId:dAdmin.clerkId
    }
  })
  //create faculty user
  const dummyFacultyUser = await prisma.user.create({
    data:{
      id:"user_2pWbD30knEj1V0jeyFkim67Bo73",
      clerkId:"user_2pWbD30knEj1V0jeyFkim67Bo73",
      name:"dev faculty1",
      email:"dev-faculty1@karnavatiuniversity.edu.in",
      phone:"7894567898",
      roles:{
        connect:{
          id:4
        }
      }
    }
  })
  const course = await prisma.course.create({
    data:{
      id:1,
      code:"CSE101",
      name:"Btech CSE",
      universityId:1,
      totalSemister:8,
      departmentId:1
    }
  })
  const subject  = await prisma.subject.create({
    data:{
      id:1,
      name:"Engineering Mathematics 1",
      code:"2ET100301T",
      credits:3,
      departmentId:1,
      semester:1,
      courseId:1,
      universityId:1,
      departmentId:1,
      forumTags: [],
    }
  })

  const dummyFaculty = await prisma.faculty.create({
    data:{
      id:"user_2pWbD30knEj1V0jeyFkim67Bo73",
      clerkId:"user_2pWbD30knEj1V0jeyFkim67Bo73",
      departmentId:1,
      courseId:1,
      universityId:1,
      subject:{
        connect:{
          id:subject.id
        }
      }
    }
  })

  const dummyStudent = await prisma.student.create({
    data:{
      id:"user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      clerkId:"user_2pWbVEq2ofULWoG6chkZCw0kwkw",
      prn:"1234567890",  
      year:2,
      semister:1,
      guardianEmail:"gardianstudent1@gmail.com",
      gaurdianPhone:"7894567898",
      rollNo:1,
      documents:[],
      mentorId:dummyFaculty.clerkId,
      departmentId:1,
      courseId:1,
      universityId:1,
    }
  })
}

main()
  .then(async () => {
    console.log("data seeded succesfully")

    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })