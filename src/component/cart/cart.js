import React , { Component } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import { Link } from 'react-router-dom'
import slugify from 'slugify'
import { MovieContext } from '../../utils/provider'
import {  imgUrl  } from '../../utils/api'
import { calculatePrice } from '../../utils/helper'
import history from '../../utils/history'
import currencyFormater from 'currency-formatter'

export default class Cart extends Component {
  static contextType = MovieContext

  state = {
    totalPrice: 0
  }

  onClickDelete = item => {
    const { action , balance } = this.context
    action.deleteFromCart(item, state => {
      let itemPrice = currencyFormater.unformat(calculatePrice(item.vote_average) , { code: 'IDR' })
      let price = balance + itemPrice
      action.setBalance(price)
    })
  }

  onClose = item => {
    const { action } = this.context
    action.setToggleCart(false)
  }

  render() {
    const { toggleCart , action , cart , balance } = this.context
    return (
      <div className='cart-overlay fixed pin-y pin-x bg-black z-50 flex items-center justify-center' onClick={() => action.setToggleCart(false)}>
        <div className="cart-inner bg-white p-5 relative rounded" onClick={e => e.stopPropagation()}>
          <div className="close absolute pin-r pin-t text-3xl mt-3 mr-3 cursor-pointer" onClick={() => action.setToggleCart(false)}>
            <IoIosCloseCircleOutline />
          </div>
          <div className="cart-item-container">
            { cart.length ? cart.map((item , i) => (
              <CartItem 
                key={i} 
                item={item} 
                onClose={item => this.onClose(item) } 
                onClickDelete={() => this.onClickDelete(item)}/>
            )) : (
              <h1>nothing</h1>
            ) }
          </div>
          { cart.length ? (
            <div className="total font-bold">
            <span className='mr-2'>total</span>
            <span>{currencyFormater.format(balance , { code: 'IDR' })}</span>
          </div>
          ) : null }
        </div>  
        <style jsx sass>{`
          .cart-overlay {
            background: rgba($color: black , $alpha: .8);
            z-index: 1000;
            .cart-inner {
              width: 680px;
            }
          }
        `}</style>
      </div>
    )
  }
}

function CartItem({item , onClose  , onClickDelete}) {
  return (
    <div className='flex mb-5 items-center'>
      <div className="img rounded-lg overflow-hidden">
        <img src={`${imgUrl}original${item.poster_path}`} alt=""/>
      </div>
      <div className="details flex flex-col ml-3">
        <div className="font-bold">{item.title}</div>
        <div className="text-sm mt-1 font-sans">{calculatePrice(item.vote_average)}</div>
        <div className="btn-container flex mt-1 items-center">
          <div className="text-sm font-sans font-bold cursor-pointer text-teal" onClick={() => onClose(`/details/${item.id}-${slugify(item.title , '-')}`)}>
            <Link 
            to={`/details/${item.id}-${slugify(item.title , '-')}`} 
            className='font-sans font-bold cursor-pointer text-teal no-underline'>View</Link>           
          </div>
          <div className="delete text-sm text-red font-bold font-sans ml-2 cursor-pointer" onClick={() => onClickDelete()}>
            delete
          </div>
        </div>
      </div>
      <style jsx sass>{`
        .img {
          width: 72px;
          height: 72px;
        }
      `}</style>
    </div>
  )
}