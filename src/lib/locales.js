export const toNumber = (number, { compact = false, precision = 2 } = {}) => {
  const { max, min } = parsePrecision(precision)

  const options = {
    notation:              (compact) ? 'compact' : 'standard',
    minimumFractionDigits: min,
    maximumFractionDigits: max
  }

  return new Intl.NumberFormat('en-US', options).format(+number)
}

export const toCurrency = (number, { compact = false, precision = 2 } = {}) => {
  const { max, min } = parsePrecision(precision)

  const options = {
    notation:              (compact) ? 'compact' : 'standard',
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: min,
    maximumFractionDigits: max
  }

  return new Intl.NumberFormat('en-US', options).format(+number)
}

export const toPercentage = (number, { precision = 2 } = {}) => {
  const { max, min } = parsePrecision(precision)

  const options = {
    style:                 'percent',
    minimumFractionDigits: min,
    maximumFractionDigits: max
  }

  return new Intl.NumberFormat('en-US', options).format(+number)
}

const parsePrecision = precision => {
  return (typeof precision === 'number')
    ? { max: precision, min: precision }
    : precision || {}
}
