import { AvatarSmallView } from "@/common/avatar"
import { Typography } from "@/common/typography/typography"
import { CurrentUser } from "src/components/Messenger"
import { useGetUsersNameQuery } from "@/app/api/users/usersApi"
import { Dispatch } from "react"

type Props = {
  // users: IUser[]
  setIsFetchUser: Dispatch<(prev: boolean) => boolean>
  callback: (value: boolean) => void
  setCurrentUser: ({userId, avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  valueSearch: string
  setClearSearch: (vol: '') => void
  setReceiverId: (val: number | null) => void
}
export const SearchUserResults = ({
  callback, 
  valueSearch, 
  setIsFetchUser, 
  setCurrentUser, 
  setClearSearch, 
  setReceiverId}: Props
) => {
  const accessToken = localStorage.getItem('token');
  
  const { data: users } = useGetUsersNameQuery({
    name: valueSearch ? valueSearch : '',
    accessToken: accessToken as string,
  })
  
  const onClickHandle = (avaUrl: string, firstName: string, lastName: string, id: number) => {
    callback(false)
    setCurrentUser({userId: id, avaUrl, name:{firstName, lastName}})
    setClearSearch('')
    setReceiverId(id)
    setIsFetchUser(prev => !prev)
  }
  return (
    <>
      {users?.map(user => (
        <div
          key={user.id}
          className="flex gap-3 p-[7px] w-[270px] border-r border-b border-[#4c4c4c] bg-[#171717] cursor-pointer hover:bg-[#4c4c4c]"
          onClick={() => onClickHandle(user.avatars[0]?.url, user.firstName, user.lastName, user.id) }
        >
          <AvatarSmallView avatarOwner={user.avatars[0]?.url} className="h-fit" />
          <Typography>{`${user.firstName || '...' } ${user.lastName || '...'}`}</Typography>
        </div>
      ))}
    </>
  )
}