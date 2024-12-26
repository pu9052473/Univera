"use client"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React, { useContext, useState } from "react"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import ClassDetails from "../../_components/ClassDetails"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import UserCard from "../../_components/UserCard"
import { AddCoordinator, AddMentor } from "../../_components/AddCoordinator"
import ClassFaculties from "../../_components/ClassFaculties"

async function fetchClassById(classId: number) {
  const { data } = await axios.get(`/api/classes/${classId}`)
  return data?.Class
}

export default function ClassEditPage() {
  const { user } = useContext(UserContext)
  const { classId } = useParams()
  const [activeTab, setActiveTab] = useState("coordinator")

  const {
    data: Class,
    error: ClassError,
    refetch,
    isLoading
  } = useQuery({
    queryKey: ["classes", classId, user?.id],
    queryFn: () => fetchClassById(Number(classId)),
    enabled: !!classId && !!user?.id
  })

  if (ClassError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-center">
        <p className="text-red-500 mb-2">
          Failed to load class. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {ClassError?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }

  const tabs = ["coordinator", "mentor", "subjects", "faculties", "students"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto sm:px-2 p-2">
        <ClassDetails Class={Class} isLoading={isLoading} />

        <div className="mt-8 bg-white rounded-xl shadow-sm">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
          >
            <div className="overflow-x-auto">
              <TabsList className="w-full min-w-max h-fit border-b bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className={`
                      flex-1 min-w-[120px] capitalize py-4 px-4
                      text-sm sm:text-base font-medium
                      text-TextTwo transition-all duration-200
                      hover:text-Primary
                      data-[state=active]:text-Primary
                      data-[state=active]:border-b-2
                      data-[state=active]:border-Dark
                      focus:outline-none focus:ring-2 focus:ring-Dark/20
                    `}
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-4 sm:p-6">
              {tabs.map((tab) => (
                <TabsContent
                  key={tab}
                  value={tab}
                  className="mt-4 focus:outline-none"
                >
                  {tab === "coordinator" && (
                    <div className="space-y-4">
                      {Class?.coordinator ? (
                        <UserCard User={Class.coordinator} />
                      ) : (
                        Class?.course && (
                          <AddCoordinator
                            refetch={refetch}
                            classId={classId as string}
                            CoordinatorUsers={Class.course.faculties}
                          />
                        )
                      )}
                    </div>
                  )}

                  {tab === "mentor" && (
                    <div className="space-y-4">
                      {Class?.mentor ? (
                        <UserCard User={Class.mentor} />
                      ) : (
                        Class?.course && (
                          <AddMentor
                            refetch={refetch}
                            classId={classId as string}
                            MentorUsers={Class.course.faculties}
                          />
                        )
                      )}
                    </div>
                  )}

                  {tab === "faculties" && (
                    <div>
                      {Class?.course.faculties && (
                        <ClassFaculties
                          refetch={refetch}
                          classId={Number(classId)}
                          faculties={Class.course.faculties}
                        />
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
