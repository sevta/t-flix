import React , { Component } from 'react'
import { apikey , apiUrl } from './api'

export const UserContext = React.createContext('UserContext')
export const MovieContext = React.createContext('MovieContext')
export const AppContext = React.createContext('AppContext')

export function Provider(props) {
  return (
    <AppContext.Provider>
      <UserProvider>
        <MovieProvider>
          {props.children}
        </MovieProvider>
      </UserProvider>
    </AppContext.Provider>
  )
}


class MovieProvider extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    movies: [] ,
    moviesTrending: [] ,
    balance: 100000 ,
    currentPage: 1 ,
    currentUrl: '' ,
    toggleWishList: false ,
    cart: [] ,
    toggleCart: false ,
    flashMessage: false ,
    movieStateUrl: {
      name: 'Popular' , path: 'movie/popular'  ,
    }
  }

  fetchUrl = (query , page) => {
    let url = `${apiUrl}${query}?api_key=${apikey}&region=ID&page=${page}}`
    console.log(url)
    return url
  }
  
  fetchMovies = (url , callback) => {
    let err = false
    fetch(url)
      .then(res => res.json())
      .then(data => {
        err = false
        callback(err , data)
      })
      .catch(err => {
        err = true 
        callback(err , null)
      })
  }
  
  componentDidMount() {
    let userStorage = localStorage.getItem('user')

    if (userStorage !== null) { 
      let currentCart = JSON.parse(localStorage.getItem('cart'))
      let currentBalance = JSON.parse(localStorage.getItem('balance'))
      // addToCart(currentCart)
      this.setState({ cart: currentCart , balance: currentBalance })
      setTimeout(() => {
        console.log('if user storage not null ' , JSON.parse(localStorage.getItem('cart')))
      }, 300);
    } else {
      localStorage.setItem('cart' , JSON.stringify([]))
      localStorage.setItem('balance' , this.state.balance)
    }

    // fetch now playing
    this.fetchMovies(this.fetchUrl('movie/now_playing' , 1) , (err , data) => {
      if (err) throw err
      // setMovies(data) 
      this.setState({ movies: data })
    })

  }


  render() {
    const MoviesProvider = {
      movies: this.state.movies , 
      moviesTrending: this.state.moviesTrending ,
      currentPage: this.state.currentPage ,
      currentUrl: this.state.currentUrl ,
      cart: this.state.cart ,
      toggleCart: this.state.toggleCart ,
      movieStateUrl: this.state.movieStateUrl ,
      balance: this.state.balance ,
      flashMessage: this.state.flashMessage ,
      action: {
        setMoviesTrending: (payload , callback) => {
          this.setState({ moviesTrending: payload } , () => callback(this.state.moviesTrending))
        } ,
        setCurrentPage: (payload , callback) => {
          this.setState({ currentPage: payload } , () => {
            if (callback) {
              callback(this.state.currentPage)
            }
          })
        } ,
        setMovieStateUrl: (payload , callback) => {
          this.setState({ movieStateUrl: payload } , () => {
            if (callback) {
              callback(this.state.movieStateUrl)
            }
          })
        } ,
        setCurrentUrl: payload => this.setState({ currentUrl: payload }) ,
        addToCart: (payload , callback) => {
          this.state.cart.push(payload)
          this.setState({ cart: this.state.cart } , () => {
            localStorage.setItem('cart' , JSON.stringify(this.state.cart))
            if (callback) {
              callback(this.state.cart)
            }
          })
        } ,
        deleteFromCart: (payload , callback) => {
          let index = this.state.cart.indexOf(payload)
          this.state.cart.splice(index , 1)
          this.setState({ cart: this.state.cart } , () => {
            localStorage.setItem('cart' , JSON.stringify(this.state.cart))
            if (callback) {
              callback(this.state.cart)
            }
          })
        } ,
        setBalance: (payload , callback) => {
          this.setState({ balance: payload } , () => {
            localStorage.setItem('balance' , payload)
            if (callback) {
              callback(this.state.balance)
            }
          })
        } ,
        setFlashMessage: (payload , callback) => {
          this.setState({ flashMessage: payload } , () => {
            if (callback) {
              callback(this.state.flashMessage)
            }
          })
        } , 
        setToggleCart: payload => this.setState({ toggleCart: payload })
      } ,
    }
  
    return (
      <MovieContext.Provider value={MoviesProvider}>
        {this.props.children}
      </MovieContext.Provider>
    )
  }

}

class UserProvider extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    isNewUser: false ,
    userState: {
      username: '',
      wishlist: []
    } 
  }

  componentDidMount() {
    let userStorage = localStorage.getItem('user')

    if (userStorage == null) {
      // setIsNewUser(true)
      this.setState({ isNewUser: true })
    } else {
      console.log('current user' , userStorage)
      // setUser(JSON.parse(userStorage))
      this.setState({ userState: JSON.parse(userStorage) })
    }
  }

  render() {
    const usersProvider = {
      isNewUser: this.state.isNewUser ,
      userState: this.state.userState , 
      action: {
        setUser: payload => this.setState({ userState: payload }) ,
        setIsNewUser: payload => this.setState({ isNewUser: payload })
      } ,
    }
    return (
      <UserContext.Provider value={usersProvider}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}