import React from "react"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { ButtonV1 } from "@/components/(commnon)/ButtonV1"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Class } from "@prisma/client"
import "react-loading-skeleton/dist/skeleton.css"
import { ClassDetailsSkeleton } from "@/components/(commnon)/Skeleton"

interface ClassDetailsProps {
  Class?: Class
  isLoading?: boolean
}

const ClassDetails = ({ Class, isLoading = false }: ClassDetailsProps) => {
  if (isLoading) {
    return <ClassDetailsSkeleton />
  }

  if (!Class) {
    return null
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="w-full bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Image Container */}
            <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
              <Image
                src={
                  "https://imgs.search.brave.com/7MQBiAdZz7Xq2Zt05HTyM25TDm-T7_PGSEc3mgV44Xw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvc2Ix/MDA2OTQ3OGEtMDAx/L3Bob3RvL2hpZ2gt/c2Nob29sLWNsYXNz/cm9vbS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9SElaY3M1/d002dGVkR1JQZW1X/V01iWnp1WHNHVnBj/QVMtdEV1XzBma1ZY/cz0"
                }
                alt={Class.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Class Info */}
            <div className="flex-grow space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#112C71]">
                    {Class.name}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-[#87CEEB] text-[#112C71]">
                      Semester {Class.semister}
                    </Badge>
                    <Badge className="bg-[#CECDF9] text-[#112C71]">
                      Code: {Class.code}
                    </Badge>
                  </div>
                </div>
                <ButtonV1
                  icon={Pencil}
                  id="edit-course"
                  href={`/classes/${Class.id}/edit`}
                  label="Edit Course"
                  className="bg-[#5B58EB] text-white hover:bg-[#4845c7]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClassDetails
