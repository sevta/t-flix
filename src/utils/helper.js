import currencyFormatter from 'currency-formatter'


const calculatePrice = rating => {
  let fixRating = parseInt(rating)
  let price = 0

  if (fixRating == 0 && fixRating <= 3) {
    price = 3500
  } else if (fixRating > 3 && fixRating <= 6) {
    price = 8250
  } else if (fixRating > 6 && fixRating <= 8) {
    price = 16360
  } else if (fixRating > 8 && fixRating <= 10) {
    price = 21250
  } else {

  }

  return currencyFormatter.format(price , { code: 'IDR' })
}

export {
  calculatePrice
}