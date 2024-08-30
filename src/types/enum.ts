export enum StatusMessage {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  READ = 'READ'
}

export enum WS_EVENT_PATH {
  RECEIVE_MESSAGE = 'receive-message',
  UPDATE_MESSAGE = 'update-message',
  MESSAGE_SENT = 'message-sent',
  MESSAGE_DELETED = 'message-deleted',
  NOTIFICATIONS = 'notifications',
  ERROR = 'error',
}