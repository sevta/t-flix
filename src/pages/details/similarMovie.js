import React, { Component } from 'react'
import { imgUrl } from '../../utils/api'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default class SimilarMovie extends Component {
  onClick = item => this.props.onClick(item)

  render() {
    const { movie } = this.props
    return (
      <React.Fragment>
        <h1 className='text-center mb-10'>Similar Movie</h1>        
        <div className='container mx-auto flex items-center justify-center flex-wrap mb-20 cursor-pointer'>
          { movie.map((item , index) => (
            <div className="w-32 h-32 mx-4 rounded my-2 flex-col " key={index} onClick={() => this.onClick(item)}>
              <div className="img w-full h-32 overflow-hidden rounded relative">
                <LazyLoadImage 
                  effect='blur' 
                  src={`${imgUrl}original${item.poster_path}`}
                  wrapperClassName='img'
                />
              </div>
              <div className="title text-sm font-bold leading-tick mt-3">
                { item.title }
              </div>
            </div>
          )) } 
          <style jsx sass>{`
            .img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          `}</style>
        </div>
      </React.Fragment>
    )
  }
}