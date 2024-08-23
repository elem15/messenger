import { Dispatch } from "react"
import { Items } from "@/types/messanger"
import { CurrentUser } from "src/components/Messenger"
import { User } from "./User"
import { Scroller } from "@/common/scroller/Scroller"

type Props = {
  users: Items[]
  setReceiverId: (value: number) => void
  setCurrentUser: ({userId, avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  setIsFetchUser: Dispatch<(prev: boolean) => boolean>
}
export const Users = ({ users, setReceiverId, setIsFetchUser, setCurrentUser }: Props) => {
  const myId = Number(localStorage.getItem("userId"))

  return (
    <Scroller>
        {users.map(user => (
          <User 
            key={user.id}
            setIsFetchUser={setIsFetchUser}
            setCurrentUser={setCurrentUser}
            dateMessage={user.createdAt} 
            receiverId={user.receiverId === myId ? user.ownerId : user.receiverId}
            text={user.messageText} 
            userName={user.userName} 
            setReceiverId={setReceiverId}
            avatar={user.avatars}
          />
        ))}
    </Scroller>
  )
}