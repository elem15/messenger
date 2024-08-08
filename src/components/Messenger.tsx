import { Typography } from "../common/typography/typography"
import DebouncedInput from "../utils/DebouncedInput"
import { useState } from "react"
import s from './Messenger.module.scss'
import { useGetMessengerQuery } from "../api/messengerApi"

const Messenger = () => {
  const [valueSearch, setValueSearch] = useState('')
  const {data} = useGetMessengerQuery({})
  const onDebounce = (value: string) => {
    setValueSearch(value)
  }

  console.log(data)

  const users = [
    { 
      id:1,
      photo: '',
      name: 'Ivan'
    },
    { 
      id:2,
      photo: '',
      name: 'Igor'
    },
    { 
      id:3,
      photo: '',
      name: 'Vany'
    },
    { 
      id:4,
      photo: '',
      name: 'Ira'
    }
  ]

  return <div>
    <Typography variant="h1">Messenger</Typography>
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.searchBox}>
          <DebouncedInput callback={onDebounce} />  
        </div>
      </div>
      <div>
        {
          users.map(user => (
            <div key={user.id}></div>
          ))
        }
      </div>
    </div>
  </div>
}

export default Messenger