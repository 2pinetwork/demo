import BigNumber from 'bignumber.js'

// -- NUMBERS --

export const toBigNumber = number => {
  // Is `BigNumber`, but not `Ethers.BigNumber`
  if (BigNumber.isBigNumber(number) && !('_hex' in number)) {
    return number
  }

  return new BigNumber(number.toString())
}

// Convert numbers from native integer-only representation
// to _real_ numbers (with decimal precision).
export const toHuman = (integer, decimals) => {
  if (integer  === undefined) throw new TypeError('Missing number')
  if (decimals === undefined) throw new TypeError('Missing decimal precision')

  const bigInt           = toBigNumber(integer)
  const adjustmentFactor = toBigNumber(10).pow(decimals.toString())

  return bigInt.div(adjustmentFactor)
}

// Convert _real_ numbers to native integer-only representation
export const toNative = (number, decimals) => {
  if (number   === undefined) throw new TypeError('Missing number')
  if (decimals === undefined) throw new TypeError('Missing decimal precision')

  const bigNumber        = toBigNumber(number)
  const adjustmentFactor = toBigNumber(10).pow(decimals.toString())

  return bigNumber.times(adjustmentFactor).toFixed(0, BigNumber.ROUND_DOWN)
}
