import Container from "./Container"
import RequestForm from "./RequestForm"
import { Balances } from "@prisma/client"

type Props = {
  user: any
  refetch: () => void
  balance: Balances[]
}

const WelcomeBanner = ({ user, refetch, balance }: Props) => {
  return (
    <Container>
      <div className="flex flex-wrap justify-between items-center my-6 ">
        {/* LEFT SIDE */}
        <div className="flex justify-start items-center">
          <h2 className="text-xl font-extrabold leading-tight  lg:text-2xl">
            Welcome {user?.name}!
          </h2>
        </div>

        {/* RIGHT SIDE  */}

        <div className="flex items-center space-x-3 md:space-x-6 bg-Primary">
          <RequestForm user={user} refetch={refetch} balance={balance} />
        </div>
      </div>
    </Container>
  )
}

export default WelcomeBanner
