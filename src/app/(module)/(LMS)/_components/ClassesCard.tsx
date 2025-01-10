import React from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ArrowRight } from "lucide-react"
import { IconBadge } from "@/components/iconBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Class } from "@prisma/client"

interface ClassesCardProps {
  Class: Class
  isFaculty?: boolean
}

const ClassesCard = ({ Class, isFaculty }: ClassesCardProps) => {
  return (
    <Card className="cursor-pointer group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="relative w-full aspect-video">
        <Image
          fill
          className="object-cover rounded-t-lg"
          alt={Class.name}
          src={
            "https://imgs.search.brave.com/7MQBiAdZz7Xq2Zt05HTyM25TDm-T7_PGSEc3mgV44Xw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvc2Ix/MDA2OTQ3OGEtMDAx/L3Bob3RvL2hpZ2gt/c2Nob29sLWNsYXNz/cm9vbS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9SElaY3M1/d002dGVkR1JQZW1X/V01iWnp1WHNHVnBj/QVMtdEV1XzBma1ZY/cz0"
          }
        />
        <Badge className="absolute top-2 right-2 bg-white/80 text-black">
          {Class.code}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-Primary text-Dark transition-colors">
          {Class.name}
        </h3>
        <div className="flex items-center gap-x-2 text-sm text-slate-600">
          <IconBadge size="sm" icon={BookOpen} />
          <span>Semester {Class.semister}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Link
          href={`/classes`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          View all classes
        </Link>

        <Link
          href={
            isFaculty ? `/classes/my-class/${Class.id}` : `/classes/${Class.id}`
          }
        >
          <Button size="sm" className="flex items-center gap-x-2">
            View Details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ClassesCard
