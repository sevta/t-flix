import React , { Component } from 'react'
import { AppContext , MovieContext } from '../../utils/provider'
import { apikey , apiUrl , fetchUrl } from '../../utils/api'
import queryString from 'query-string' 
import Movie from './movie'
import { Link } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import Banner from './banner'
import FlashMessage from '../../component/flashMessage'
import './pagination.css'

const menu = [
  { name: 'Now Playing' , path: 'movie/now_playing' } ,
  { name: 'Popular' , path: 'movie/popular' } ,
]

class Home extends Component {
  constructor(props) {
    super(props)
  }

  static contextType = MovieContext
  tempCart = []

  state = {
    menuSelect: '' ,
    loading: false ,
    currentPage: 1 ,
    pageRangeDisplay: 0 ,
    totalResult: 0 ,
    cart: []
  }

  componentDidMount() {
    const { action , movieStateUrl } = this.context
    let currentUrl = queryString.parse(this.props.location.search)
    if (currentUrl.page !== undefined) {
      action.setCurrentUrl(`/${currentUrl.page}`)
      this.updateMovies(currentUrl.page , movieStateUrl.path)
    } else {
      action.setCurrentUrl(`/`)
      this.updateMovies(1 , movieStateUrl.path)
    }
  }

  componentWillReceiveProps(nextProps) {
    // let movieId = nextProps.match.params.movieId
    // let path = nextProps.match.path
    // if (nextProps.match.params.movieId == this.state.movieID) {
    //   return 
    // } else {
    //   this.fetchMovie(movieId , path)
    // }
  }

  componentDidUpdate() {
    const { cart } = this.context
    this.tempCart = cart
  }

  // render per movie
  renderMovie = movies => {
    return movies.length !== 0 ? movies.results.map((movie , i) => (
      <Movie key={i} details={movie} tempCart={this.tempCart} />
    )) : (
      <h1>Loading...</h1>
    )
  }

  // updated movies
  updateMovies = (currentPage , url) => {
    const { action } = this.context
    fetch(fetchUrl(apikey , url , `&region=ID&page=${currentPage}`))
    .then(res => res.json())
    .then(data => {
      action.setMoviesTrending(data , moviesTrending => {
        if (currentPage == 1) {
          this.props.history.push(`/`)   
          this.setState({ loading: false , currentPage: 1 , pageRangDisplayed: data.results.length , totalResult: data.total_pages })
        } else {
          this.props.history.push(`/?page=${currentPage}`)
          this.setState({ loading: false , currentPage , pageRangDisplayed: data.results.length , totalResult: data.total_pages })
        }
      })
    })
    .catch(err => console.error(err))
  }

  // handlechange per page
  handlePageChange = pageNumber => {
    const { action , movieStateUrl } = this.context
    action.setCurrentPage(pageNumber , currentPage => {
      this.setState({ loading: true })
      this.updateMovies(currentPage , movieStateUrl.path)
      console.log('this props after render' , this.props)
    })
  }

  onMenuSelected = menu => {
    const { action } = this.context
    action.setMovieStateUrl(menu , state => {
      this.updateMovies(1 , state.path)
    })
  }

  render() {
    const {
      moviesTrending , 
      movieStateUrl ,
      flashMessage ,
      action
    } = this.context
    return (
      <React.Fragment>
        {flashMessage && <FlashMessage text='duid tidak cukup' onClick={() => action.setFlashMessage(false)} />}
        <div className='w-full'>
          <Banner />
          <Menu onMenuSelected={this.onMenuSelected} />
          { this.state.loading ? (
            <h1>loading...</h1>
          ) : (
            <React.Fragment>
              <div className='mt-10'>
                <div className="container mx-auto">
                  <h1 className='ml-5 mb-3 font-sans font-normal text-green'>{ movieStateUrl.name }</h1>
                </div>
                <div className="movie-container container mx-auto flex flex-wrap items-center">
                  {this.renderMovie(moviesTrending)}
                </div>
              </div>
            </React.Fragment>
          ) }
          <Pagination 
            activePage={this.state.currentPage}
            itemsCountPerPage={2} 
            totalItemsCount={this.state.totalResult}
            pageRangDisplayed={this.state.pageRangeDisplay}
            onChange={this.handlePageChange}
          />
        </div>
      </React.Fragment>
    )
  }

}

class Menu extends Component {
  constructor(props) {
    super(props) 
  }

  state = {
    menuSelected: ''
  }

  onMenuSelect = menu => {
    this.setState({ menuSelected: menu } , () => {
      this.props.onMenuSelected(menu)
    })
  }

  render() {
    return (
      <div className='container mx-auto flex justify-center'>
        {menu.map((menu , i) => (
          <div className="menu-list mr-5 text-md text-grey cursor-pointer" onClick={() => this.onMenuSelect(menu)}>{menu.name}</div>
        ))}
      </div>  
    )
  }
}

export default Home