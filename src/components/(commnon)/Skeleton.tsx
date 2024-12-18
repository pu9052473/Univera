import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css" // Import default styles

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
