import React from 'react'
import { imgUrl } from '../../utils/api'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function BackDrop({img , ...rest}) {
  return ( 
    <div className='w-full bg-grey-lightest overflow-hidden relative backdrop-container'>
      <LazyLoadImage 
        effect='blur' 
        src={`${imgUrl}original${img}`}
        wrapperClassName='img w-full absolute pin-y pin-x'
        style={{
          width: '100%' ,
          height: '100%' ,
          objectFit: 'cover' ,
          objectPosition: 'center'
        }}
      />
      {/**<img src={`${imgUrl}original${img}`} alt="" className='img w-full absolute pin-y pin-x'/> */}
      <div className="overlay-backdrop absolute pin-y pin-x z-30"></div>
      <style jsx sass>{`
        .backdrop-container {
          height: calc(100vh - 102px);
          .overlay-backdrop {
            background: rgba($color: black , $alpha: 0);
          }
        }
        @media (max-width: 1366px) {
        }
        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
        }

      `}</style>
    </div>
  )
}