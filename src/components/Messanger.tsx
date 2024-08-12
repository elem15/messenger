import { Typography } from '../common/typography/typography';
import DebouncedInput from '../lib/utils/DebouncedInput';
import { useEffect, useState } from 'react';
import s from './Messanger.module.scss';
import { useGetMessengerByIdQuery, useGetMessengerQuery } from '../app/api/messanger/messangerApi';
import { Footer } from './footer/Footer';
import { SocketApi } from '../app/api/socket/socket-api';
import { Users } from './users/Users';
import { IMessageType } from '@/types/messanger';
import { useGetUsersNameQuery } from '@/app/api/users/usersApi';
import { SearchUserResults } from './users/SearchUserResults';
import { AvatarSmallView } from '@/common/avatar';

export type CurrentUser = {
  avaUrl: string, 
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

  const { data: dialogUsers } = useGetMessengerQuery({accessToken});
  // const { data: searchedUsers } = useGetUsersNameQuery({
  //   name: valueSearch ? valueSearch : '',
  //   accessToken: accessToken as string,
  // })

  const { data } = useGetMessengerByIdQuery({accessToken, userId: 3})

  const onDebounce = (value: string) => {
    setValueSearch(value);
    setIsShowUsersFromSearch(true)
  };

  function sendMessage() {
    accessToken && SocketApi.creatConnection(accessToken);
    const messageData = {
      message: newMessage,
      receiverId,
    };

    SocketApi.socket?.emit('receive-message', messageData);
  }

  useEffect(() => {
    // Обработчик получения сообщения
    SocketApi.socket?.on('receive-message', (message: IMessageType) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);

      // Подтверждение получения сообщения
      SocketApi.socket?.emit('acknowledge', { messageId: message.id, status: 'RECEIVED' });
    });

    // Обработчик удаления сообщения
    // SocketApi.socket?.on('message-deleted', (messageId) => {
    //   console.log('Message deleted:', messageId);
    //   setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== messageId));
    // });

    // Обработчик ошибок
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

  console.log(messages)

  return (
    <>
      <Typography variant="h1">Messenger</Typography>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.searchBox}>
            <DebouncedInput setClearSearch={setClearSearch} clearSearch={clearSearch} callback={onDebounce} />
          </div>
          {currentUser && <div className={s.currentUser}>
          <AvatarSmallView avatarOwner={currentUser?.avaUrl} className="h-fit" />
          <Typography>{`${currentUser?.name.firstName } ${currentUser?.name.lastName}`}</Typography>
          </div>}
        </div>
        <div className={s.boxContent}>
          <div className={s.usersList}>
            11
            {
              isShowUsersFromSearch ? 
                <SearchUserResults 
                  setClearSearch={setClearSearch} 
                  setCurrentUser={setCurrentUser} 
                  callback={setIsShowUsersFromSearch}
                  valueSearch={valueSearch}
                  // users={searchedUsers}
                  setReceiverId={setReceiverId}
                /> :
              dialogUsers && <Users 
                                setCurrentUser={setCurrentUser}  
                                setReceiverId={setReceiverId} 
                                users={dialogUsers.items} 
                              /> 
            }
          </div>
          <div className={s.boxDialogs}>
            <div className={s.dialogs}>
              {currentUser ? 
                messages.map(msg => (<Typography>{msg.messageText}</Typography>)) :
                <Typography className='flex items-center'>Выберите, кому хотели бы написать</Typography>
                }
            </div>
            {currentUser && <Footer 
                              clearSearch={clearSearch} 
                              sendMessage={sendMessage} 
                              setMessageValue={setNewMessage}
                            />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
