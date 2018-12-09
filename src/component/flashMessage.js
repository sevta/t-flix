import React from 'react'
export default function FlashMessage({text , onClick}) {
  return (
    <div className='flashmessage-container fixed pin-y pin-x flex items-center justify-center' onClick={onClick}>
      <div className="inner-flashmessage">
        <h1 className='text-white'>{text}</h1>      
      </div>
      <style jsx sass>{`
        .flashmessage-container {
          background-color: rgba($color: black , $alpha: .88);
          z-index: 1001;
        }
      `}</style>
    </div>
  )
}