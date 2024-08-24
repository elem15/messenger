import { Input } from '../../common/input/input'
import s from './Footer.module.scss'
import { Button } from '../../common/button';
import { Typography } from '../../common/typography/typography';
import { useEffect, useState } from 'react';

type Props = {
  setMessageValue: ( value: string ) => void
  sendMessage: () => void
  clearSearch: '' | null
}
export const Footer = ({ setMessageValue, sendMessage, ...rest }: Props) => {
  const [valueInput, setValueInput] = useState<string>('');

  useEffect(() => {
    if(valueInput) {
      setMessageValue(valueInput)
    }
  }, [valueInput, setMessageValue, rest.clearSearch])

  const onClickHandler = () => {
    setValueInput('')
    sendMessage()
  }
  const onChangHandler = (e: string) => {
    setValueInput(e)
  }
  return (
    <div className={s.footerContainer}>
      <Input
        {...rest}
        placeholder='Type Message' 
        className={s.messageInput} 
        onChangeValue={onChangHandler}
        value={valueInput}
      />
      <Button style={{backgroundColor: 'black'}} variant='link' onClick={onClickHandler} >
        <Typography variant='h3'>Send Message</Typography>
      </Button>
    </div>
  )
}