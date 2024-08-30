import { Typography } from '@/common/typography/typography';
import DebouncedInput from '../lib/utils/DebouncedInput';
import { useEffect, useState } from 'react';
import s from '@/components/Messenger.module.scss';
import { useLazyGetMessengerByIdQuery, useLazyGetMessengerQuery } from '@/app/api/messenger/messengerApi';
import { Footer } from './footer/Footer';
import { SocketApi } from '@/socket-api';
import { Users } from './users/Users';
import { IMessageType } from '@/types/messenger';
import { SearchUserResults } from './users/SearchUserResults';
import { AvatarSmallView } from '@/common/avatar';
import { Dialogs } from './dialogs/Dialogs';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import {useTranslation} from "@/lib/hooks/useTranslation";
import {string} from "prop-types";
import {WS_EVENT_PATH} from "@/types/enum";
import {message} from "memfs/lib/internal/errors";

TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

export type CurrentUser = {
  userId: number
  avaUrl: string
  name: {firstName: string, lastName: string}
}

type Props = {
  language?: 'en' | 'ru'
}

const Messenger = ({language = 'en'}: Props) => {
  const { t } = useTranslation(language)
  const accessToken = localStorage.getItem('token-remote');
  const myId = localStorage.getItem('userId');

  const [valueSearch, setValueSearch] = useState<string>('');
  // const [newMessage, setNewMessage] = useState<string>('');
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [isShowUsersFromSearch, setIsShowUsersFromSearch] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [clearSearch, setClearSearch] = useState<'' | null>(null)
  const [isFetchUser, setIsFetchUser] = useState<boolean>(false)
  const [isLoadingDialog, setIsLoadingDialog] = useState<boolean>(false)

  const [ getUsers, {data: dialogUsers} ] = useLazyGetMessengerQuery();

  const [getDialogsByUser, {data: dialogUser} ] = useLazyGetMessengerByIdQuery()

  const onDebounce = (value: string) => {
    if (value) {
      setValueSearch(value);
      setIsShowUsersFromSearch(true)
    } else {
      setIsFetchUser(false)
      setIsShowUsersFromSearch(false)
    }
  };

  function sendMessage(value: string | File) {
    if (SocketApi.socket?.connected) {
      const messageData = {
        message: value,
        receiverId,
      };

      //отправка сообщения
      SocketApi.socket?.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, messageData, (message: IMessageType, acknowledge: any) => {
        acknowledge({ messageId: message.id, status: 'RECEIVED' })
        console.log(acknowledge)
      });
      setIsFetchUser((prev) => !prev);
    } else {
      console.error('WebSocket is not connected');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getUsers({ accessToken }).then(res => {
        res.isSuccess && setIsFetchUser(true)
      });
      if (currentUser?.userId) {
        await getDialogsByUser({ accessToken, userId: currentUser.userId }).then(res => {
          res.isSuccess && setIsLoadingDialog(false)
        });
      }
    };

    fetchData();
  }, [isFetchUser, currentUser, accessToken])


  useEffect(() => {
    if (accessToken) {
      SocketApi.creatConnection(accessToken);
      setIsLoadingDialog(true)

      // SocketApi.socket?.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (message: IMessageType) => {
      //   if (message.status === "RECEIVED") {
      //     console.log("Your message was received by the recipient:", message);
      //   }
      // });

      // Получения сообщения и подтверждение
      SocketApi.socket?.on(WS_EVENT_PATH.MESSAGE_SENT, (message, acknowledge) => {
        console.log("Message received:", message)

        acknowledge({ messageId: message.id, status: 'RECEIVED' })
        getUsers({ accessToken })
      });

      SocketApi.socket?.on('error', (error) => {
        console.error('Error occurred:', error);
      });

      return () => {
        SocketApi.socket?.off('receive-message');
        SocketApi.socket?.off('error');
      };
    }
  }, [accessToken]);

  const setTitle = () => {
    if (currentUser) {
      return <Typography variant={'h1'}>{t.Loading}</Typography>
    } else {
      return <Typography>{t.Choose}</Typography>
    }
  }

  return (
      <div className='flex flex-col h-full'>
        <Typography variant="h1">{t.Messenger}</Typography>
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.searchBox}>
              <DebouncedInput language={language} setClearSearch={setClearSearch} clearSearch={clearSearch} callback={onDebounce}/>
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
                    language={language}
                    setIsFetchUser={setIsFetchUser}
                    setCurrentUser={setCurrentUser}
                    setReceiverId={setReceiverId}
                    setIsLoadingDialog={setIsLoadingDialog}
                    users={dialogUsers.items}
                  />
              }
            </div>
            <div className={s.containerDialogs}>
              <div className={currentUser && !isLoadingDialog ? s.afterChange : s.change}>
                {isLoadingDialog ?
                   setTitle() :
                  <Dialogs language={language} currentUser={currentUser} dialogUser={dialogUser}/>
                }
              </div>
              {currentUser &&
                <Footer
                  receiverId={currentUser.userId}
                  language={language}
                  clearSearch={clearSearch}
                  sendMessage={sendMessage}
                  // setMessageValue={setNewMessage}
                />
              }
            </div>
          </div>
        </div>
      </div>
  );
};

export default Messenger;
