import { Input } from '@/common/input/input'
import s from './Footer.module.scss'
import { Button } from '@/common/button';
import { Typography } from '@/common/typography/typography';
import {ChangeEvent, useEffect, useState} from 'react';
import {useTranslation} from "@/lib/hooks/useTranslation";
import MicOutline from '@/assets/icons/micOutline'
import ImageOutline from "@/assets/icons/imageOutline";
import {useGeneralInputRef} from "@/lib/hooks/useGeneralInputRef";

type Props = {
  setMessageValue: ( value: string ) => void
  sendMessage: () => void
  clearSearch: '' | null
  language: 'en' | 'ru'
}
export const Footer = ({ setMessageValue, sendMessage, language, ...rest }: Props) => {
  const {t} = useTranslation(language)
  const [valueInput, setValueInput] = useState<string>('');
  const { selectPhotoHandler, inputRef } = useGeneralInputRef()

  useEffect(() => {
    if(valueInput) {
      setMessageValue(valueInput)
    }
  }, [valueInput, setMessageValue, rest.clearSearch])

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e)
  }

  const onClickHandler = () => {
    setValueInput('')
    sendMessage()
  }
  const onChangHandler = (e: string) => {
    setValueInput(e)
  }
  const onButtonChangePhoto = () => {
    selectPhotoHandler()
  }

  return (
    <div className={s.footerContainer}>
      <Input
        {...rest}
        placeholder={t.Type}
        className={s.messageInput} 
        onChangeValue={onChangHandler}
        value={valueInput}
      />
      <div className={s.iconBox}>
          <Button
            style={{backgroundColor: 'black'}}
            variant='link'
            onClick={onClickHandler}
            className={`${s.icon} ${valueInput ? s.visible : s.hidden}`}
          >
          <Typography variant='h3'>{t.Send}</Typography>
        </Button>
        <div className={`${s.icon} ${!valueInput ? s.visible : s.hidden}`}>
          <MicOutline className="cursor-pointer" />
          <ImageOutline onClick={onButtonChangePhoto} className="cursor-pointer" />
          <input
            accept={'image/jpeg, image/png'}
            onChange={onFileChange}
            ref={inputRef} type={'file'}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}