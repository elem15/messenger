import { Items } from "../../types/messanger"
import { CurrentUser } from "../Messanger"
import { User } from "./User"

type Props = {
  users: Items[]
  setReceiverId: (value: number) => void
  setCurrentUser: ({avaUrl, name: {firstName, lastName}}: CurrentUser) => void
}
export const Users = ({ users, setReceiverId, setCurrentUser }: Props) => {
  return (
    <>
      {users.map(user => (
        <User 
          key={user.id}
          setCurrentUser={setCurrentUser}
          dateMessage={user.createdAt} 
          receiverId={user.receiverId} 
          text={user.messageText} 
          userName={user.userName} 
          setReceiverId={setReceiverId}
          avatar={user.avatars}
        />
      ))}
    </>
  )
}