import { Input } from '@/common/input/input'
import s from './Footer.module.scss'
import { Button } from '@/common/button';
import { Typography } from '@/common/typography/typography';
import {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from "@/lib/hooks/useTranslation";
import MicOutline from '@/assets/icons/micOutline'
import ImageOutline from "@/assets/icons/imageOutline";
import {useGeneralInputRef} from "@/lib/hooks/useGeneralInputRef";
import {SocketApi} from "@/app/api/socket/socket-api";
import {PreviewFile} from "@/types/messenger";
import PlusCircle from "@/assets/icons/PlusCircle";
import CloseOutline from "@/assets/icons/CloseOutline";

type Props = {
  sendMessage: (value: string | File) => void
  clearSearch: '' | null
  language: 'en' | 'ru'
  receiverId: number
}

export const Footer = ({ sendMessage, language, receiverId, ...rest }: Props) => {
  const {t} = useTranslation(language)
  const accessToken = localStorage.getItem('token-remote')

  const [valueInput, setValueInput] = useState<string>('');
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const { selectPhotoHandler, inputRef } = useGeneralInputRef()

  useEffect(() => {
    SocketApi.creatConnection(accessToken)
  }, []);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    console.log(selectedFiles)

    if (selectedFiles) {
        const reader = new FileReader();

        const previewFile: PreviewFile = {
          id: 0,
          file: selectedFiles[0],
          previewUrl: '',
        };

        reader.onloadend = () => {
          previewFile.previewUrl = reader.result as string;
          previewFile.id = files.length ? files.at(-1).id + 1 : 1
          setFiles((prevFiles) => [...prevFiles, previewFile]);
        };

        reader.readAsDataURL(selectedFiles[0]);
    }
  }

  const onClickHandler = () => {
    if (files.length) {
      files.forEach((previewFile) => {
        sendMessage(previewFile.previewUrl)
      });
    }
    if (valueInput) {
      sendMessage(valueInput)
    }
    setValueInput('')
  }

  const onRemove = (id: number) => {
    setFiles(files.filter(file => file.id !== id))

  }

  return (
    <div className={s.footerContainer}>
      <div className={s.previewPhotoBox}>
        {files.map((previewFile, index) => (
          <div className="relative" key={index}>
            <img src={previewFile.previewUrl} alt={`Preview ${index}`} />
            <CloseOutline onClick={() => onRemove(previewFile.id)} className={s.closePhoto} />
          </div>
        ))}
        {files.length > 0 && <PlusCircle className="cursor-pointer" onClick={selectPhotoHandler}/>}
      </div>
      <div className={s.inputBox}>
        <Input
          {...rest}
          placeholder={t.Type}
          className={s.messageInput}
          onChangeValue={setValueInput}
          value={valueInput}
        />
        <div className={s.iconBox}>
          <Button
            style={{backgroundColor: 'black'}}
            variant='link'
            onClick={onClickHandler}
            className={`${s.icon} ${valueInput || files.length ? s.visible : s.hidden}`}
          >
            <Typography variant='h3'>{t.Send}</Typography>
          </Button>
          <div className={`${s.icon} ${!valueInput && !files.length ? s.visible : s.hidden}`}>
            <MicOutline className="cursor-pointer" />
            <ImageOutline onClick={selectPhotoHandler} className="cursor-pointer" />
            <input
              accept={'image/jpeg, image/png'}
              onChange={onFileChange}
              ref={inputRef}
              type={'file'}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}