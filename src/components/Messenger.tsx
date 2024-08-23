import { Typography } from '@/common/typography/typography';
import DebouncedInput from '../lib/utils/DebouncedInput';
import { useEffect, useState } from 'react';
import s from '@/components/Messenger.module.scss';
import { useLazyGetMessengerByIdQuery, useLazyGetMessengerQuery } from '@/app/api/messenger/messengerApi';
import { Footer } from './footer/Footer';
import { SocketApi } from '@/app/api/socket/socket-api';
import { Users } from './users/Users';
import { IMessageType } from '@/types/messanger';
import { SearchUserResults } from './users/SearchUserResults';
import { AvatarSmallView } from '@/common/avatar';
import { Dialogs } from './dialogs/Dialogs';

export type CurrentUser = {
  userId: number
  avaUrl: string
  name: {firstName: string, lastName: string}
}
const Messenger = () => {
  const accessToken = localStorage.getItem('token');

  const [valueSearch, setValueSearch] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessageType[]>([]);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [isShowUsersFromSearch, setIsShowUsersFromSearch] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [clearSearch, setClearSearch] = useState<'' | null>(null)
  const [isFetchUser, setIsFetchUser] = useState<boolean>(false)

  const [ getUsers, {data: dialogUsers} ] = useLazyGetMessengerQuery();

  const [getDialogsByUser, {data: dialogUser, isFetching} ] = useLazyGetMessengerByIdQuery()

  const onDebounce = (value: string) => {
    if (value) {
      setValueSearch(value);
      setIsShowUsersFromSearch(true)
    } else {
      setIsFetchUser(false)
      setIsShowUsersFromSearch(false)
    }
  };

  function sendMessage() {
    accessToken && SocketApi.creatConnection(accessToken);
    const messageData = {
      message: newMessage,
      receiverId,
    };

    SocketApi.socket?.emit('receive-message', messageData);
    setIsFetchUser(prev => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      await getUsers({ accessToken }).then(res => {
        res.isSuccess && setIsFetchUser(true)
      });
      if (currentUser?.userId) {
        await getDialogsByUser({ accessToken, userId: currentUser.userId });
      }
    };

    fetchData();
  }, [isFetchUser, currentUser])

  useEffect(() => {
    // Обработчик получения сообщения
    SocketApi.socket?.on('receive-message', (message: IMessageType) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [message, ...prevMessages]);

      // Подтверждение получения сообщения
      SocketApi.socket?.emit('acknowledge', { messageId: message.id, status: 'RECEIVED' });
    });

    // Обработчик удаления сообщения
    // SocketApi.socket?.on('message-deleted', (messageId) => {
    //   console.log('Message deleted:', messageId);
    //   setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
    // });

    SocketApi.socket?.on('error', (error) => {
      console.error('Error occurred:', error);
    });

    return () => {
      SocketApi.socket?.off('receive-message');
      SocketApi.socket?.off('update-message');
      SocketApi.socket?.off('message-deleted');
      SocketApi.socket?.off('error');
    };
  }, []);

  return (
      <div className='flex flex-col h-full'>
        <Typography variant="h1">Messenger</Typography>
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.searchBox}>
              <DebouncedInput setClearSearch={setClearSearch} clearSearch={clearSearch} callback={onDebounce}/>
            </div>
            {currentUser && <div className={s.currentUser}>
              <AvatarSmallView avatarOwner={currentUser?.avaUrl} className="h-fit"/>
              <Typography>
                {`${currentUser?.name.firstName || '...'} ${currentUser?.name.lastName || '...'}`}
              </Typography>
            </div>}
          </div>
          <div className={s.boxContent}>
            <div className={s.usersList}>
              {
                isShowUsersFromSearch ?
                  <SearchUserResults
                    setIsFetchUser={setIsFetchUser}
                    setClearSearch={setClearSearch}
                    setCurrentUser={setCurrentUser}
                    callback={setIsShowUsersFromSearch}
                    valueSearch={valueSearch}
                    setReceiverId={setReceiverId}
                  /> :
                  dialogUsers && <Users
                    setIsFetchUser={setIsFetchUser}
                    setCurrentUser={setCurrentUser}
                    setReceiverId={setReceiverId}
                    users={dialogUsers.items}
                  />
              }
            </div>
            <div className={s.containerDialogs}>
              <div className={currentUser ? s.afterChange : s.change}>
                {!isFetching ?
                  <Dialogs currentUser={currentUser} dialogUser={dialogUser}/> :
                  <Typography variant={'h1'} className={s.change}>Loading...</Typography>}
              </div>
              {currentUser && <Footer
                clearSearch={clearSearch}
                sendMessage={sendMessage}
                setMessageValue={setNewMessage}
              />}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Messenger;
