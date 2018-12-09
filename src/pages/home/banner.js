import React from 'react'
export default function Banner() {
  return (
    <div className='banner-home w-full flex items-center justify-center bg-grey-lighter mb-10'>
      <h1>banner</h1>
      <style jsx sass>{`
        .banner-home {
          height: 450px;
        }
      `}</style>
    </div>
  )
}