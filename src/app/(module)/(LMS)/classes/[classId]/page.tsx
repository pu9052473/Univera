"use client"
import { UserContext } from "@/context/user"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React, { useContext } from "react"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import ClassDetails from "../../_components/ClassDetails"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import UserCard from "../../_components/UserCard"
import { AddCoordinator, AddMentor } from "../../_components/AddCoordinator"

async function fetchClassById(classId: number) {
  const { data } = await axios.get(`/api/classes/${classId}`)
  return data?.Class
}

export default function ClassEditPage() {
  const { user } = useContext(UserContext)
  const { classId } = useParams()

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
  console.log(Class)
  if (ClassError) {
    return (
      <div className="text-red-500">
        <p>Failed to load class. Please try again later.</p>
        <p className="text-sm text-gray-500">
          {ClassError?.message || "An unexpected error occurred."}
        </p>
        <ButtonV1 icon={RotateCcw} label="Retry" onClick={() => refetch()} />
      </div>
    )
  }
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <ClassDetails Class={Class} isLoading={isLoading} />

      <div className="tab-section p-4 mx-auto w-full h-full">
        {/* Tabs Section */}
        <Tabs defaultValue="coordinator" className="w-full">
          <TabsList className="w-full bg-white border-b">
            {["coordinator", "mentor", "subjects", "faculties", "students"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 capitalize py-3 text-[#0A2353] data-[state=active]:text-[#5B58EB] data-[state=active]:border-b-2 data-[state=active]:border-[#5B58EB]"
                >
                  {tab}
                </TabsTrigger>
              )
            )}
          </TabsList>

          {/* Tab Content Placeholders */}
          {["coordinator", "mentor", "subjects", "faculties", "students"].map(
            (tab) => (
              <TabsContent key={tab} value={tab} className="mt-6">
                {tab === "coordinator" && (
                  <div className="">
                    {Class?.coordinator ? (
                      <UserCard User={Class?.coordinator} />
                    ) : (
                      <div className="">
                        {Class?.course && (
                          <AddCoordinator
                            refetch={refetch}
                            classId={classId as string}
                            CoordinatorUsers={Class?.course?.faculties}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
                {/* mentor Tab */}
                {tab === "mentor" && (
                  <div className="">
                    {Class?.mentor ? (
                      <UserCard User={Class?.mentor} />
                    ) : (
                      <div className="">
                        {Class?.course && (
                          <AddMentor
                            refetch={refetch}
                            classId={classId as string}
                            MentorUsers={Class?.course?.faculties}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  )
}
