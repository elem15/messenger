type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
}

type SearchUsersItems = {
  avatars: Avatar[]
  createdAt: string
  firstName: string
  id: number
  lastName: string
  userName: string
}

interface ISearchUsers {
  items: SearchUsersItems[]
  nextCursor: number
  page: number
  pageSize: number
  pagesCount: number
  prevCursor: number
  totalCount: number
}

interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  avatars: Avatar[];
}