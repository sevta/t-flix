import React , { Component } from 'react'
import { Link } from 'react-router-dom'
import { imgUrl } from '../../utils/api'
import { TiArrowForward , TiHeartFullOutline } from 'react-icons/ti'
import { FiHeart , FiShoppingCart } from 'react-icons/fi'
import { UserContext, MovieContext } from '../../utils/provider';
import { IoMdCart } from 'react-icons/io'
import slugify from 'slugify'
import { calculatePrice } from '../../utils/helper'
import currencyFormater from 'currency-formatter'
// w-8 z-50 h-8 -mt-3 mr-8 rounded-full bg-teal absolute pin-t pin-r flex items-center justify-center text-white text-sm
const SingleMovieContext = React.createContext('singlemovie')
export default function Movie({details , onAddCart , onDeleteFromCart , onClick , tempCart}) {

  function isInCart(data) {
    // setInCart(data)
  }
   return (
    <SingleMovieContext.Provider
      value={{ 
        setAddToCart: payload => onAddCart(payload) ,
        onDeleteFromCart: payload => onDeleteFromCart(payload) ,
        onClick: payload => onClick(payload)
      }}
    >
      <div className='movie-details container relative w-48 mx-5 mb-5 flex flex-wrap relative flex-col bg-white'>
        {isInCart && (
          <div className='w-6 z-50 h-6 -mt-2 mr-5 rounded-full bg-purple absolute pin-t pin-r flex items-center justify-center text-white' style={{fontSize: 12}}>
            <FiShoppingCart />
          </div>
        )}
        <div className='movie-top w-full h-64 d relative cursor-pointer overflow-hidden rounded'> 
          <img className='movie-poster absolute w-full h-full pin-t pin-l' src={`${imgUrl}original${details.poster_path}`} alt=""/>
          <div className="overlay absolute pin-y p-3 pin-x flex flex-col justify-end">
            <div className="menu-bottom flex justify-between">
              <div className='menu-left z-30 font-bold text-white'>
                <Price rating={details.vote_average} />
              </div>
              <div className="menu-right flex items-center">  
                <MovieCart item={details} tempCart={tempCart} isInCart={isInCart} />
                <WishList item={details} />
                <Link to={`details/${details.id}-${slugify(details.title , '-')}`} className='no-underline text-white font-bold text-xl ml-2'>
                  <TiArrowForward />
                </Link>
              </div>
            </div>
          </div>        
        </div>   
        <div className='w-6 h-6 -mt-2 rating bg-teal font-bold text-white z-20'>{details.vote_average}</div>
        <div className="bottom">
          <h5 className='mt-3 text-teal-dark'>{details.title}</h5>
        </div>

        <style jsx sass>{`
          .overlay {
            transition: all .3s ease;
            opacity: 0;
            background: rgba($color: #4dc0b5 , $alpha: .9);
            z-index: -1;
          }
          .date-font {
            font-size: 13px;
          }
          .movie-details {
            transition: all .4s ease;
            &:hover {
              transform: translateY(-10px);
              .overlay {
                opacity: 1;
                z-index: 3;
              }
            }
          }
          .rating {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            font-size: 12px;
            right: -10px;
            border-radius: 50%;
          }
        `}</style>
      </div>
    </SingleMovieContext.Provider>
  )
}

// props item
class WishList extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    toggleWishList: false 
  }

  selectWishList = () => {
    this.setState({ toggleWishList: !this.state.toggleWishList })
  }

  render() {
    return (
      <div className="wishlist text-white" onClick={this.selectWishList}>
        { this.state.toggleWishList ? <TiHeartFullOutline /> : <FiHeart /> }
      </div>  
    )
  }
}

// props rating
class Price extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='price-container'>
        <div className="price text-sm font-bold">{calculatePrice(this.props.rating)}</div>
      </div>
    )
  }
}

// props item onAddCart
class MovieCart extends Component {
  constructor(props) {
    super(props)
  }

  static contextType = MovieContext
  
  state = {
    toggleCart: false ,
  }

  addToCart = () => {
    const { action , balance } = this.context
    this.setState({ toggleCart: !this.state.toggleCart } , () => {
      if (this.state.toggleCart) {
        this.props.isInCart(this.state.toggleCart)
        let itemPrice = currencyFormater.unformat(calculatePrice(this.props.item.vote_average) , { code: 'IDR' })
        let price = balance - itemPrice
        if (price <= 0) {
          action.setFlashMessage(true)
          this.setState({ toggleCart: false } , () => this.props.isInCart(this.state.toggleCart))
          return 
        } else {
          this.props.isInCart(this.state.toggleCart)
          action.addToCart(this.props.item , state => {
            action.setBalance(price , state => {
            })
          })
        }
      } else {
        action.deleteFromCart(this.props.item , state => {
          let itemPrice = currencyFormater.unformat(calculatePrice(this.props.item.vote_average) , { code: 'IDR' })
          let price = balance + itemPrice
          action.setBalance(price , state => { })
        })
      }
    })
  }


  // use this because setSate in componentdidupdate it will be infinite loop 
  // prev props temp cart = cart
  componentWillReceiveProps(prevProps) {
    let isCurrentlyAdded = prevProps.tempCart.some(cart => cart.id == prevProps.item.id) 
    if (isCurrentlyAdded) {
      this.setState({ toggleCart: true })
      this.props.isInCart(true)
    } else {
      this.setState({ toggleCart: false })
      this.props.isInCart(false)
    }
  }
 

  render() {
    return (
      <div className='cart-container mr-3 text-white' onClick={() => this.addToCart()}>
        {this.state.toggleCart ? <IoMdCart /> : <FiShoppingCart />}
      </div>
    )
  }
}