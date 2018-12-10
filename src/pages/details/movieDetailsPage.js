import React , { Component } from 'react'
import { apikey , fetchUrl , imgUrl } from '../../utils/api'
import BackDrop from './backdrop'
import { AppContext , MovieContext } from '../../utils/provider'
import { FiShoppingCart } from 'react-icons/fi'
import SimilarMovie from './similarMovie'
import slugify from 'slugify'
import { calculatePrice } from '../../utils/helper'
import currencyFormater from 'currency-formatter'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './movieDetailsPage.css'

// props match
export default class MovieDetailPage extends Component {
  constructor(props) {
    super(props)
  }

  static contextType = MovieContext

  state = {
    movieID: '' ,
    movieDetails: [] ,
    loading: true ,
    isInCart: false ,
    similarMovie: [] ,
    cart: [] ,
    filteredSimilarMovie: [] ,
  }

  fetchSimilarMovie = movieID => {
    let mID = movieID 
    let url = fetchUrl(apikey , `movie/${mID}/similar`)

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({ similarMovie: data.results })
        if (data.results.length > 6) {
          let filtered = data.results.splice(0 , 6)   
          this.setState({ filteredSimilarMovie: filtered })
        } else {
          this.setState({ filteredSimilarMovie: data.results })
        }
      })
      .catch(err => console.log(err))
  }

  fetchMovie = (movieId , path) => {
    const { action , cart } = this.context
    this.setState({ loading: true })
    let mID = movieId
    this.setState({ movieID: mID })
    let url = fetchUrl(apikey , `movie/${mID}`)
    action.setCurrentUrl(path)
    fetch(url)
      .then(res => res.json())
      .then(data => {
        
        this.setState({ movieDetails: data } , () => {
          this.fetchSimilarMovie(mID)
          this.setState({ loading: false })
          let cartInStorage = JSON.parse(localStorage.getItem('cart'))
          let isInCart = cartInStorage.some(cart => cart.id == this.state.movieDetails.id)
          console.log('is in cart' , isInCart)            

          setTimeout(() => {
            console.log('and cart is' , cart)
          }, 1500);
          if (isInCart) {
            this.setState({ isInCart: true })
          } else {
            this.setState({ isInCart: false })
          }
        })
      })
      .catch(err => console.error(err))
  }

  isUpdate = false

  componentDidMount() {    
    const { cart , action } = this.context
    console.log('carts' , action)
    let movieId = this.props.match.params.movieId
    let path = this.props.match.path
    this.setState({ cart: this.context.cart } , () => console.log('cart' , this.state.cart))
    console.log('mount' , cart)
    this.fetchMovie(movieId , path)
  }

  componentWillReceiveProps(nextProps) {
    let movieId = nextProps.match.params.movieId
    let path = nextProps.match.path
    if (nextProps.match.params.movieId == this.state.movieID) {
      return 
    } else {
      this.fetchMovie(movieId , path)
    }
  }

  redirectToReferer = item => { 
    let title = slugify(item.title , '-')
    let redirectTo = `${item.id}-${title}`
    this.props.history.push(redirectTo)
  }

  addToCart = item => {
    const { balance , action } = this.context

    console.log('add to cart' , item)
    if (!this.state.inCart) {
      let itemPrice = currencyFormater.unformat(calculatePrice(item.vote_average) , { code: 'IDR' })
      let price = balance - itemPrice
      if (price <= 0) {
        action.setFlashMessage(true)
        this.setState({ isInCart: false })
        return 
      } else {
        action.addToCart(item , state => {
          action.setBalance(price)
          this.setState({ isInCart: true })
        })
      }
    }

  }

  render() {
    const {
      loading ,
      movieDetails ,
      isInCart ,
      filteredSimilarMovie
    } = this.state 

    return (
      <div>
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <React.Fragment>
            { movieDetails.backdrop_path ? 
              <BackDrop img={movieDetails.backdrop_path} /> : 
              <BackDrop img={movieDetails.poster_path} /> }
            <div className="movie-details-content flex items-center justify-center flex-col">
              <div className="container mx-auto flex my-10">
                <MovieDetailsCard details={movieDetails} inCart={isInCart} addToCart={item => this.addToCart(item)} />
              </div>
              <div className="container mx-auto flex items-center justify-center mt-10">
  
              </div>
            </div>
            <SimilarMovie movie={filteredSimilarMovie} onClick={item => this.redirectToReferer(item)} />
          </React.Fragment>
        )}
        <style jsx global sass>{`
          body {
            background: whitesmoke;
          }
          .movie-details-content {
            padding-top: 100px;
          }
        `}</style>
      </div>
    )
  }
}

