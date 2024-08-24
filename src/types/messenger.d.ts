import {StatusMessage} from "@/types/enum";

export type Avatar = {
  url: string,
  width: number,
  height: number,
  fileSize: number,
  createdAt: string
}
export type Items = {
  id: number,
  ownerId: number,
  receiverId: number,
  messageText: string,
  createdAt: string,
  updatedAt: string,
  messageType: "TEXT",
  status: StatusMessage,
  userName: string,
  avatars: Avatar[]
}
interface IMessageInfo {
  pageSize: number,
  totalCount: number,
  items: Items[]
}

interface IMessageSend {
  message : string,  
  receiverId : number
}

interface IMessageType {
  id: number,
  ownerId: number,
  receiverId: number,
  messageText: string,
  status: StatusMessage,
  messageType: "TEXT",
  createdAt: string,
  updatedAt: string
}

type ResponseDialogsByUser = Omit<IMessageInfo, 'items'> & {
  items: IMessageType[]
}