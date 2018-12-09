import React from 'react'
import { UserContext } from '../utils/provider'

export default function Popup() {
  const {userState , action , isNewUser} = React.useContext(UserContext)
  const [value , setValue] = React.useState('')
  const [submited , setSubmited] = React.useState(false)
  const [show , setShow] = React.useState(false)

  /**
   * TODO:
   * basic validate input username
   * 
   */
  function onChange(e) {
    let val = e.target.value
    setValue(val)
  }

  React.useEffect(() => {
    if (isNewUser) {
      setShow(true)
    } 
  })

  React.useEffect(() => {
    if (submited) {
      action.setIsNewUser(false)
      localStorage.setItem('user' , JSON.stringify(userState))
      setShow(false)
    }
  } , [userState])

  function onSubmit(e) {
    e.preventDefault()
    action.setUser({...userState , username: value})
    setSubmited(true)
  }

  return show && (
    <div className='popup bg-black fixed pin-y pin-x flex items-center justify-center z-50'>
      <div className="popup-inner bg-white py-2 px-5">
        <form className="form" onSubmit={onSubmit}>
          <div className="">
            <input type="text" placeholder='username' onChange={onChange} 
              className='w-full border py-2 px-2'/>
          </div>
        </form>
      </div>
    </div>
  )
}