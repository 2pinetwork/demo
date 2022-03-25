import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toNumber } from '@/lib/locales'
import { toBigNumber, toHuman, toNative } from '@/lib/math'
import { dropNotificationGroup, useStore } from '@/store'
import { txSent, txSuccess, txError } from '@/utils/transactions'
import { validateWithdraw } from '@/utils/validations'
import Max from './Max'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  OutlinedInput,
  Typography
} from '@mui/material'

const Withdraw = ({ vault }) => {
  const [ {}, dispatch ]                     = useStore()
  const [ value, setValue ]                  = useState('')
  const [ error, setError ]                  = useState()
  const [ isPending, setIsPending ]          = useState(false)
  const { deposited }                        = vault

  const isDisabled = isPending || typeof vault.withdraw !== 'function'

  const buttonLabel = (isPending)
    ? 'Withdrawing...'
    : 'Withdraw'

  const onChange = ({ target }) => setValue(target.value)
  const onMax    = () => setValue(
    toNumber(toHuman(deposited, vault.decimals), { precision: vault.decimals.toNumber() })
  )

  const onSubmit = async () => {
    const chainId = vault.chainId
    const amount  = await nativeAmount(vault, value)
    const error   = validateWithdraw(vault, amount)

    // Update the displayed error message and abort if there's an error
    setError(error)
    if (error) return

    setIsPending(true)

    try {
      const transaction = await withdraw(vault, value)

      setValue('')
      setIsPending(false)
      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawSent(chainId, transaction.hash))

      const receipt = await transaction.wait()

      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawSuccess(chainId, receipt.transactionHash))
    } catch (error) {
      setIsPending(false)
      dispatch(dropNotificationGroup('withdraws'))
      dispatch(withdrawError(chainId, error))
    }
  }

  return (
    <React.Fragment>
      <Typography component="div" variant="body1" color="grey.400">
        Deposited ({deposited ? toNumber(toHuman(deposited, vault.decimals), { precision: 6 }) : '-'} {vault.token.toUpperCase()})
      </Typography>

      <Box component="div" sx={{ mt: 2 }}>
        <FormControl error={!!error} variant="outlined" fullWidth>
          <OutlinedInput id="deposited"
                         value={value}
                         size="small"
                         endAdornment={<Max onClick={onMax} />}
                         disabled={isDisabled}
                         onChange={onChange}
                         error={!!error}
                         fullWidth
                         sx={{ py: 0.5 }} />
          <FormHelperText id="deposited-error-text">{error}</FormHelperText>
        </FormControl>
      </Box>

      <Button variant="outlined"
              color="primary"
              size="small"
              disabled={isDisabled}
              fullWidth
              onClick={onSubmit}
              sx={{ mt: 2, py: 0.75 }}>
        {buttonLabel}
      </Button>
    </React.Fragment>
  )
}

Withdraw.propTypes = {
  vault: PropTypes.object
}

export default Withdraw



// -- HELPERS --

const withdrawSent = (chainId, hash) => {
  return txSent('withdraws', 'withdraw', chainId, hash)
}

const withdrawSuccess = (chainId, hash) => {
  return txSuccess('withdraws', 'withdraw', chainId, hash)
}

const withdrawError = (chainId, error) => {
  return txError('withdraws', 'withdraw', chainId, error)
}

const nativeAmount = (vault, amount) => {
  const { decimals, sharePrice } = vault
  const price                    = sharePrice.toString()
  const precision                = toBigNumber(10).pow(decimals.toString())
  const shares                   = toBigNumber(amount).times(price).div(precision)

  return toNative(shares, decimals)
}

const withdraw = async (vault, amount) => {
  const amountNative = nativeAmount(vault, amount)

  return await vault.withdraw(amountNative)
}
