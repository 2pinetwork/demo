export const isNumber =
  RegExp.prototype.test.bind(/^\d+\.?\d*$/)

export const unsafeHasEnoughtFunds = (vault, amount) => {
  if (vault.token === 'matic') {
    amount = (+amount) + 0.025
  }

  return vault.balance.gte(amount)
}

export const validateDeposit = (vault, amount) => {
  if (! isNumber(amount)) {
    return 'Must be a number.'
  }

  if ((+amount) <= 0) {
    return 'Must be greater than zero.'
  }

  if (! unsafeHasEnoughtFunds(vault, amount)) {
    return (vault.token === 'matic')
      ? 'You don’t have enough funds (MATIC requires extra 0.025 to deposit).'
      : 'You don’t have enough funds.'
  }

  return null
}

export const validateWithdraw = (vault, amount) => {
  if (! isNumber(amount)) {
    return 'Must be a number.'
  }

  if ((+amount) <= 0) {
    return 'Must be greater than zero.'
  }

  if (vault.deposited.lt(amount)) {
    return 'Can’t be more than your deposits.'
  }

  return null
}
