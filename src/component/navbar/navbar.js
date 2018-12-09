import React from 'react'
import { MovieContext , UserContext } from '../../utils/provider'
import { FiShoppingCart } from 'react-icons/fi'
import currencyFormatter from 'currency-formatter'

export default function Navbar() {
  const { currentUrl , cart , action , balance } = React.useContext(MovieContext)
  const { userState } = React.useContext(UserContext)
  const [classes , setClasses] = React.useState('')

  function openCartMenu() {
    action.setToggleCart(prev => !prev)
  }

  React.useEffect(() => {
    if (currentUrl == '/details/:movieId-:slug') {
      setClasses('in-page-details')
    } else {
      setClasses('')
    }
  } , [currentUrl])

  return (
    <div className={`w-full px-2 py-10 bg-white ${classes}`}>
      <div className="container px-5 flex mx-auto items-center justify-between">
        <div className="left">
          <div className="menu">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        <div className="logo capitalize text-5xl text-green">Tokoflix</div>

        <div className="right flex items-center justify-center">
          <div className="name text-xl mr-3 capitalize font-sans">{userState.username}</div>
          <div className="cart-icon flex items-center justify-center cursor-pointer relative" onClick={openCartMenu}>
            <FiShoppingCart />
            <span className='ml-3 cart-total flex items-center justify-center font-bold rounded-full bg-red text-white'>{cart ? cart.length : 0}</span>
          </div>
          <div className="balance text-sm ml-3 font-bold">
            {currencyFormatter.format(balance , { code: 'IDR' })} 
          </div>
        </div>
      </div>
      <style jsx sass>{`
        .in-page-details {
          z-index: 70;
          background: whitesmoke;
          position: absolute;
          top: calc(100vh - 102px);
        }
        .cart-total {
          width: 16px;
          height: 16px;
          position: absolute;
          top: -19px;
          left: -18px;
          font-size: 11px;
        }
        .cart-icon {
          margin-top: 2px;
          .cart-total {
            margin-top: 2px;
          }
        }
        .logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .menu {
          width: 26px;
          height: 15px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .line {
            width: 100%;
            height: 3px;
            background: black;
            border-radius: 2px;
            &:nth-child(2) {
              width: 80%;
            }
            &:nth-child(3) {
              width: 60%;
            }
          }
        }
        @media (max-width: 1366px) {
          .in-page-details {
          }   
        }
      `}</style>
    </div>
  )
}
