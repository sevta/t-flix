const apikey = 'e2543544966bf88a795a2ebb6a4a9c46'
const apiUrl = 'https://api.themoviedb.org/3/'
const imgUrl = 'https://image.tmdb.org/t/p/'

const fetchUrl = (key , url , query) => {
  let fetchurl
  if (!key) {
    console.warn('api key required')
  } else {
    if (query) {
      fetchurl = `${apiUrl}${url}?api_key=${key}${query}`
    } else {
      fetchurl = `${apiUrl}${url}?api_key=${key}`
    }
  }

  
  return fetchurl
}

export {
  apikey , 
  apiUrl ,
  imgUrl ,
  fetchUrl
}