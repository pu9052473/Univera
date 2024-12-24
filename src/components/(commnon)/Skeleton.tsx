import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles
import { Card, CardContent, CardFooter } from "../ui/card"

export const CoursesSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton height={40} count={1} width="30%" /> {/* Heading skeleton */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={30} count={1} />
        ))}
      </div>
    </div>
  )
}

export const CourseFormSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <Skeleton height={40} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>

      <div className="space-y-4">
        <Skeleton height={40} width="50%" />
        <Skeleton height={20} width="30%" />
      </div>

      <div className="space-y-4">
        <Skeleton height={40} width="40%" />
        <Skeleton height={20} width="30%" />
      </div>

      <div className="flex items-center gap-x-4">
        <Skeleton height={45} width={120} />
        <Skeleton height={45} width={120} />
        <Skeleton height={45} width={120} />
      </div>
    </div>
  )
}

export const ClassesCardSkeleton = () => {
  return (
    <Card className="h-full">
      <div className="relative w-full aspect-video">
        <Skeleton className="h-full w-full rounded-t-lg" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-28" />
      </CardFooter>
    </Card>
  )
}
