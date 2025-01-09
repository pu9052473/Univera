import * as React from "react"
import { AdminRoutes, ModeratorRoutes, UserRoutes } from "./Routes"
import { RenderIconsRoutes } from "./RenderRoutes"

type UserTabProps = {
  roles: number[]
}

const UserTab = ({ roles }: UserTabProps) => {
  const adminIconsRouter = () => {
    return <>{RenderIconsRoutes({ routes: AdminRoutes })}</>
  }

  const userIconsRouter = () => {
    return <>{RenderIconsRoutes({ routes: UserRoutes })}</>
  }

  const moderatorIconsRouter = () => {
    return <>{RenderIconsRoutes({ routes: ModeratorRoutes })}</>
  }

  return (
    <div className="flex mx-auto gap-2 mb-8 tabs justify-center flex-wrap">
      {(roles.includes(1) || roles.includes(3)) && adminIconsRouter()}
      {(roles.includes(12) || roles.includes(10)) && moderatorIconsRouter()}
      {(roles.includes(4) || roles.includes(5) || roles.includes(11)) &&
        userIconsRouter()}
    </div>
  )
}

export default UserTab
