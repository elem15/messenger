import { Items } from "../../types/messanger"
import { User } from "./User"

type Props = {
  users: Items[]
  setReceiverId: (value: number) => void
}
export const Users = ({ users, setReceiverId }: Props) => {
  return (
    <>
      {users.map(user => (
        <User 
          key={user.id} 
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