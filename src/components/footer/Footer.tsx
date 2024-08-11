import { Input } from '../../common/input/input'
import s from './Footer.module.scss'
import { Button } from '../../common/button';
import { Typography } from '../../common/typography/typography';

type Props = {
  setMessageValue: ( value: string ) => void
  sendMessage: () => void
}
export const Footer = ({ setMessageValue, sendMessage }: Props) => {

  return (
    <div className={s.footerContainer}>
      <Input placeholder='Type Message' className={s.messageInput} onChangeValue={setMessageValue} />
      <Button variant='link' onClick={sendMessage} >
        <Typography variant='h3'>Send Message</Typography>
      </Button>
    </div>
  )
}