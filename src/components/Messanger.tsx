import { Typography } from '../common/typography/typography';
import DebouncedInput from '../lib/utils/DebouncedInput';
import { useEffect, useState } from 'react';
import s from './Messanger.module.scss';
import { useGetMessengerQuery } from '../app/api/messanger/messangerApi';
import { Footer } from './footer/Footer';
import { SocketApi } from '../app/api/socket/socket-api';
import { Users } from './users/Users';
import { IMessageType } from '@/types/messanger';
import { useGetUsersNameQuery } from '@/app/api/users/usersApi';
import { SearchUserResults } from './users/SearchUserResults';
import { AvatarSmallView } from '@/common/avatar';

const Messenger = () => {
  const accessToken = localStorage.getItem('token');

  const [valueSearch, setValueSearch] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<IMessageType[]>([]);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [isShowUsersFromSearch, setIsShowUsersFromSearch] = useState<boolean>(false)

  const { data } = useGetMessengerQuery({ searchName: valueSearch });
  const { data: users, isLoading } = useGetUsersNameQuery({
    name: valueSearch ? valueSearch : null,
    accessToken: accessToken as string,
  })
  
  console.dir(users)

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

  return (
    <>
      <Typography variant="h1">Messenger</Typography>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.searchBox}>
            <DebouncedInput callback={onDebounce} />
          </div>
          <div className={s.currentUser}>
          <AvatarSmallView className="h-fit" />
          <Typography>User</Typography>
          </div>
        </div>
        <div className={s.boxContent}>
          <div className={s.usersList}>
            11
            {isShowUsersFromSearch ? 
              users && <SearchUserResults callback={setIsShowUsersFromSearch} users={users} />
             :
              data && <Users setReceiverId={setReceiverId} users={data.items} /> }
          </div>
          <div className={s.boxDialogs}>
            <div className={s.dialogs}>13123123123</div>
            <Footer sendMessage={sendMessage} setMessageValue={setNewMessage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