// props details
class MovieDetailsCard extends Component {
  render() {
    const { details , inCart } = this.props
    return (
      <div className="col container px-5 flex mx-auto mt-14 rounded-lg">
        <div className="col-left bg-white relative">
          { inCart && <IconInCart /> }
          <div className="poster-container w-48 border overflow-hidden relative">
            <LazyLoadImage 
              effect='blur' 
              src={`${imgUrl}original${details.poster_path}`} 
              style={{
                width: '100%' ,
                height: '100%' ,
                objectFit: 'cover' ,
                objectPosition: 'center'
              }}
            />
          </div>
        </div>
        <div className="col-right ml-5 px-5 py-6 flex flex-wrap flex-col pt-0 pb-0">
          <div className="h-title text-2xl mb-4 font-sans font-bold">{details.title}</div>
          <MovieDetailsContent title='Tag' content={details.tagline} />
          <MovieDetailsContent title='Release' content={details.release_date} />
          <MovieDetailsContent title='Overview' content={details.overview} />
          { details.homepage && (
            <MovieDetailsContent title='Homepage' content={details.homepage} isAnchor />
          ) }
          <div className="minutes font-bold mb-4 mt-2">
            {details.runtime} minutes
          </div>
          <ProductCompanies companies={details.production_companies} />
          {/** <button className='rounded-full text-teal text-left font-bold btn-addCart' onClick={() => addToCart(details)}>add to cart</button> */}
          <div className="genres flex mt-5">
            {details.length !== 0 ? details.genres.map((genre , index) => (
              <div key={index} className='mr-2 py-1 px-3 font-sans text-sm bg-red-light rounded-full text-white'>
                <div>{genre.name}</div>
              </div>
            )) : (<h1>loading...</h1>)}
          </div>
          <h4 className='my-6'>{calculatePrice(this.props.details.vote_average)}</h4>
          <button className='btn-add bg-purple py-2 px-5 rounded self-start text-white' disabled={inCart} onClick={() => this.props.addToCart(details)}>add cart</button>
        </div>
        <style jsx sass>{`
          .poster-container {
            width: 320px;
            height: 100%;
          }
          .btn-add {
            &:disabled {
              background: grey;
            }
          }
          .poster {

          }
        `}</style>
      </div>  
    )
  }
}

function IconInCart() {
  return (
    <div 
      className="indicator absolute pin-t pin-l z-50 shadow -ml-3 -mt-3 w-12 h-12 rounded-full bg-purple flex items-center justify-center font-bold text-white text-xl">
      <FiShoppingCart />
    </div>
  )
}

function ProductCompanies({companies}) {
  return (
    <div className="logo-container flex flex-col">
      {companies.map((item , index) => (
        <div key={index} className='flex items-center mr-4 mt-3'>
          {item.logo_path ? (
            <div className="w-10 h-10 rounded overflow-hidden">
              <img className='logo' src={`${imgUrl}original${item.logo_path}`} alt=""/>
            </div>
          ) : null}
          <div className={`text-sm font-sans font-bold ${item.logo_path ? 'ml-3' : ''}`}>{item.name}</div>
          <style jsx sass>{`
            .logo {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-positin: center;
            }
          `}</style>
        </div>
      ))}
    </div>
  )
}

function MovieDetailsContent({title , content , isAnchor}) {
  return (
    <div className="mb-5">
      <div className='text-sm mb-1 font-bold'>{title}</div>
      {isAnchor ? (
        <h5 className="font-normal leading-normal"><a href={content}>{content == "" ? "-" : content}</a></h5>
      ) : (
        <h5 className="font-normal leading-normal">{content == "" ? "-" : content}</h5>
      )}
    </div>
  )
}

