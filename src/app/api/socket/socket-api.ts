import { io, Socket } from 'socket.io-client'

export class SocketApi {
  static socket: null | Socket = null

  static creatConnection(token: string) {
    const socketOptions = {
      query: {
        accessToken: token,
      },
    }

    this.socket = io('https://inctagram.work', socketOptions)
  }
}