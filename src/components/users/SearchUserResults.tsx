import { AvatarSmallView } from "@/common/avatar"
import { Typography } from "@/common/typography/typography"
import { CurrentUser } from "../Messanger"
import { useGetUsersNameQuery } from "@/app/api/users/usersApi"

type Props = {
  // users: IUser[]
  callback: (value: boolean) => void
  setCurrentUser: ({avaUrl, name: {firstName, lastName}}: CurrentUser) => void
  valueSearch: string
  setClearSearch: (vol: '') => void
  setReceiverId: (val: number | null) => void
}
export const SearchUserResults = ({callback, valueSearch, setCurrentUser, setClearSearch, setReceiverId}: Props) => {
  const accessToken = localStorage.getItem('token');
  
  const { data: users } = useGetUsersNameQuery({
    name: valueSearch ? valueSearch : '',
    accessToken: accessToken as string,
  })
  
  const onClickHandle = (avaUrl: string, firstName: string, lastName: string, id: number) => {
    callback(false)
    setCurrentUser({avaUrl, name:{firstName, lastName}})
    setClearSearch('')
    setReceiverId(id)
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